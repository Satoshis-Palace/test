// query_answer.ts
// TypeScript types for Rust enum variants

import { ContractInfo, Uint128 } from "../../../modules/shared";


export interface GetDepositAnswer {
    get_deposit: {
        amount: Uint128;
        [k: string]: unknown;
    };
};

export interface GetSnip20Answer {
    get_snip20: {
        snip20: ContractInfo;
        [k: string]: unknown;
    };
};

// Combined Type for all QueryAnswer variants
export type QueryAnswer =
    | GetDepositAnswer
    | GetSnip20Answer
    ;