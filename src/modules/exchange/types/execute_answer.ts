/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ExecuteAnswer =
  | ExchangeAnswer
  ;
export type ResponseStatus = "success" | "failure";


export interface ExchangeAnswer {
  exchange: ExchangeResponse;
}

export interface ExchangeResponse {
  status: ResponseStatus;
  [k: string]: unknown;
}
