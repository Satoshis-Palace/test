import dotenv from 'dotenv';
import { SecretNetworkClient, TxResponse, TxResultCode } from 'secretjs';
import { getSecretNetworkClient } from '../../modules/shared/utils/config';
import { Mint_answer, Set_viewing_key_answer, Snip20 } from '../../modules/snip20';
import { Contests, UserBetResponse } from "../../modules/contests"
import { ContestsDeployment, MasterViewingKeyDeployment, Snip20Deployment } from "../../deployment"
import { ContestInfo } from '../../modules/contests/types/common_types';
import { Contract } from '../../modules/shared';
import { CONTEST_INFO, CONTEST_INFO_SIG } from "../contests-tests/constants"
import { MasterViewingKey } from '../../modules/master-viewing-key';

dotenv.config();



describe('Contests Contract', () => {
	let secretjs: SecretNetworkClient;
	let snip20: Snip20;
	let snip20ViewingKey: string;
	let contests: Contests;
	let masterViewingKey: MasterViewingKey;


	beforeAll(async () => {
		secretjs = getSecretNetworkClient()
		const snip20Deployment = new Snip20Deployment(secretjs)
		snip20 = await snip20Deployment.deployContract({})

		const masterViewingKeyDeployment = new MasterViewingKeyDeployment(secretjs)
		masterViewingKey = await masterViewingKeyDeployment.deployContract({});

		const contestsDeployment = new ContestsDeployment(secretjs)
		contests = await contestsDeployment.deployContract({
			snip20Info: snip20.getContractInfo(),
			masterViewingKeyInfo: masterViewingKey.getContractInfo()
		})
	});

	test('Contracts should be uploaded and instantiated', () => {
		expect(snip20.getContractAddress()).toBeTruthy();
		expect(contests.getContractAddress()).toBeTruthy();
		expect(masterViewingKey.getContractAddress()).toBeTruthy();
	});

	test('should be able to set snip20 viewing key', async () => {
		snip20ViewingKey = "lsieujfvbnawpsioufbasldoiufbasdioufb"
		const txResponse: TxResponse = await snip20.set_viewing_key(snip20ViewingKey)
		const answer: Set_viewing_key_answer = Contract.parseTransactionData<Set_viewing_key_answer>(txResponse)
		expect(answer.set_viewing_key.status).toBe("success")
	});

	let userbalance = "1000"
	test('should successfully mint snip20 tokens to user', async () => {
		let txResponse: TxResponse = await snip20.mint(secretjs.address, userbalance)
		let mintAnswer: Mint_answer = Contract.parseTransactionData<Mint_answer>(txResponse)
		expect(mintAnswer.mint.status).toBe("success")
	});
	let outcome_to_bet_on = 1
	let amount_to_bet = "100"

	let minimum_bet = "100"
	let less_than_minimum_bet = "99"
	test('Set Minimum Bet', async () => {
		const tx = await contests.setMinimumBet(minimum_bet)
		expect(tx.code).toBe(TxResultCode.Success)
	});

	test('query maximum bet', async () => {
		let response = await contests.getMinimumBet()
		expect(response.minimum_bet.minimum_bet).toBe(minimum_bet)
	});

	test('Cannot Create Contest with less than min bet', async () => {
		const tx = await contests.createContest(CONTEST_INFO, CONTEST_INFO_SIG, outcome_to_bet_on, less_than_minimum_bet)
		expect(tx.code).not.toBe(TxResultCode.Success)
	});

	test('Create Contest', async () => {
		const tx = await contests.createContest(CONTEST_INFO, CONTEST_INFO_SIG, outcome_to_bet_on, amount_to_bet)
		expect(tx.code).toBe(TxResultCode.Success)
	});

	test(' Get Active Contests', async () => {
		const response = await contests.getActiveContests()
		expect(response.contest_data_list.contests.length).toBe(1)
	});


	let viewingKey = "lsieujfvbnawpsioufbasldoiufbasdioufb"

	test('should be able to set master viewing key', async () => {
		const txResponse: TxResponse = await masterViewingKey.set_viewing_key(viewingKey)
		expect(txResponse.code).toBe(TxResultCode.Success)
	});

	test('should be able to query user bet with master viewkey', async () => {
		let response: UserBetResponse;
		try {
			response = await contests.getUserBet(CONTEST_INFO.id, viewingKey)
			expect(response.user_bet.bet.amount).toBe(amount_to_bet)
			expect(response.user_bet.bet.outcome_id).toBe(outcome_to_bet_on)
			expect(response.user_bet.bet.has_been_paid).toBe(false)
		} catch (error: any) {
			console.error(error)
			fail(error)
		}
	});

	test('Query Bet with Invalid viewkey should error', async () => {
		await expect(contests.getUserBet(CONTEST_INFO.id, "invalid viewingKey"))
			.rejects
			.toThrow();
	});

	test('Bet same side', async () => {
		const tx = await contests.betContest(CONTEST_INFO.id, outcome_to_bet_on, amount_to_bet)
		expect(tx.code).toBe(TxResultCode.Success)
	});

	test('Cannot Bet Contest with less than min bet', async () => {
		const tx = await contests.betContest(CONTEST_INFO.id, outcome_to_bet_on, less_than_minimum_bet)
		expect(tx.code).not.toBe(TxResultCode.Success)
	});

	let opposite_side = 2
	test('Cannot Bet opposite side same user', async () => {
		const tx = await contests.betContest(CONTEST_INFO.id, opposite_side, amount_to_bet)
		expect(tx.code).not.toBe(TxResultCode.Success)
	});

	let total_amount_bet = "200"
	test('query updated bet', async () => {
		let response: UserBetResponse;
		try {
			response = await contests.getUserBet(CONTEST_INFO.id, viewingKey)
			expect(response.user_bet.bet.amount).toBe(total_amount_bet)
			expect(response.user_bet.bet.outcome_id).toBe(outcome_to_bet_on)
			expect(response.user_bet.bet.has_been_paid).toBe(false)
		} catch (error: any) {
			console.error(error)
			fail(error)
		}
	});

	test('Get Users Bets', async () => {
		let response = await contests.getUsersBets(viewingKey)
		expect(response.users_bets.contests_bets.length).toBe(1)
	});

	test('query snip20', async () => {
		let response = await contests.getSnip20()
		expect(response.snip20.snip20.address).toBeDefined()
		expect(response.snip20.snip20.code_hash).toBeDefined()
	});



});
