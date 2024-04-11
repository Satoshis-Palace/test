import { SecretNetworkClient, TxResponse } from 'secretjs';
import dotenv from 'dotenv';
import { Exchange } from "../../modules/exchange"
import { All_nft_info_answer, Mint_nft_answer, Snip721, ViewerInfo, Viewing_key_answer } from '../../modules/snip721';
import { Mint_answer, Set_viewing_key_answer, Snip20 } from '../../modules/snip20';
import { getSecretNetworkClient } from '../../modules/shared/utils/config';
import { Contract } from '../../modules/shared';
import { ExchangeDeployment, Snip20Deployment, Snip721Deployment } from "../../deployment"


dotenv.config();

describe('Exchange Contract', () => {
	let secretjs: SecretNetworkClient;
	let exchange: Exchange;
	let snip721: Snip721;
	let snip20: Snip20;

	beforeAll(async () => {
		secretjs = getSecretNetworkClient()

		const snip20Deployment = new Snip20Deployment(secretjs)
		snip20 = await snip20Deployment.deployContract({})

		const snip721Deployment = new Snip721Deployment(secretjs)
		snip721 = await snip721Deployment.deployContract({})


		const exchangeDeployment = new ExchangeDeployment(secretjs)
		exchange = await exchangeDeployment.deployContract({
			snip20Info: snip20.getContractInfo(),
			snip721Info: snip721.getContractInfo()
		})
	});

	test('Contracts should be uploaded and instantiated', () => {
		expect(snip721.getContractAddress()).toBeTruthy();
		expect(snip20.getContractAddress()).toBeTruthy();
		expect(exchange.getContractAddress()).toBeTruthy();
	});

	const token_id_1 = "An NFT"
	const token_id_2 = "Another NFT"

	test('Should be to mint NFT to contract', async () => {
		let txResponse: TxResponse = await snip721.mint_nft(exchange.getContractAddress(), token_id_1)
		let mintAnswer: Mint_nft_answer = Contract.parseTransactionData<Mint_nft_answer>(txResponse)
		expect(mintAnswer.mint_nft.token_id).toBe(token_id_1)

		txResponse = await snip721.mint_nft(exchange.getContractAddress(), token_id_2)
		mintAnswer = Contract.parseTransactionData<Mint_nft_answer>(txResponse)
		expect(mintAnswer.mint_nft.token_id).toBe(token_id_2)
	});

	let nft_price: string = ""
	test('Should be to get price of NFT', async () => {
		let response = await exchange.nft_price(token_id_1)
		expect(response.nft_price.token_id == token_id_1)
		expect(response.nft_price.price).toBeTruthy()
		nft_price = response.nft_price.price
	});

	test('Should be to get price of all NFTs and check for specific token IDs', async () => {
		let response = await exchange.all_nft_prices();
		let tokenIds = response.nft_prices.map(nft => nft.token_id);

		// Check that the length of nft_prices array is 2
		expect(response.nft_prices.length).toBe(2);

		// Check if token_id_1 is in the array of tokenIds
		expect(tokenIds).toContain(token_id_1);

		// Check if token_id_2 is in the array of tokenIds
		expect(tokenIds).toContain(token_id_2);
	});

	test('should successfully mint user snip20 tokens', async () => {
		const txResponse: TxResponse = await snip20.mint(secretjs.address, nft_price)
		const mintAnswer: Mint_answer = Contract.parseTransactionData<Mint_answer>(txResponse)
		expect(mintAnswer.mint.status).toBe("success")
	});


	test('should be able to buy NFT', async () => {
		//Buy
		const tx = await exchange.exchange_snip20_for_nft(token_id_1)

		//Set NFT View key
		const viewingKey = "lsieujfvbnawpsioufbasldoiufbasdioufb"
		const txResponse: TxResponse = await snip721.set_viewing_key(viewingKey)
		const answer: Viewing_key_answer = Contract.parseTransactionData<Viewing_key_answer>(txResponse)
		expect(answer.viewing_key.key).toBe(viewingKey)

		// Check owner
		const viewer_info: ViewerInfo = {
			address: secretjs.address,
			viewing_key: viewingKey
		}
		const info: All_nft_info_answer = await snip721.all_nft_info(token_id_1, viewer_info)
		expect(info.all_nft_info.access.owner).toBe(secretjs.address)
	});

	test('should be able to sell NFT', async () => {
		//Buy
		const tx = await exchange.exchange_nft_for_snip20(token_id_1)

		//Set snikp20 View key
		const viewingKey = "lsieujfvbnawpsioufbasldoiufbasdioufb"
		const txResponse: TxResponse = await snip20.set_viewing_key(viewingKey)
		const answer: Set_viewing_key_answer = Contract.parseTransactionData<Set_viewing_key_answer>(txResponse)
		expect(answer.set_viewing_key.status).toBe("success")

		// Check balance
		const balance: string = await snip20.balance(viewingKey)
		expect(balance).toBe(nft_price)
	});
});