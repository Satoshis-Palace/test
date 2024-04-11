import { TxResponse } from "secretjs";

export type GetProposalMsg = {
    get_proposal: {
        id: number; // u32 in Rust is represented as number in TypeScript
    };
};

export type GetDelegatedUserInfoMsg = {
    get_delegated_user_info: {
        pseudonym: string;
    };
};

export type CheckStake = {
    check_stake: {
        addr: string;
    };
};

// Combined Type for all QueryMsg variants
export type QueryMsg =
    | GetProposalMsg
    | GetDelegatedUserInfoMsg
    | CheckStake;

// Combined Type for all QueryAnswer variants
export type QueryAnswer =
    | ProposalResponse
    | DelegatedUserResponse
    | CheckStakeResponse
    ;

export interface ProposalResponse {
    proposal: Proposal;
}

export interface CheckStakeResponse {
    staked: number;
}

export interface DelegatedUserResponse {
    vote_power: number; // u32 in Rust is represented as number in TypeScript
    vote_log: Array<[number, number]>; // Representing Vec<(u32, u8)> as an array of tuples
}

export interface VoteCount {
    yes: number; // u32 in Rust is represented as number in TypeScript
    no: number; // u32 in Rust is represented as number in TypeScript
    no_with_veto: number; // u32 in Rust is represented as number in TypeScript
    abstain: number; // u32 in Rust is represented as number in TypeScript
}

export interface Proposal {
    proposer: string;
    id: number; // u32 in Rust is represented as number in TypeScript
    title: string;
    description: string;
    creation_block: number; // u64 in Rust is represented as number in TypeScript
    votes: VoteCount;
    endBlock: number; // u64 in Rust is represented as number in TypeScript
}
