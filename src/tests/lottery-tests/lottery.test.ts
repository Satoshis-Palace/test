import { SecretNetworkClient, Wallet } from 'secretjs';
import dotenv from 'dotenv';
import { getSecretNetworkClient } from '../../modules/shared/utils/config';
import { Contract, readContractCode } from '../../modules/shared';
import { Config, InstantiateMsg, Lottery, LotteryFactory } from '../../modules/lottery'
import { Snip20 } from '../../modules/snip20';
import { MasterViewingKeyDeployment, Snip20Deployment } from "../../deployment"
import { MasterViewingKey } from '../../modules/master-viewing-key/MasterViewingKey';

dotenv.config();

const CONTRACT_CODE_PATH = "./wasm/lottery.wasm.gz";
describe('Lottery Contract', () => {
    let secretjs: SecretNetworkClient;
    let lottery: Lottery;
    let lotteryFactory: LotteryFactory
    let snip20Deployment: Snip20Deployment
    let masterViewKeyDeployment: MasterViewingKeyDeployment
    let snip20: Snip20
    let masterViewKeyContract: MasterViewingKey
    beforeAll(async () => {
        secretjs = getSecretNetworkClient()
        lotteryFactory = new LotteryFactory(secretjs)
        snip20Deployment = new Snip20Deployment(secretjs)
        masterViewKeyDeployment = new MasterViewingKeyDeployment(secretjs)
        snip20 = snip20Deployment.getCurrentDeployment()
        masterViewKeyContract = masterViewKeyDeployment.getCurrentDeployment()
        // Read contract wasm
        const contractWasm = readContractCode(CONTRACT_CODE_PATH);
        const config: Config = {
            amount: '0',
            cost: '10000000000000000000',
            length: '7',
            difficulty: '3',
            master_viewing_key_contract: masterViewKeyContract.getContractInfo(),
            snip_20: snip20.getContractInfo(),
            entropy: await Contract.generateEntropy(),
        }

        // Instantiate CounterContract
        const initMsg: InstantiateMsg = { config: config };
        lottery = await lotteryFactory.createLottery(initMsg, contractWasm, snip20.getContractInfo(), masterViewKeyContract.getContractInfo());
    });
    test('Contract should be uploaded and instantiated', () => {
        expect(lottery.getContractAddress()).toBeTruthy();
        // Additional assertions as needed
    });

    test('Buy ticket test', async () => {
        var ticket = { numbers: ["1", "2", "3"] }
        await lottery.buyTickets([ticket], "secret160se29szxttl0xufrm2qwjquszl87px0ls46y6")
        //set key nvoierbnv32098239cn29r23
        await lottery.setViewKey("nvoierbnv32098239cn29r23")
        let tickets = await lottery.getUsersTickets("secret160se29szxttl0xufrm2qwjquszl87px0ls46y6", 1, "nvoierbnv32098239cn29r23")
        let isowned = await lottery.getTicketsUsers(ticket, 1)
        expect(tickets[0].numbers).toEqual(ticket.numbers);
        expect(isowned == "true")
    });

    test('Buy tickets test', async () => {
        var ticket1 = { numbers: ["1", "2", "4"] }
        var ticket2 = { numbers: ["2", "2", "4"] }
        var ticket3 = { numbers: ["3", "2", "4"] }
        var ticket4 = { numbers: ["4", "2", "4"] }
        var ticket5 = { numbers: ["5", "2", "4"] }
        var ticket6 = { numbers: ["6", "2", "4"] }
        var ticket7 = { numbers: ["7", "2", "4"] }
        var ticket8 = { numbers: ["8", "2", "4"] }
        var tickets = [ticket1, ticket2, ticket3, ticket4, ticket5]
        await lottery.buyTickets(tickets, "secret160se29szxttl0xufrm2qwjquszl87px0ls46y6")
        await lottery.setViewKey("nvoierbnv32098239cn29r232352356")
        let tickets_response = await lottery.getUsersTickets("secret160se29szxttl0xufrm2qwjquszl87px0ls46y6", 1, "nvoierbnv32098239cn29r232352356")
        let ticket1_response = await lottery.getTicketsUsers(ticket1, 1)
        let ticket2_response = await lottery.getTicketsUsers(ticket2, 1)
        let ticket3_response = await lottery.getTicketsUsers(ticket3, 1)
        let ticket4_response = await lottery.getTicketsUsers(ticket4, 1)
        let ticket5_response = await lottery.getTicketsUsers(ticket5, 1)
        let tickets_batch_response = await lottery.getBatchTicketsUsers([ticket1, ticket2, ticket3, ticket4, ticket5, ticket6, ticket7, ticket8], 1)

        expect(tickets_response.length).toEqual(6); //5 + 1 from before
        expect(ticket1_response == "true")
        expect(ticket2_response == "true")
        expect(ticket3_response == "true")
        expect(ticket4_response == "true")
        expect(ticket5_response == "true")
        expect(tickets_batch_response).toEqual([ticket1, ticket2, ticket3, ticket4, ticket5]);
    });
});