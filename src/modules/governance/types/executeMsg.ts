import { TxResponse } from "secretjs";
export type CreateProposalMsg = {
    create_proposal: {
        title: string;
        description: string;
        anonymous: boolean;
    };
};

export type VoteMsg = {
    vote: {
        proposal_id: number; // u32 in Rust is represented as number in TypeScript
        choice: number; // u8 in Rust is represented as number in TypeScript
    };
};

export type DelegateVoteMsg = {
    delegate_vote: {
        pseudonym: string;
    };
};

export type RemoveDelegationMsg = {
    remove_delegation: {};
};

export type BecomeDelegatedMsg = {
    become_delegated: {
        pseudonym: string;
    };
};

export type ChangeOracleAddressMsg = {
    change_oracle_address: {
        address: string;
    };
};

export type BatchReceiveNft = {
    batch_receive_nft: {
        from: string; // Assuming Addr can be represented as string
        token_ids: string[]; // u32 in Rust is represented as number in TypeScript
        msg: string[] | null;
    };
};

// Combined Type for all ExecuteMsg variants
export type ExecuteMsg =
    | CreateProposalMsg
    | VoteMsg
    | DelegateVoteMsg
    | RemoveDelegationMsg
    | BecomeDelegatedMsg
    | ChangeOracleAddressMsg
    | BatchReceiveNft;


// export type ExecuteAnswer  =
//    | ContractIntegrationTemplate1Response
//    | ContractIntegrationTemplate2Response
//     ;
   
