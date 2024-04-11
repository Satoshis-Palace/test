import { SecretNetworkClient } from "secretjs";
import { Deployment } from "../Deployment"
import { BlackJackFactory as BlackjackFactory, Blackjack } from "../../modules/blackjack/Blackjack";
import { ContractInfo } from "../../modules/shared/contract/types";
import { readContractCode } from "../../modules/shared";
import { InstantiateMsg } from "../../modules/blackjack/types";
import { BLACKJACK_CONTRACT_CODE_PATH, BLACKJACK_INFO_FILE_PATH, SNIP20_INFO_FILE_PATH } from "./constants";


import { contractInfo as blackjackInfo } from '../artifacts/blackjack-info';
import { contractInfo as snip20Info } from '../artifacts/snip20-info';

export interface BlackjackDeploymentOptions {
	snip20Info: ContractInfo,
	updateCurrent?: boolean, //Assumes false if not passed
}

export class BlackjackDeployment extends Deployment<Blackjack, BlackjackFactory> {
	constructor(secretjs: SecretNetworkClient) {
		super(secretjs, new BlackjackFactory(secretjs));
	}

	public async deployContract(options: BlackjackDeploymentOptions): Promise<Blackjack> {
		const contractWasm = readContractCode(BLACKJACK_CONTRACT_CODE_PATH);

		const initMsg: InstantiateMsg = {}; // Initialize your InstantiateMsg here

		const blackjack: Blackjack = await this.contractFactory.createBlackjackContract(initMsg, contractWasm, options.snip20Info);

		if (options.updateCurrent) {
			this.writeContractInfo(BLACKJACK_INFO_FILE_PATH, blackjack.getContractInfo());
		}
		return blackjack;
	}

	public getCurrentDeployment(): Blackjack {
		return new Blackjack(blackjackInfo, snip20Info, this.secretjs);
	}
}