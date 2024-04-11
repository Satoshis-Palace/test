import { Addr, Uint128 } from "../../../modules/shared";

export interface ContestInfo {
    event_details: string;
    id: string;
    options: ContestOutcome[];
    time_of_close: number;
    time_of_resolve: number;
    [k: string]: unknown;
}
export interface ContestOutcome {
    id: number;
    name: string;
    [k: string]: unknown;
}
export interface ContestBetSummary {
    contest_id: string;
    options: OptionBetSummary[];
    outcome?: ContestOutcome | null;
    [k: string]: unknown;
}
export interface OptionBetSummary {
    bet_allocation: Uint128;
    num_bets: number;
    option: ContestOutcome;
    [k: string]: unknown;
}

export interface Bet {
    amount: Uint128;
    contest_id: string;
    has_been_paid: boolean;
    outcome_id: number;
    user: Addr;
    [k: string]: unknown;
}