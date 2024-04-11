// contract.ts
import { SecretNetworkClient, TxResponse } from "secretjs";
import { AllNftPricesAnswer, AllNftPricesQuery, BuyNft, ContractBalanceAnswer, ContractBalanceQuery, ExecuteMsg, InstantiateMsg, NftPriceQuery, QueryAnswer, QueryMsg, SingleNftPriceAnswer } from "./types";
import { Contract, ContractFactory, ContractInfo } from "../shared";
import { Snip20 } from "../snip20";
import { Snip721 } from "../snip721";



export class Exchange extends Contract<ExecuteMsg, QueryMsg, QueryAnswer> {
    private snip20: Snip20;
    private snip721: Snip721;
    constructor(exchangeInfo: ContractInfo, snip20Info: ContractInfo, snip721Info: ContractInfo, secretjs: SecretNetworkClient) {
        super(exchangeInfo.address, exchangeInfo.code_hash, secretjs);
        this.snip20 = new Snip20(snip20Info, secretjs)
        this.snip721 = new Snip721(snip721Info, secretjs)
    }

    async exchange_snip20_for_nft(token_id: string): Promise<TxResponse> {
        const msg: BuyNft = {
            token_id
        }
        const nft_price: string = (await this.nft_price(token_id)).nft_price.price
        const gasLimit = 180_000;
        return this.snip20.send(
            this.getContractAddress(),
            nft_price,
            this.getContractCodeHash(),
            msg,
            gasLimit
        )
    }

    async exchange_nft_for_snip20(token_id: string): Promise<TxResponse> {
        const gasLimit = 180_000;
        return this.snip721.send_nft(
            this.getContractAddress(),
            token_id,
            undefined,
            undefined,
            undefined,
            gasLimit
        )
    }

    async all_nft_prices(): Promise<AllNftPricesAnswer> {
        const query: AllNftPricesQuery = {
            all_nft_prices: {}
        }
        return (await this.query(query)) as AllNftPricesAnswer
    }
    async nft_price(token_id: string): Promise<SingleNftPriceAnswer> {
        const query: NftPriceQuery = {
            nft_price: {
                token_id
            }
        }
        return (await this.query(query)) as SingleNftPriceAnswer
    }
    async contract_balance(token_id: string): Promise<ContractBalanceAnswer> {
        const query: ContractBalanceQuery = {
            contract_balance: {}
        }
        return (await this.query(query)) as ContractBalanceAnswer
    }
}


export class ExchangeFactory extends ContractFactory {

    // New method for creating CounterContract instances
    async createExchangeContract(initMsg: InstantiateMsg, contractWasm: Buffer): Promise<Exchange> {
        const exchangeInfo: ContractInfo = await this.createContract<InstantiateMsg>(initMsg, contractWasm)
        const snip20Info: ContractInfo = initMsg.snip_20_contract_info as ContractInfo
        const snip721Info: ContractInfo = initMsg.snip_721_contract_info as ContractInfo

        return new Exchange(exchangeInfo, snip20Info, snip721Info, this.secretjs);
    }
}