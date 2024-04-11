import { SecretNetworkClient } from "secretjs";
import { ContractInfo } from "../../modules/shared/contract"
import { Contract, readContractCode } from "../../modules/shared";
import { InstantiateMsg } from "../../modules/exchange/types";
import { Exchange, ExchangeFactory } from "../../modules/exchange/Exchange";
import { EXCHANGE_CONTRACT_CODE_PATH, EXCHANGE_INFO_FILE_PATH, SNIP20_INFO_FILE_PATH, SNIP721_INFO_FILE_PATH } from "./constants";
import { Deployment } from "../Deployment";

import { contractInfo as exchangeInfo } from '../artifacts/exchange-info';
import { contractInfo as snip20Info } from '../artifacts/snip20-info';
import { contractInfo as snip721Info } from '../artifacts/snip721-info';

export interface ExchangeDeploymentOptions {
	snip20Info: ContractInfo,
	snip721Info: ContractInfo,
	updateCurrent?: boolean, //Assumes false if not passed
}

export class ExchangeDeployment extends Deployment<Exchange, ExchangeFactory> {
	constructor(secretjs: SecretNetworkClient) {
		super(secretjs, new ExchangeFactory(secretjs));
	}

	public async deployContract(options: ExchangeDeploymentOptions): Promise<Exchange> {
		const contractWasm = readContractCode(EXCHANGE_CONTRACT_CODE_PATH);
		const initMsg: InstantiateMsg = {
			entropy: await Contract.generateEntropy(),
			snip_20_contract_info: options.snip20Info,
			snip_721_contract_info: options.snip721Info
		}; // Initialize your InstantiateMsg here

		const exchange: Exchange = await this.contractFactory.createExchangeContract(initMsg, contractWasm);

		if (options.updateCurrent) {
			this.writeContractInfo(EXCHANGE_INFO_FILE_PATH, exchange.getContractInfo());
		}
		return exchange;
	}

	public getCurrentDeployment(): Exchange {
		return new Exchange(exchangeInfo, snip20Info, snip721Info, this.secretjs);
	}
}