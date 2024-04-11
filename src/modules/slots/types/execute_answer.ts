import { Uint128 } from "../../../modules/shared";

// execute_answer.ts
export interface DepositInterface {
  deposit_response: {
    amount: Uint128;
    [k: string]: unknown;
  };

};

export interface WithdrawResponse {
  withdraw_response: {
    amount: Uint128;
    [k: string]: unknown;
  };
};

export interface PlayResponse {
  play_response: {
    outcome: number;
    payout: Uint128;
    [k: string]: unknown;
  };
};
export type ExecuteAnswer =
  | DepositInterface
  | WithdrawResponse
  | PlayResponse
  ;
