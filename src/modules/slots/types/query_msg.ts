// query_msg.ts
// TypeScript types for Rust enum variants

import { Addr } from "../../../modules/shared";

export type GetDepositMessage = {
    get_deposit: {
        sender: Addr;
        [k: string]: unknown;
    };
};

export type GetSnip20Message = {
    get_snip20: {
        [k: string]: unknown;
    };
};

export type QueryMsg =
    | GetDepositMessage
    | GetSnip20Message
    ;
