// contract.ts
import { SecretNetworkClient, TxResponse } from "secretjs";
import { Contract, ContractFactory, ContractInfo, Uint128 } from "../shared";
import { AddProvider, ExecuteMsg, GetDetailedResult, GetDetailedResultResponse, GetOwner, GetOwnerResponse, GetProviders, GetContestResult, GetResultResponse, InstantiateMsg, ListProvidersResponse, PostResult, QueryMsg, QueryResponse, RemoveProvider } from "./types";




export class Answer extends Contract<ExecuteMsg, QueryMsg, QueryResponse> {
	constructor(answerInfo: ContractInfo, secretjs: SecretNetworkClient) {
		super(answerInfo.address, answerInfo.code_hash, secretjs);
	}

	async addProvider(
		provider: string,
	): Promise<TxResponse> {
		const msg: AddProvider = {
			add_provider: {
				provider: provider
			}
		}
		const gasLimit = 120_000;
		return this.execute(
			msg,
			gasLimit
		)
	}
	async removeProvider(
		provider: string,
	): Promise<TxResponse> {
		const msg: RemoveProvider = {
			remove_provider: {
				provider: provider
			}
		}
		const gasLimit = 120_000;
		return this.execute(
			msg,
			gasLimit
		)
	}
	async postResult(
		id: string,
		result_value: number
		): Promise<TxResponse> {
		const msg: PostResult = {
			post_result: {
				id: id,
				result_value: result_value
			}
		}
		const gasLimit = 120_000;
		return this.execute(
			msg,
			gasLimit
		)
	}
	async getResult(id: string): Promise<GetResultResponse> {
		const msg: GetContestResult = {
			get_contest_result: {
				id: id
			}
		}
		// This will either return GetAllDividendInfosResponse or throw the TxResponse error
		return await this.query(msg) as GetResultResponse;
	}
	async getDetailedResult(id: string): Promise<GetDetailedResultResponse> {
		const msg: GetDetailedResult = {
			get_detailed_result: {
				id: id
			}
		}
		// This will either return GetAllDividendInfosResponse or throw the TxResponse error
		return await this.query(msg) as GetDetailedResultResponse;
	}
	async getProviders(): Promise<ListProvidersResponse> {
		const msg: GetProviders = {
			get_providers: {}
		}
		// This will either return GetAllDividendInfosResponse or throw the TxResponse error
		return await this.query(msg) as ListProvidersResponse;
	}
	async getOwner(): Promise<GetOwnerResponse> {
		const msg: GetOwner = {
			get_owner: {}
		}
		// This will either return GetAllDividendInfosResponse or throw the TxResponse error
		return await this.query(msg) as GetOwnerResponse;
	}
}


export class AnswerFactory extends ContractFactory {

	// New method for creating CounterContract instances
	async createAnswerContract(initMsg: InstantiateMsg, contractWasm: Buffer): Promise<Answer> {
		const answerInfo: ContractInfo = await this.createContract<InstantiateMsg>(initMsg, contractWasm)
		return new Answer(answerInfo, this.secretjs);
	}
}