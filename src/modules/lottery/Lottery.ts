import { SecretNetworkClient, TxResponse } from "secretjs";
import { BuyTicketMultiMsg, ClaimTicket, ExecuteMsg, RegisterMsg, Ticket } from "./types/executeMsg";
import { AddressResponse, LatestLotteryResponse, LotteryResponse, QueryAnswer, QueryMsg, TicketPriceResponse } from "./types/queryMsg";
import { InstantiateMsg } from "./types/initMsg";
import { Contract, ContractFactory, ContractInfo } from "../shared";
import { Snip20 } from "../snip20";
import { MasterViewingKey } from "../master-viewing-key";


export class Lottery extends Contract<ExecuteMsg, QueryMsg, QueryAnswer> {
    private snip20: Snip20;
    private masterViewKey: MasterViewingKey;
    constructor(lotteryInfo: ContractInfo, snip20Info: ContractInfo, masterViewKeyInfo: ContractInfo, secretjs: SecretNetworkClient) {
        super(lotteryInfo.address, lotteryInfo.code_hash, secretjs);
        this.snip20 = new Snip20(snip20Info, secretjs)
        this.masterViewKey = new MasterViewingKey(masterViewKeyInfo, secretjs)
    }
    //Executes
    async registerSnip20(address: string, codeHash: string): Promise<TxResponse> {
        const registerMsg: RegisterMsg = {
            register: {
                snip_20: {
                    address: address,
                    code_hash: codeHash,
                },
                entropy: Buffer.from("Entropy").toString('base64')
            }
        }
        return this.execute(registerMsg)
    }
    async buyTickets(tickets: Ticket[], address: string): Promise<TxResponse> {
        const buyTicketMsg: BuyTicketMultiMsg = {
            buy_ticket_multi: {
                tickets: tickets,
                sender: address,
            }
        }
        const gasLimit = 5_500_000; //I swear buying 100 tickets doesnt even use a fifth of this but it needs oit. also privacy prevents gass misuse

        return this.snip20.send(
            this.getContractAddress(), //TODO remove this Or the other one from the contract 
            (await this.getTicketPrice() * tickets.length).toString(),
            this.getContractCodeHash(),
            buyTicketMsg,
            5_500_000
        )
    }
    async ClaimTicket(ticket: Ticket): Promise<TxResponse> {
        const buyTicketMsg: ClaimTicket = {
            redeem_ticket: {
                ticket: ticket
            }
        }
        const redeem = await this.execute(buyTicketMsg)
        return redeem
    }
    async pullLottery(): Promise<TxResponse> {
        const pull = await this.execute({ pull_lottery_numbers: {} })
        return pull
    }
    async pullLotteryAdmin(difficulty_num: string, length: string, cost: string): Promise<TxResponse> {
        const pull = await this.execute({ pull_lottery_numbers_admin: { difficulty_num: difficulty_num, length: length, cost: cost } })
        return pull
    }
    async setViewKey(key: string): Promise<TxResponse> {
        const response = await this.execute({ set_viewing_key: { key: key } })
        return response
    }

    //Querys
    async getTicketPrice(): Promise<number> {
        const ticket_price = await this.LotteryQuery({ get_ticket_price: { id: await this.getCurrentLotteryID() } }) as TicketPriceResponse
        return ticket_price.cost
    }
    async getCurrentLotteryID(): Promise<number> {
        const lottery_id = (await this.LotteryQuery({ get_latest_lottery: {} })) as LatestLotteryResponse
        return lottery_id.id
    }
    async getCurrentLotteryInfo(): Promise<LotteryResponse> {
        var id = await this.getCurrentLotteryID()
        const lottery_id = (await this.LotteryQuery({ get_lottery: { id } })) as LotteryResponse
        return lottery_id
    }
    async getLastLotteryInfo(): Promise<LotteryResponse> {
        var id = await this.getCurrentLotteryID() - 1
        //Will only throw errors on the first lottery lol
        const lottery = (await this.LotteryQuery({ get_lottery: { id } })) as LotteryResponse
        return lottery
    }
    async getLotteryInfoById(id: number): Promise<LotteryResponse> {
        const lottery = (await this.LotteryQuery({ get_lottery: { id } })) as LotteryResponse
        return lottery
    }
    async getBatchLotteryInfo(start_id: number, end_id: number): Promise<LotteryResponse[]> {
        const lotterys = (await this.LotteryQuery({ get_batch_lottery: { start_id: start_id, end_id: end_id } })) as LotteryResponse[]
        return lotterys
    }
    async getLotterySnip20(id: number): Promise<string> {
        const lottery_snip = (await this.LotteryQuery({ get_snip: { id: id } })) as AddressResponse
        return lottery_snip.address
    }
    async getUsersTickets(address: string, lottery_id: number, key: string): Promise<Ticket[]> {
        const users_tickets = (await this.LotteryQuery({ get_users_tickets: { address: address, lottery_id: lottery_id, key: key } })) as Ticket[]
        return users_tickets
    }
    async getTicketsUsers(ticket: Ticket, lottery_id: number): Promise<string> {
        const response = (await this.LotteryQuery({ get_tickets_user: { ticket: ticket, lottery_id: lottery_id } })) as string
        return response
    }
    async getBatchTicketsUsers(tickets: Ticket[], lottery_id: number): Promise<Ticket[]> {
        const taken_tickets = (await this.LotteryQuery({ batch_get_tickets_user: { tickets: tickets, lottery_id: lottery_id } })) as Ticket[]
        return taken_tickets
    }
    async getAdminAddress(): Promise<string> {
        const response = (await this.LotteryQuery({ get_owner: {} })) as AddressResponse
        return response.address
    }
    async getTotalMoneyCollected(): Promise<string> {
        const response = (await this.LotteryQuery({ get_total_money_collected: {} })) as string
        return response
    }
    async getUsersTotalTickets(address: string, key: string): Promise<string> {
        const total = (await this.LotteryQuery({ get_user_total_tickets: { address: address, key: key } })) as string
        return total
    }


    //Error thrower for quries
    async LotteryQuery(queryMsg: QueryMsg): Promise<QueryAnswer> {
        const response: TxResponse | QueryAnswer = await super.query(queryMsg);
        return response as unknown as QueryAnswer;
    }

}

export class LotteryFactory extends ContractFactory {

    // New method for creating CounterContract instances
    async createLottery(initMsg: InstantiateMsg, contractWasm: Buffer, snip20info: ContractInfo, masterViewKeyInfo: ContractInfo): Promise<Lottery> {
        const contractInfo: ContractInfo = await this.createContract<InstantiateMsg>(initMsg, contractWasm)

        return new Lottery(contractInfo, snip20info, masterViewKeyInfo, this.secretjs);
    }
}