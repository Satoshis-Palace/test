import { Binary, ContractInfo } from "../../../modules/shared/contract/types";

export interface InstantiateMsg {
  entropy: Binary;
  snip_20_contract_info: ContractInfo;
  snip_721_contract_info: ContractInfo;
  [k: string]: unknown;
}