import dotenv from 'dotenv';
import { SecretNetworkClient, TxResponse, TxResultCode } from 'secretjs';
import { getSecretNetworkClient } from '../../modules/shared/utils/config';
import { Mint_answer, Set_viewing_key_answer, Snip20 } from '../../modules/snip20';
import { Contract } from '../../modules/shared/contract';
import { Slots } from "../../modules/slots"
import { SlotsDeployment, Snip20Deployment } from "../../deployment"

dotenv.config();


describe('Slots Contract', () => {
	let secretjs: SecretNetworkClient;
	let snip20: Snip20;
	let snip20ViewingKey: string;
	let slots: Slots;

	beforeAll(async () => {
		secretjs = getSecretNetworkClient()
		const snip20Deployment = new Snip20Deployment(secretjs)
		snip20 = await snip20Deployment.deployContract({})

		const slotsDeployment: SlotsDeployment = new SlotsDeployment(secretjs)
		slots = await slotsDeployment.deployContract({
			snip20Info: snip20.getContractInfo()
		})
	});

	test('Contract should be uploaded and instantiated', () => {
		expect(snip20.getContractAddress()).toBeTruthy();
		expect(slots.getContractAddress()).toBeTruthy();

	});
	test('should be able to set snip20 viewing key', async () => {
		snip20ViewingKey = "lsieujfvbnawpsioufbasldoiufbasdioufb"
		const txResponse: TxResponse = await snip20.set_viewing_key(snip20ViewingKey)
		const answer: Set_viewing_key_answer = Contract.parseTransactionData<Set_viewing_key_answer>(txResponse)
		expect(answer.set_viewing_key.status).toBe("success")
	});

	let userbalance = "100"
	let contractbalance = "1000000"
	test('should successfully mint snip20 tokens to user and contract', async () => {
		let txResponse: TxResponse = await snip20.mint(secretjs.address, userbalance)
		let mintAnswer: Mint_answer = Contract.parseTransactionData<Mint_answer>(txResponse)
		expect(mintAnswer.mint.status).toBe("success")

		txResponse = await snip20.mint(slots.getContractAddress(), contractbalance)
		mintAnswer = Contract.parseTransactionData<Mint_answer>(txResponse)
		expect(mintAnswer.mint.status).toBe("success")
	});



	test('should not be able to play without deposit', async () => {
		const slots_play_fail = await slots.play(userbalance)
		expect(slots_play_fail.code).not.toEqual(TxResultCode.Success)
	});

	test('should not be able to play when deposit happens', async () => {
		const slots_deposit = await slots.deposit(userbalance)
		expect(slots_deposit.code).toEqual(TxResultCode.Success)
		const slots_play = await slots.play(userbalance)
		expect(slots_play.code).toEqual(TxResultCode.Success)
	});

	test('should be able to check our balance', async () => {
		const slots_check_balance = await slots.getDeposit()
		expect(slots_check_balance.get_deposit.amount).toBeTruthy()
	});

	test('should be able to check balance and have it be withdrew amount', async () => {
		const slots_check_balance = await slots.getDeposit()
		const slots_withdraw_amount = await slots.withdraw()
		expect(slots_withdraw_amount.code).toEqual(TxResultCode.Success)
		const user_balance = await snip20.balance(snip20ViewingKey)
		expect(slots_check_balance.get_deposit.amount).toEqual(user_balance)
	});

});