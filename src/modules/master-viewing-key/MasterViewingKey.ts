// contract.ts
import { SecretNetworkClient, TxResponse } from "secretjs";
import { Contract, ContractFactory, ContractInfo } from "../shared";
import { Assert_viewing_key_valid_query, ExecuteMsg, InstantiateMsg, IsViewingKeyValidResponse, Is_viewing_key_valid_query, QueryMsg, QueryResponse, Set_Viewing_key_msg } from "./types";



export class MasterViewingKey extends Contract<ExecuteMsg, QueryMsg, QueryResponse> {
    constructor(exchangeInfo: ContractInfo, secretjs: SecretNetworkClient) {
        super(exchangeInfo.address, exchangeInfo.code_hash, secretjs);
    }

    async set_viewing_key(viewing_key: string): Promise<TxResponse> {
        const msg: Set_Viewing_key_msg = {
            set_viewing_key: {
                padding: await Contract.generatePadding(),
                viewing_key
            }
        }

        return await this.execute(msg)
    }

    async is_viewing_key_valid(viewing_key: string): Promise<IsViewingKeyValidResponse> {
        // Errors on invalid i think?
        const query: Is_viewing_key_valid_query = {
            is_viewing_key_valid: {
                address: this.getWalletAddress(),
                viewing_key
            }
        }
        return (await this.query(query)) as IsViewingKeyValidResponse
    }

    async assert_viewing_key_is_valid(viewing_key: string): Promise<IsViewingKeyValidResponse> {
        // Errors on invalid i think?
        const query: Assert_viewing_key_valid_query = {
            assert_viewing_key_is_valid: {
                address: this.getWalletAddress(),
                viewing_key
            }
        }
        return (await this.query(query)) as IsViewingKeyValidResponse
    }
}


export class MasterViewingKeyFactory extends ContractFactory {

    // New method for creating CounterContract instances
    async createMasterViewingKeyContract(initMsg: InstantiateMsg, contractWasm: Buffer): Promise<MasterViewingKey> {
        const master_viewing_key_info: ContractInfo = await this.createContract<InstantiateMsg>(initMsg, contractWasm)
        return new MasterViewingKey(master_viewing_key_info, this.secretjs);
    }
}