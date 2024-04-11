import { ContractInfo } from "../../../modules/shared/contract/types";

export type HitMsg = {
    hit: {};
};

export type StandMsg = {
    stand: {};
};

export type RegisterMsg = {
    register: {
        snip_20: ContractInfo; // Assuming ContractInfo is a defined TypeScript type
        entropy: string;       // Assuming Binary can be represented as a string
    };
};

export type ReceiveMsg = {
    receive: {
        sender: string;       // Assuming Addr can be represented as a string
        from: string;         // Assuming Addr can be represented as a string
        amount: string;       // Assuming Uint128 can be represented as a string
        memo?: string;
        msg: string;          // Assuming Binary can be represented as a string
    };
};

export type RedeemMsg = {
    redeem: {
        addr: string;
        hash: string;
        to: string;           // Assuming Addr can be represented as a string
        amount: string;       // Assuming Uint128 can be represented as a string
        denom?: string;
    };
};

// Combined Type for all ExecuteMsg variants
export type ExecuteMsg =
    | HitMsg
    | StandMsg
    | RegisterMsg
    | ReceiveMsg
    | RedeemMsg;



export type StartGameMsg = {
    start_game: {};
};

// Combined Type for all Snip20BlackJackMsg variants
export type Snip20BlackJackMsg =
    | StartGameMsg;