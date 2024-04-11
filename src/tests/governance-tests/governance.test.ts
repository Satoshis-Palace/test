import { SecretNetworkClient, TxResponse } from 'secretjs';
import dotenv from 'dotenv';
import { getSecretNetworkClient } from '../../modules/shared/utils/config';
import { ContractInfo, readContractCode } from '../../modules/shared';
import { InstantiateMsg, Governance, GovernanceFactory, Proposal } from '../../modules/governance'
import { Snip721 } from '../../modules/snip721';
import { Snip721Deployment} from '../../deployment'
dotenv.config();


const CONTRACT_CODE_PATH = "./wasm/governance.wasm.gz";

describe('Governance Contract', () => {
	let secretjs: SecretNetworkClient;
	let snip721: Snip721;
	let governance: Governance;
	let governanceFactory: GovernanceFactory
	beforeAll(async () => {
		secretjs =  getSecretNetworkClient()
		governanceFactory = new GovernanceFactory(secretjs)
		const snip721Deployment = new Snip721Deployment(secretjs)
		snip721 = await snip721Deployment.getCurrentDeployment()

		// Read contract wasm
        const contractWasm = readContractCode(CONTRACT_CODE_PATH);

        // Instantiate CounterContract
        const initMsg: InstantiateMsg = {
			staking_contract: snip721.getContractInfo(),
			oracle_contract: snip721.getContractInfo()
		};
        governance = await governanceFactory.createGovernanceContract(initMsg, snip721.getContractInfo(), contractWasm);
	});

	test('Contract should be uploaded and instantiated', () => {
		expect(snip721.getContractAddress()).toBeTruthy();
		expect(governance.getContractAddress()).toBeTruthy();

	});
	// test('should be able to set snip20 viewing key', async () => {
	// 	snip20ViewingKey = "lsieujfvbnawpsioufbasldoiufbasdioufb"
	// 	const txResponse: TxResponse = await snip20.set_viewing_key(snip20ViewingKey)
	// 	const answer: Set_viewing_key_answer = Contract.parseTransactionData<Set_viewing_key_answer>(txResponse)
	// 	expect(answer.set_viewing_key.status).toBe("success")
	// });

	test('should be able to see NFT has been sent to the Goveranace Contract', async () => {
		let nft = Math.random().toString()
		let txResponse: TxResponse = await governance.mintNFT(nft)
		// console.log(txResponse)
		txResponse = await governance.stakeNFT(nft)
		// console.log(txResponse)
		let stake = await governance.checkStake("secret160se29szxttl0xufrm2qwjquszl87px0ls46y6")
		// console.log(stake)
	});
	
	test('should be able to create a proposal if you are staked', async () => {

		let txResponse: TxResponse = await governance.createProposal("test_proposal", "test description", true)
		console.log(txResponse)

	});
	test('should be able to vote on a proposal if you are staked', async () => {

		let txResponse: TxResponse = await governance.vote(1, 1)
		console.log(txResponse)

	});
	test('should be able to view a proposal', async () => {

		const proposal: Proposal = await governance.getProposal(1)
		console.log(proposal)

	});

});