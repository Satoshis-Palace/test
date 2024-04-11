// execute_msg.ts
// TypeScript types for Rust enum variants

import { Addr, Binary, Uint128 } from "../../../modules/shared";


export type PlayInterface = {
    play: {
        amount: Uint128;
        [k: string]: unknown;
    };
};

export type RecieveInterface = {
    receive: {
        _memo?: string | null;
        _msg: Binary;
        _sender: Addr;
        amount: Uint128;
        from: Addr;
        [k: string]: unknown;
    };
};

export type WithdrawInterface = {
    withdraw: {
        [k: string]: unknown;
    };
};
// Combined Type for all ExecuteMsg variants
export type ExecuteMsg =
    | PlayInterface
    | RecieveInterface
    | WithdrawInterface
    ;




