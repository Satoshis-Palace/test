// TypeScript interfaces for Rust structures


export interface InstantiateMsg {
    staking_contract: ContractInfo,
    oracle_contract: ContractInfo
}

export interface ContractInfo {
    code_hash: string,
    address: string
}