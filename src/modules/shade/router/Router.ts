import { SecretNetworkClient, TxResponse } from "secretjs";

import { Addr, Contract, ContractFactory, ContractInfo } from "../../shared/contract";
import { ExecuteMsg, Hop, InitMsg, InvokeMsg, QueryMsg, QueryMsgResponse, Register_s_n_i_p20_token_msg, Swap_tokens_for_exact_msg } from "./types";
import { Route } from "@shadeprotocol/shadejs";
import { Snip20 } from "../../snip20";



export class Router extends Contract<ExecuteMsg, QueryMsg, QueryMsgResponse> {

	constructor(routerInfo: ContractInfo, secretjs: SecretNetworkClient) {
		super(routerInfo.address, routerInfo.code_hash, secretjs);
	}

	async register_snip20(snip20: ContractInfo): Promise<TxResponse> {
		const msg: Register_s_n_i_p20_token_msg = {
			register_s_n_i_p20_token: {
				token_addr: snip20.address,
				token_code_hash: snip20.code_hash
			}
		}
		const gas_limit = 100_000
		return this.execute(msg, gas_limit)
	}

	async swap(
		inputSnip20: Snip20,
		amount: string,
		expected_return: string,
		path: Hop[],
		recipient?: Addr,
		gasLimit: number = 200_000
	): Promise<TxResponse> {
		const msg: InvokeMsg = {
			swap_tokens_for_exact: {
				expected_return: expected_return,
				path,
				recipient
			}
		}
		return inputSnip20.send(
			this.getContractAddress(),
			amount,
			this.getContractCodeHash(),
			msg,
			gasLimit
		)
	}
}

export class RouterFactory extends ContractFactory {

	async createRouterContract(initMsg: InitMsg, contractWasm: Buffer): Promise<Router> {
		const contractInfo: ContractInfo = await this.createContract<InitMsg>(initMsg, contractWasm)

		return new Router(contractInfo, this.secretjs);
	}
}