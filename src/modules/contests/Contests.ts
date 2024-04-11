// contract.ts
import { SecretNetworkClient, TxResponse } from "secretjs";
import { Contract, ContractFactory, ContractInfo, Uint128 } from "../shared";
import { Snip20 } from "../snip20";
import { ContestInfo } from "./types/common_types";
import { BetContest, Claim, ClaimMultiple, ContestDataListResponse, ContestDataResponse, ContestQuerySortOrder, CreateContest, ExecuteMsg, GetActiveContests, GetContest, GetContests, GetMinBet, GetSnip20, GetSnip20Response, GetUserBet, GetUsersBets, InstantiateMsg, MinimumBetResponse, QueryMsg, QueryResponse, SetMinimumBet, UserBetResponse, UsersBetsQueryFilters, UsersBetsResponse } from "./types";



export class Contests extends Contract<ExecuteMsg, QueryMsg, QueryResponse> {
	private snip20: Snip20;
	constructor(exchangeInfo: ContractInfo, snip20Info: ContractInfo, secretjs: SecretNetworkClient) {
		super(exchangeInfo.address, exchangeInfo.code_hash, secretjs);
		this.snip20 = new Snip20(snip20Info, secretjs)
	}

	////////////// Executes ///////////////
	async createContest(contest_info: ContestInfo, contest_info_signature_hex: string, outcome_id: number, amount: Uint128): Promise<TxResponse> {
		const invokeMsg: CreateContest = {
			create_contest: {
				contest_info,
				contest_info_signature_hex,
				outcome_id,
				user: this.getWalletAddress()
			}
		}
		const gas_limit = 120_000

		return await this.snip20.send(
			this.getContractAddress(),
			amount,
			this.getContractCodeHash(),
			invokeMsg,
			gas_limit
		)
	}

	async betContest(contest_id: string, outcome_id: number, amount: Uint128): Promise<TxResponse> {
		const invokeMsg: BetContest = {
			bet_contest: {
				contest_id,
				outcome_id,
				user: this.getWalletAddress()
			}
		}

		return await this.snip20.send(
			this.getContractAddress(),
			amount,
			this.getContractCodeHash(),
			invokeMsg,
		)
	}

	async claim(contest_id: string): Promise<TxResponse> {
		const msg: Claim = {
			claim: {
				contest_id
			}
		}
		return await this.execute(msg)
	}

	async claimMultiple(contest_ids: string[]): Promise<TxResponse> {
		const msg: ClaimMultiple = {
			claim_multiple: {
				contest_ids
			}
		}
		return await this.execute(msg)
	}

	async setMinimumBet(amount: Uint128): Promise<TxResponse> {
		const msg: SetMinimumBet = {
			set_minimum_bet: {
				amount
			}
		}
		return this.execute(msg)
	}

	///////// Queries ////////////
	async getContest(contest_id: string): Promise<ContestDataResponse> {
		const query: GetContest = {
			get_contest: {
				contest_id
			}
		}
		return (await this.query(query)) as ContestDataResponse
	}

	async getContests(contest_ids: string[]): Promise<ContestDataListResponse> {
		const query: GetContests = {
			get_contests: {
				contest_ids
			}
		}
		return (await this.query(query)) as ContestDataListResponse
	}

	async getActiveContests(page_num?: number, page_size?: number, sort_order?: ContestQuerySortOrder): Promise<ContestDataListResponse> {
		const query: GetActiveContests = {
			get_active_contests: {
				page_num,
				page_size,
				sort_order,
			}
		}
		return (await this.query(query)) as ContestDataListResponse
	}

	async getUserBet(contest_id: string, viewing_key: string): Promise<UserBetResponse> {
		const query: GetUserBet = {
			get_user_bet: {
				contest_id,
				user: this.getWalletAddress(),
				viewing_key
			}
		}
		return (await this.query(query)) as UserBetResponse
	}

	async getUsersBets(viewing_key: string, filters?: UsersBetsQueryFilters[]): Promise<UsersBetsResponse> {
		const query: GetUsersBets = {
			get_users_bets: {
				filters,
				user: this.getWalletAddress(),
				viewing_key,
			}
		}
		return (await this.query(query)) as UsersBetsResponse
	}

	async getSnip20(): Promise<GetSnip20Response> {
		const query: GetSnip20 = {
			get_snip20: {}
		}
		return (await this.query(query)) as GetSnip20Response
	}

	async getMinimumBet(): Promise<MinimumBetResponse> {
		const query: GetMinBet = {
			get_min_bet: {}
		}
		return (await this.query(query)) as MinimumBetResponse
	}

}


export class ContestFactory extends ContractFactory {

	// New method for creating CounterContract instances
	async createContestContract(initMsg: InstantiateMsg, contractWasm: Buffer): Promise<Contests> {
		const exchangeInfo: ContractInfo = await this.createContract<InstantiateMsg>(initMsg, contractWasm)
		const snip20Info: ContractInfo = initMsg.snip20
		return new Contests(exchangeInfo, snip20Info, this.secretjs);
	}
}