

import { Uint128 } from "../../../modules/shared";

export type ExecuteResponse =
  | CreateContestResponse
  | ClaimResponse
  | BetResonse
  ;


export interface CreateContestResponse {
  create_contest: {
    status: ResponseStatus;
    [k: string]: unknown;
  };
}
export interface ClaimResponse {
  claim: {
    amount: Uint128;
    status: ResponseStatus;
    [k: string]: unknown;
  };
}
export interface BetResonse {
  bet: {
    status: ResponseStatus;
    [k: string]: unknown;
  };
}

export type ResponseStatus = "success" | "failure";
