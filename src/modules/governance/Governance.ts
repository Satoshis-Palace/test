import { SecretNetworkClient, TxResponse } from "secretjs";
import { Contract, ContractFactory } from "../shared/contract/Contract";
import { BecomeDelegatedMsg, ChangeOracleAddressMsg, CreateProposalMsg, DelegateVoteMsg, ExecuteMsg, RemoveDelegationMsg, VoteMsg } from "./types/executeMsg";
import { CheckStake, CheckStakeResponse, DelegatedUserResponse, GetDelegatedUserInfoMsg, GetProposalMsg, Proposal, ProposalResponse, QueryAnswer, QueryMsg } from "./types/queryMsg";

import { ContractInfo } from "../shared/contract/types";
import { InstantiateMsg } from "./types";
import { Snip721 } from "../snip721";
import { ReceiverInfo } from "../snip721";
export class Governance extends Contract<ExecuteMsg, QueryMsg, QueryAnswer> {
    private snip721: Snip721;
    constructor(governanceInfo: ContractInfo, snip721info: ContractInfo, secretjs: SecretNetworkClient) {
        super(governanceInfo.address, governanceInfo.code_hash, secretjs);
        this.snip721 = new Snip721(snip721info, secretjs)
    }

    async changeOracleAddress(address: string ): Promise<TxResponse> {
        const msg: ChangeOracleAddressMsg = {
            change_oracle_address: {
                address
            }
        }
        return await this.execute(msg)
    }
    async createProposal(title: string, description: string, anonymous: boolean ): Promise<TxResponse> {
        const msg: CreateProposalMsg = {
            create_proposal: {
                title,
                description,
                anonymous
            }
        }
        return await this.execute(msg)
    }
    async vote(proposal_id: number, choice: number ): Promise<TxResponse> {
        const msg: VoteMsg = {
            vote: {
                proposal_id,
                choice
            }
        }
        return await this.execute(msg)
    }
    async delegateVote(pseudonym: string ): Promise<TxResponse> {
        const msg: DelegateVoteMsg = {
            delegate_vote: {
                pseudonym
            }
        }
        return await this.execute(msg)
    }
    async removeDelegation( ): Promise<TxResponse> {
        const msg: RemoveDelegationMsg = {
            remove_delegation:{
            }
        }
        return await this.execute(msg)
    }
    async becomeDelegatedUser(pseudonym: string ): Promise<TxResponse> {
        const msg: BecomeDelegatedMsg = {
            become_delegated: {
                pseudonym
            }
        }
        return await this.execute(msg)
    }
    async getProposal(id: number): Promise<Proposal>{
        const msg: GetProposalMsg = {
            get_proposal: {
                id
            }
        } 
        const proposal = (await this.query(msg)) as ProposalResponse
        return proposal.proposal;
    }
    async getDelegatedUser(pseudonym: string): Promise<DelegatedUserResponse>{
        const msg: GetDelegatedUserInfoMsg = {
            get_delegated_user_info: {
                pseudonym
            }
        } 
        const delegatedUser = (await this.query(msg)) as DelegatedUserResponse
        return delegatedUser;
    }
    async checkStake(addr: string): Promise<CheckStakeResponse>{
        const msg: CheckStake = {
            check_stake: {
                addr
            }
        } 
        const stake = (await this.query(msg)) as CheckStakeResponse
        return stake;
    }
    async stakeNFT(nft: string): Promise<TxResponse> {
        const receiver: ReceiverInfo = {
            recipient_code_hash: this.getContractCodeHash(),
            also_implements_batch_receive_nft: true,
          }
        return this.snip721.send_nft(
            this.getContractAddress(), //TODO remove this Or the other one from the contract 
            nft,
            undefined,
            undefined,
            receiver,
            5_500_000,
        )
    }
    async mintNFT(nft: string): Promise<TxResponse> {
        return this.snip721.mint_nft(
            this.getWalletAddress(), //TODO remove this Or the other one from the contract 
            nft,
        )
    }
    
}

export class GovernanceFactory extends ContractFactory {

    // New method for creating CounterContract instances
    async createGovernanceContract( initMsg: InstantiateMsg, snip721info: ContractInfo, contractWasm: Buffer): Promise<Governance> {
        const contractInfo: ContractInfo = await this.createContract<InstantiateMsg>(initMsg, contractWasm)

        return new Governance(contractInfo, snip721info, this.secretjs);
    }
}