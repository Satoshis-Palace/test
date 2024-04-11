import { Addr, Binary, ContractInfo } from "../../../modules/shared";


export interface InstantiateMsg {
  entropy: Binary;
  master_viewing_key_contract: ContractInfo;
  oracle_contract_info: ContractInfo;
  satoshis_palace: Addr;
  snip20: ContractInfo;
  [k: string]: unknown;
}
