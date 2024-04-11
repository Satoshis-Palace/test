
export type QueryResponse =
    | IsViewingKeyValidResponse
    ;



export interface IsViewingKeyValidResponse {
    validity: boolean;
    [k: string]: unknown;
}
