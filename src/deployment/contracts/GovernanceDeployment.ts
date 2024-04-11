import { SecretNetworkClient } from "secretjs";
import { Deployment } from "../Deployment"
import { ContractInfo } from "../../modules/shared/contract/types";
import { readContractCode } from "../../modules/shared";
import { InstantiateMsg } from "../../modules/governance/types";
import { Governance, GovernanceFactory } from "../../modules/governance/Governance";
import { GOVERNANCE_CONTRACT_CODE_PATH, GOVERNANCE_INFO_FILE_PATH, SNIP721_INFO_FILE_PATH } from "./constants";

import { contractInfo as governanceInfo } from '../artifacts/governance-info';
import { contractInfo as snip721Info } from '../artifacts/snip721-info';

export interface GovernanceDeploymentOptions {
	snip721Info: ContractInfo,
	updateCurrent?: boolean, //Assumes false if not passed
}

export class GovernanceDeployment extends Deployment<Governance, GovernanceFactory> {
	constructor(secretjs: SecretNetworkClient) {
		super(secretjs, new GovernanceFactory(secretjs));
	}

	public async deployContract(options: GovernanceDeploymentOptions): Promise<Governance> {
		const contractWasm = readContractCode(GOVERNANCE_CONTRACT_CODE_PATH);
		const initMsg: InstantiateMsg = {
			staking_contract: {
				code_hash: "430269fe2ba7c4bc5d6335720db972f599de404113ce643649caea9517789039",
				address: "secret1vzy9uud40xznlfwjy8qft2rrr4t82hgw5vak4s",
			  },
			  oracle_contract: {
				code_hash: "430269fe2ba7c4bc5d6335720db972f599de404113ce643649caea9517789039",
				address: "secret1vzy9uud40xznlfwjy8qft2rrr4t82hgw5vak4s",
			  }
		}; // Initialize your InstantiateMsg here
		const governance: Governance = await this.contractFactory.createGovernanceContract(initMsg, options.snip721Info, contractWasm);

		if (options.updateCurrent) {
			this.writeContractInfo(GOVERNANCE_INFO_FILE_PATH, governance.getContractInfo());
			// this.writeContractInfo(SNIP721_INFO_FILE_PATH, options.snip20Info);
		}
		return governance;
	}

	public getCurrentDeployment(): Governance {

		return new Governance(governanceInfo, snip721Info, this.secretjs);

	}
}