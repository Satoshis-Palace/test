import { SecretNetworkClient } from "secretjs";
import { Deployment } from "../Deployment"
import { ContractInfo } from "../../modules/shared/contract/types";
import { Contract, readContractCode } from "../../modules/shared";
import { InstantiateMsg } from "../../modules/lottery/types";
import { Lottery, LotteryFactory } from "../../modules/lottery/Lottery";
import { LOTTERY_CONTRACT_CODE_PATH, LOTTERY_INFO_FILE_PATH, SNIP20_INFO_FILE_PATH } from "./constants";

import { contractInfo as lotteryInfo } from '../artifacts/lottery-info';
import { contractInfo as snip20Info } from '../artifacts/snip20-info';
import { contractInfo as masterViewKeyInfo } from '../artifacts/master-viewing-key-info';

export interface LotteryDeploymentOptions {
    snip20Info: ContractInfo,
    masterViewingKeyInfo: ContractInfo
    updateCurrent?: boolean, //Assumes false if not passed
}

export class LotteryDeployment extends Deployment<Lottery, LotteryFactory> {
    constructor(secretjs: SecretNetworkClient) {
        super(secretjs, new LotteryFactory(secretjs));
    }

    public async deployContract(options: LotteryDeploymentOptions): Promise<Lottery> {
        const contractWasm = readContractCode(LOTTERY_CONTRACT_CODE_PATH);
        const initMsg: InstantiateMsg = {
            config: {
                amount: "10000",
                cost: "10",
                length: "7",
                difficulty: "3",
                master_viewing_key_contract: options.masterViewingKeyInfo,
                snip_20: options.snip20Info,
                entropy: await Contract.generateEntropy(),
            }
        }; // Initialize your InstantiateMsg here

        const lottery: Lottery = await this.contractFactory.createLottery(initMsg, contractWasm, options.snip20Info, options.masterViewingKeyInfo);

        if (options.updateCurrent) {
            this.writeContractInfo(LOTTERY_INFO_FILE_PATH, lottery.getContractInfo());
        }
        return lottery;
    }

    public getCurrentDeployment(): Lottery {
        return new Lottery(lotteryInfo, snip20Info, masterViewKeyInfo, this.secretjs);
    }
}