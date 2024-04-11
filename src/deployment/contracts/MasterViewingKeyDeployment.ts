import { SecretNetworkClient } from "secretjs";
import { Deployment } from "../Deployment"
import { ContractInfo } from "../../modules/shared/contract/types";
import { readContractCode } from "../../modules/shared";
import { MASTER_VIEWING_KEY_CONTRACT_CODE_PATH, MASTER_VIEWING_KEY_INFO_FILE_PATH } from "./constants";

import { MasterViewingKey, MasterViewingKeyFactory } from "../../modules/master-viewing-key/MasterViewingKey";
import { InstantiateMsg } from "../../modules/master-viewing-key/types";
import { contractInfo as MasterViewingKeyInfo } from "../artifacts/master-viewing-key-info"

export interface MasterViewingKeyDeploymentOptions {
    updateCurrent?: boolean, //Assumes false if not passed
}

export class MasterViewingKeyDeployment extends Deployment<MasterViewingKey, MasterViewingKeyFactory> {
    constructor(secretjs: SecretNetworkClient) {
        super(secretjs, new MasterViewingKeyFactory(secretjs));
    }

    public async deployContract(options: MasterViewingKeyDeploymentOptions): Promise<MasterViewingKey> {
        const contractWasm = readContractCode(MASTER_VIEWING_KEY_CONTRACT_CODE_PATH);

        const initMsg: InstantiateMsg = {}; // Initialize your InstantiateMsg here

        const contract: MasterViewingKey = await this.contractFactory.createMasterViewingKeyContract(initMsg, contractWasm);

        if (options.updateCurrent) {
            this.writeContractInfo(MASTER_VIEWING_KEY_INFO_FILE_PATH, contract.getContractInfo());
        }
        return contract;
    }

    public getCurrentDeployment(): MasterViewingKey {
        return new MasterViewingKey(MasterViewingKeyInfo, this.secretjs);
    }
}