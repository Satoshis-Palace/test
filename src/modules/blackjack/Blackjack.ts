import { SecretNetworkClient, TxResponse } from "secretjs";

import { Snip20 } from "../snip20";
import { Contract, ContractFactory, ContractInfo } from "../shared/contract";
import { BlackJackResponse, ExecuteMsg, GetActiveGameQuery, GetMaxBetMsg, HitMsg, InstantiateMsg, MaxBetResponse, QueryAnswer, QueryMsg, RegisterMsg, StandMsg, StartGameMsg } from "./types";



export class Blackjack extends Contract<ExecuteMsg, QueryMsg, QueryAnswer> {
	private snip20: Snip20;
	constructor(blackjackInfo: ContractInfo, snip20Info: ContractInfo, secretjs: SecretNetworkClient) {
		super(blackjackInfo.address, blackjackInfo.code_hash, secretjs);
		this.snip20 = new Snip20(snip20Info, secretjs)
	}

	async execute(executeMsg: ExecuteMsg, gasLimit: number = 100_000): Promise<TxResponse> {
		return (await super.execute(executeMsg, gasLimit));
	}

	async getActiveGame(): Promise<BlackJackResponse> {
		const activeGameQuery: GetActiveGameQuery = {
			get_active_game: {
				player: this.getWalletAddress()
			}
		}
		// This will either return BlackJackResponse or throw the TxResponse error
		return await this.query(activeGameQuery) as BlackJackResponse;
	}

	async play(betAmount: string): Promise<TxResponse> {
		const playMessage: StartGameMsg = {
			start_game: {}
		}
		const gasLimit = 120_000;
		return this.snip20.send(
			this.getContractAddress(),
			betAmount,
			this.getContractCodeHash(),
			playMessage,
			gasLimit
		)
	}

	async hit(): Promise<TxResponse> {
		const hitMsg: HitMsg = {
			hit: {}
		}
		return this.execute(hitMsg)
	}

	async stand(): Promise<TxResponse> {
		const hitMsg: StandMsg = {
			stand: {}
		}
		const gasLimit = 120_000;
		return this.execute(hitMsg, gasLimit)
	}

	async registerSnip20(snip20Info: ContractInfo): Promise<TxResponse> {
		const msg: RegisterMsg = {
			register: {
				snip_20: {
					code_hash: snip20Info.code_hash,
					address: snip20Info.address
				},
				entropy: await Contract.generateEntropy()
			}
		}
		return this.execute(msg)
	}

	async getMaxBet(): Promise<string> {
		const maxBetQuery: GetMaxBetMsg = {
			get_max_bet: {}
		};

		const maxBetAnswer = await this.query(maxBetQuery);
		return (maxBetAnswer as MaxBetResponse).max_bet;
	}

}

export class BlackJackFactory extends ContractFactory {

	async createBlackjackContract(initMsg: InstantiateMsg, contractWasm: Buffer, snip20Info: ContractInfo): Promise<Blackjack> {
		const contractInfo: ContractInfo = await this.createContract<InstantiateMsg>(initMsg, contractWasm)

		return new Blackjack(contractInfo, snip20Info, this.secretjs);
	}
}