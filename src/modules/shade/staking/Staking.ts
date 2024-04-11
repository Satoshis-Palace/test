import { SecretNetworkClient, TxResponse } from "secretjs";

import { Contract, ContractFactory, ContractInfo } from "../../shared/contract";
import { ExecuteMsg, InitMsg, QueryMsg, QueryResponse } from "./types";



export class Staking extends Contract<ExecuteMsg, QueryMsg, QueryResponse> {
	constructor(factoryInfo: ContractInfo, secretjs: SecretNetworkClient) {
		super(factoryInfo.address, factoryInfo.code_hash, secretjs);
	}

}

export class StakingFactory extends ContractFactory {

	async createStakingContract(initMsg: InitMsg, contractWasm: Buffer, snip20Info: ContractInfo): Promise<Staking> {
		const contractInfo: ContractInfo = await this.createContract<InitMsg>(initMsg, contractWasm)

		return new Staking(contractInfo, this.secretjs);
	}
}