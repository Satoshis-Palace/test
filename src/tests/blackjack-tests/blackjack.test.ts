import dotenv from 'dotenv';
import { SecretNetworkClient, TxResponse } from 'secretjs';
import { getSecretNetworkClient } from '../../modules/shared/utils/config';
import { Mint_answer, Set_viewing_key_answer, Snip20 } from '../../modules/snip20';
import { Contract } from '../../modules/shared/contract';
import { BlackJackResponse, Blackjack, DEALER_WIN, PLAYER_WIN } from "../../modules/blackjack"
import { BlackjackDeployment, Snip20Deployment } from "../../deployment"

dotenv.config();



describe('Blackjack Contract', () => {
	let secretjs: SecretNetworkClient;
	let snip20: Snip20;
	let snip20ViewingKey: string;
	let blackjack: Blackjack;

	beforeAll(async () => {
		secretjs = getSecretNetworkClient()
		const snip20Deployment = new Snip20Deployment(secretjs)
		snip20 = await snip20Deployment.deployContract({})

		const blackjackDeployment: BlackjackDeployment = new BlackjackDeployment(secretjs)
		blackjack = await blackjackDeployment.deployContract({
			snip20Info: snip20.getContractInfo()
		})
	});

	test('Contract should be uploaded and instantiated', () => {
		expect(snip20.getContractAddress()).toBeTruthy();
		expect(blackjack.getContractAddress()).toBeTruthy();

	});
	test('should be able to set snip20 viewing key', async () => {
		snip20ViewingKey = "lsieujfvbnawpsioufbasldoiufbasdioufb"
		const txResponse: TxResponse = await snip20.set_viewing_key(snip20ViewingKey)
		const answer: Set_viewing_key_answer = Contract.parseTransactionData<Set_viewing_key_answer>(txResponse)
		expect(answer.set_viewing_key.status).toBe("success")
	});

	test('should be able to set register the snip20 with blackjack', async () => {
		await blackjack.registerSnip20(snip20.getContractInfo())
	});
	let userbalance = "1000"
	let contractbalance = "1000000"
	test('should successfully mint snip20 tokens to user and contract', async () => {
		let txResponse: TxResponse = await snip20.mint(secretjs.address, userbalance)
		let mintAnswer: Mint_answer = Contract.parseTransactionData<Mint_answer>(txResponse)
		expect(mintAnswer.mint.status).toBe("success")

		txResponse = await snip20.mint(blackjack.getContractAddress(), contractbalance)
		mintAnswer = Contract.parseTransactionData<Mint_answer>(txResponse)
		expect(mintAnswer.mint.status).toBe("success")
	});

	test('Max bet', async () => {
		const max_bet = await blackjack.getMaxBet()
		expect(parseInt(max_bet)).toBeLessThan(parseInt(contractbalance));
	});

	test('should be able to play black jack', async () => {
		const tx = await blackjack.play("100")
		const response: BlackJackResponse = await blackjack.getActiveGame()
		expect(response.game).toBeTruthy()
	});

	test('should be able to stand', async () => {
		await blackjack.stand()
		const response: BlackJackResponse = await blackjack.getActiveGame()

		const expectedGameStates = [PLAYER_WIN, DEALER_WIN];
		const gameState = response.game.game_state; // This should return one of the expected values

		expect(expectedGameStates.includes(gameState)).toBe(true);
	});

	test('should be able to play black jack again', async () => {
		const tx = await blackjack.play("100")
		const response: BlackJackResponse = await blackjack.getActiveGame()
		expect(response.game).toBeTruthy()
	});

	test('should be able to hit', async () => {
		await blackjack.hit()
		const response: BlackJackResponse = await blackjack.getActiveGame()
		expect(response.game).toBeTruthy()
	});



});