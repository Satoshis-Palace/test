import { Addr } from "../../../modules/shared";
import { ContestInfo } from "./common_types";

export type InvokeMsg =
  | CreateContest
  | BetContest
  ;


export interface CreateContest {
  create_contest: {
    contest_info: ContestInfo;
    contest_info_signature_hex: string;
    outcome_id: number;
    user: Addr;
    [k: string]: unknown;
  };
}

export interface BetContest {
  bet_contest: {
    contest_id: string;
    outcome_id: number;
    user: Addr;
    [k: string]: unknown;
  };
}
