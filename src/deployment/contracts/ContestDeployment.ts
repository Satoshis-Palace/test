import { SecretNetworkClient } from "secretjs";
import { Deployment } from "../Deployment"
import { ContractInfo } from "../../modules/shared/contract/types";
import { Contract, readContractCode } from "../../modules/shared";
import { CONTEST_CONTRACT_CODE_PATH, CONTEST_INFO_FILE_PATH, SATOSHIS_PALACE_SIGNING_ADDRESS } from "./constants";


import { contractInfo as contestInfo } from '../artifacts/contest-info';
import { contractInfo as oracleInfo } from '../artifacts/contest-info';
import { contractInfo as snip20Info } from '../artifacts/snip20-info';
import { ContestFactory, Contests } from "../../modules/contests/Contests";
import { InstantiateMsg } from "../../modules/contests";

export interface ContestsDeploymentOptions {
	snip20Info: ContractInfo,
	masterViewingKeyInfo: ContractInfo
	updateCurrent?: boolean, //Assumes false if not passed
}

export class ContestsDeployment extends Deployment<Contests, ContestFactory> {
	constructor(secretjs: SecretNetworkClient) {
		super(secretjs, new ContestFactory(secretjs));
	}

	public async deployContract(options: ContestsDeploymentOptions): Promise<Contests> {
		const contractWasm = readContractCode(CONTEST_CONTRACT_CODE_PATH);

		const initMsg: InstantiateMsg = {
			entropy: await Contract.generateEntropy(),
			master_viewing_key_contract: options.masterViewingKeyInfo,
			oracle_contract_info: oracleInfo,
			satoshis_palace: SATOSHIS_PALACE_SIGNING_ADDRESS,
			snip20: options.snip20Info
		}

		const contests: Contests = await this.contractFactory.createContestContract(initMsg, contractWasm);

		if (options.updateCurrent) {
			this.writeContractInfo(CONTEST_INFO_FILE_PATH, contests.getContractInfo());
		}
		return contests;
	}

	public getCurrentDeployment(): Contests {
		return new Contests(contestInfo, snip20Info, this.secretjs);
	}
}