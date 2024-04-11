import dotenv from 'dotenv';
import { SecretNetworkClient, TxResponse, TxResultCode } from 'secretjs';
import { getSecretNetworkClient } from '../../modules/shared/utils/config';
import { MasterViewingKeyDeployment } from "../../deployment"
import { Contract } from '../../modules/shared';
import { CONTEST_INFO, CONTEST_INFO_SIG } from "../contests-tests/constants"
import { MasterViewingKey } from "../../modules/master-viewing-key"

dotenv.config();



describe('Contest Contract Master Viewing Key', () => {
	let secretjs: SecretNetworkClient;
	let masterViewingKey: MasterViewingKey;

	beforeAll(async () => {
		secretjs = getSecretNetworkClient()

		const masterViewingKeyDeployment = new MasterViewingKeyDeployment(secretjs)
		masterViewingKey = await masterViewingKeyDeployment.deployContract({});

	});

	test('Contracts should be uploaded and instantiated', () => {
		expect(masterViewingKey.getContractAddress()).toBeTruthy();
	});

	let viewingKey = "lsieujfvbnawpsioufbasldoiufbasdioufb"
	test('should be able to set viewing key', async () => {
		const txResponse: TxResponse = await masterViewingKey.set_viewing_key(viewingKey)
		expect(txResponse.code).toBe(TxResultCode.Success)
	});

	test('check valid view key', async () => {
		let response = await masterViewingKey.is_viewing_key_valid(viewingKey);
		expect(response.validity).toBe(true)
	});

	test('check invalid view key', async () => {
		let response = await masterViewingKey.is_viewing_key_valid("invalid viewingKey");
		expect(response.validity).toBe(false)
	});

	test('assert valid view key', async () => {
		let response = await masterViewingKey.assert_viewing_key_is_valid(viewingKey);
		expect(response.validity).toBe(true)
	});

	test('assert invalid view key throws error', async () => {
		await expect(masterViewingKey.assert_viewing_key_is_valid("invalid viewingKey"))
			.rejects
			.toThrow();
	});
});
