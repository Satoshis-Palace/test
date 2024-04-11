// contract.ts
import { SecretNetworkClient, TxResponse } from "secretjs";
import { ExecuteMsg, InstantiateMsg, QueryAnswer, QueryMsg, PlayInterface, WithdrawInterface, GetDepositAnswer, GetDepositMessage, GetSnip20Answer, GetSnip20Message } from "./types";
import { Contract, ContractFactory, ContractInfo } from "../shared";
import { Snip20 } from "../snip20";

export class Slots extends Contract<ExecuteMsg, QueryMsg, QueryAnswer> {
    private snip20: Snip20;
    constructor(slotsInfo: ContractInfo , snip20info: ContractInfo, secretjs: SecretNetworkClient) {
        super(slotsInfo.address, slotsInfo.code_hash, secretjs);
        this.snip20 = new Snip20(snip20info, secretjs)
    }
    

    async play(amount: string):Promise<TxResponse> {
        const message: PlayInterface = {
            play: {
                amount
            }
        };

        return await this.execute(message);
    }

    async deposit(depositAmount: string) {
		const gasLimit = 120_000;
		return this.snip20.send(
			this.getContractAddress(),
			depositAmount,
			this.getContractCodeHash(),
			gasLimit
		)
        
    }

    async withdraw():Promise<TxResponse> {
        const message: WithdrawInterface = {
            withdraw: {}
        }
        return await this.execute(message);
    }

    async getDeposit():Promise<GetDepositAnswer> {
        const message: GetDepositMessage = {
            get_deposit: {
                sender: this.getWalletAddress()
            }
        }
        const response: GetDepositAnswer = (await this.query(message)) as GetDepositAnswer;
        return response;
    }

    async getSnip20():Promise<GetSnip20Answer> {
        const message: GetSnip20Message = {
            get_snip20: {}
        }
        const response: GetSnip20Answer = (await this.query(message)) as GetSnip20Answer;
        return response;
    }
}

export class SlotsFactory extends ContractFactory {

    // New method for creating CounterContract instances
    async createSlotsContract(initMsg: InstantiateMsg, snip20Info: ContractInfo, contractWasm: Buffer): Promise<Slots> {
        const contractInfo: ContractInfo = await this.createContract<InstantiateMsg>(initMsg, contractWasm)
        return new Slots(contractInfo, snip20Info, this.secretjs);
    }
}