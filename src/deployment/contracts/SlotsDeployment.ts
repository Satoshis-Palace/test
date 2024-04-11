import { SecretNetworkClient } from "secretjs";
import { Contract, ContractInfo, readContractCode } from "../../modules/shared";
import { Slots, SlotsFactory } from "../../modules/slots/Slots";
import { InstantiateMsg } from "../../modules/slots/types";
import { SLOTS_CONTRACT_CODE_PATH, SLOTS_INFO_FILE_PATH, SNIP20_INFO_FILE_PATH } from "./constants";
import { Deployment } from "../Deployment";

import { contractInfo as slotsInfo } from '../artifacts/slots-info';
import { contractInfo as snip20Info } from '../artifacts/snip20-info';

export interface SlotsDeploymentOptions {
	snip20Info: ContractInfo,
	updateCurrent?: boolean, //Assumes false if not passed
}

export class SlotsDeployment extends Deployment<Slots, SlotsFactory> {
	constructor(secretjs: SecretNetworkClient) {
		super(secretjs, new SlotsFactory(secretjs));
	}

	public async deployContract(options: SlotsDeploymentOptions): Promise<Slots> {
		const contractWasm = readContractCode(SLOTS_CONTRACT_CODE_PATH);
		const initMsg: InstantiateMsg = {
			entropy: await Contract.generateEntropy(),
			snip20: options.snip20Info,
		}; // Initialize your InstantiateMsg here

		const slots: Slots = await this.contractFactory.createSlotsContract(initMsg, options.snip20Info, contractWasm);

		if (options.updateCurrent) {
			this.writeContractInfo(SLOTS_INFO_FILE_PATH, slots.getContractInfo());
		}
		return slots;
	}

	public getCurrentDeployment(): Slots {
		return new Slots(slotsInfo, snip20Info, this.secretjs);
	}
}