import { ContractInfo } from "../../../modules/shared";

export interface InstantiateMsg {
    config: Config,
}

export interface Config {
    amount: string,
    cost: string,
    length: string,
    difficulty: string,
    master_viewing_key_contract: ContractInfo,
    snip_20: ContractInfo
    entropy: string
}