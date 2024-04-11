
import { Uint128 } from "../../../modules/shared";

export type ExecuteMsg =
  | Claim
  | ClaimMultiple
  | SetMinimumBet
  ;


export interface Claim {
  claim: {
    contest_id: string;
    [k: string]: unknown;
  };
}
export interface ClaimMultiple {
  claim_multiple: {
    contest_ids: string[];
    [k: string]: unknown;
  };
}
export interface SetMinimumBet {
  set_minimum_bet: {
    amount: Uint128;
    [k: string]: unknown;
  };
}