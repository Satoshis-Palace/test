/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

import { Uint128 } from "../../../shared/contract/types";

export type ExecuteMsgResponse =
  | Swap_result_response
  ;

export interface Swap_result_response {
  swap_result: {
    amount_in: Uint128;
    amount_out: Uint128;
    [k: string]: unknown;
  };
}