/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ExecuteMsg =
  | Set_Viewing_key_msg
  ;

export interface Set_Viewing_key_msg {
  set_viewing_key: {
    padding?: string | null;
    viewing_key: string;
    [k: string]: unknown;
  };
}