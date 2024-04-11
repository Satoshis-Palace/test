import { SecretNetworkClient } from "secretjs";
import { Deployment } from "../Deployment"
import { ContractInfo } from "../../modules/shared/contract/types";
import { Contract, readContractCode } from "../../modules/shared";
import { ANSWER_CONTRACT_CODE_PATH, ANSWER_INFO_FILE_PATH } from "./constants";


import { contractInfo as answerInfo } from '../artifacts/answer-info';
import { AnswerFactory, Answer } from "../../modules/answer/Answer";
import { InstantiateMsg } from "../../modules/answer";

export interface AnswerDeploymentOptions {
	updateCurrent?: boolean, //Assumes false if not passed
}

export class AnswerDeployment extends Deployment<Answer, AnswerFactory> {
	constructor(secretjs: SecretNetworkClient) {
		super(secretjs, new AnswerFactory(secretjs));
	}

	public async deployContract(options: AnswerDeploymentOptions): Promise<Answer> {
		const contractWasm = readContractCode(ANSWER_CONTRACT_CODE_PATH);

		const initMsg: InstantiateMsg = {}

		const Answer: Answer = await this.contractFactory.createAnswerContract(initMsg, contractWasm);

		if (options.updateCurrent) {
			this.writeContractInfo(ANSWER_INFO_FILE_PATH, Answer.getContractInfo());
		}
		return Answer;
	}

	public getCurrentDeployment(): Answer {
		return new Answer(answerInfo, this.secretjs);
	}
}