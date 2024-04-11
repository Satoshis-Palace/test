import { SecretNetworkClient, TxResponse, TxResultCode } from 'secretjs';
import dotenv from 'dotenv';
import { Answer } from "../../modules/answer"
import { All_nft_info_answer, Mint_nft_answer, Snip721, ViewerInfo, Viewing_key_answer } from '../../modules/snip721';
import { Mint_answer, Set_viewing_key_answer, Snip20 } from '../../modules/snip20';
import { getSecretNetworkClient } from '../../modules/shared/utils/config';
import { Contract } from '../../modules/shared';
import { AnswerDeployment } from "../../deployment"


dotenv.config();

describe('Answer Contract', () => {
	let secretjs: SecretNetworkClient;
	let answer: Answer;
	let wallet_2 = "secret160se29szxttl0xufrm2qwjquszl87px0ls46y6"

	beforeAll(async () => {
		secretjs = getSecretNetworkClient()

		const answerDeployment = new AnswerDeployment(secretjs)
		answer = await answerDeployment.deployContract({})
	});
	test('Contracts should be uploaded and instantiated', () => {
		expect(answer.getContractAddress()).toBeTruthy();
	});
	test('Should be able to view the owner', async () => {
		const response = await answer.getOwner()
		expect(response).toStrictEqual({ "owner": secretjs.address })
	});
	test('Should be able to add a provider', async () => {
		let response: TxResponse = await answer.addProvider(secretjs.address)
		expect(response.code).toEqual(TxResultCode.Success)
	});
	test('Should be able to add a second provider', async () => {
		let response: TxResponse = await answer.addProvider(wallet_2)
		expect(response.code).toEqual(TxResultCode.Success)
	});
	test('Should be able to view providers', async () => {
		const response = await answer.getProviders()
		console.log(response)
		expect(response).toStrictEqual({ "providers": ['secret160se29szxttl0xufrm2qwjquszl87px0ls46y6','secret104azxgnwlpt2v2paxv7my03rumv48kltqysdgn'] })
	});
	test('Should be able to remove a provider', async () => {
		let response: TxResponse = await answer.removeProvider(wallet_2)
		expect(response.code).toEqual(TxResultCode.Success)
	});
	test('Should be able to view providers', async () => {
		const response = await answer.getProviders()
		expect(response).toStrictEqual({ "providers": ['secret104azxgnwlpt2v2paxv7my03rumv48kltqysdgn'] })
	});
	let id = "Test"
	let value = 1
	test('Should be to post result', async () => {
		let response: TxResponse = await answer.postResult(id, value)
		expect(response.code).toEqual(TxResultCode.Success)
	});
	test('Should not be able to post same result', async () => {
		let response: TxResponse = await answer.postResult(id, value)
		expect(response.code).toEqual(3)
	});
	let id_2 = "Test2"
	test('Should be to post 2nd result', async () => {
		let response: TxResponse = await answer.postResult(id_2, value)
		expect(response.code).toEqual(TxResultCode.Success)
	});
	test('Should be able to view a result', async () => {
		const response = await answer.getResult(id)
		expect(response).toStrictEqual({ "result": 1 })
		const response_2 = await answer.getResult(id_2)
		expect(response_2).toStrictEqual({ "result": 1 })
	});
	test('Should be able to view a detailed result', async () => {
		const response = await answer.getDetailedResult(id)
		console.log(response)
		expect(response).toStrictEqual({
			"result": {
				"id": 'Test',
				"order_id": 1,
				"provider": 'secret104azxgnwlpt2v2paxv7my03rumv48kltqysdgn',
				"result": 1
			}
		}
		)
	});
});