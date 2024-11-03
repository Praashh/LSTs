import { Webhook, CreateWebhookRequest, EditWebhookRequest, CreateCollectionWebhookRequest, MintlistRequest, MintlistResponse, MintApiRequest, MintApiResponse, MintApiAuthority, DelegateCollectionAuthorityRequest, RevokeCollectionAuthorityRequest, HeliusCluster, HeliusEndpoints } from './types';
import { Connection } from '@solana/web3.js';
import { RpcClient } from './RpcClient';
/**
 * This is the base level class for interfacing with all Helius API methods.
 * @class
 */
export declare class Helius {
    /**
     * API key generated at dev.helius.xyz
     * @private
     */
    private apiKey?;
    /** The cluster in which the connection endpoint belongs to */
    readonly cluster: HeliusCluster;
    /** URL to the fullnode JSON RPC endpoint */
    readonly endpoint: string;
    /** URL to the API and RPC endpoints */
    readonly endpoints: HeliusEndpoints;
    /** The connection object from Solana's SDK */
    readonly connection: Connection;
    /** The beefed up RPC client object from Helius SDK */
    readonly rpc: RpcClient;
    /** The Helius Mint API authority for the cluster */
    readonly mintApiAuthority: MintApiAuthority;
    /**
     * Initializes Helius API client with an API key
     * @constructor
     * @param apiKey - API key generated at dev.helius.xyz
     * @param url - Secure RPC URL generated at dev.helius.xyz
     */
    constructor(apiKey: string, cluster?: HeliusCluster, id?: string, url?: string);
    /**
     * Retrieves a list of all webhooks associated with the current API key
     * @returns {Promise<Webhook[]>} a promise that resolves to an array of webhook objects
     * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
     */
    getAllWebhooks(): Promise<Webhook[]>;
    /**
     * Retrieves a single webhook by its ID, associated with the current API key
     * @param {string} webhookID - the ID of the webhook to retrieve
     * @returns {Promise<Webhook>} a promise that resolves to a webhook object
     * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
     */
    getWebhookByID(webhookID: string): Promise<Webhook>;
    /**
     * Creates a new webhook with the provided request
     * @param {CreateWebhookRequest} createWebhookRequest - the request object containing the webhook information
     * @returns {Promise<Webhook>} a promise that resolves to the created webhook object
     * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
     */
    createWebhook(createWebhookRequest: CreateWebhookRequest): Promise<Webhook>;
    /**
     * Deletes a webhook by its ID
     * @param {string} webhookID - the ID of the webhook to delete
     * @returns {Promise<boolean>} a promise that resolves to true if the webhook was successfully deleted, or false otherwise
     * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
     */
    deleteWebhook(webhookID: string): Promise<boolean>;
    /**
     * Edits an existing webhook by its ID with the provided request
     * @param {string} webhookID - the ID of the webhook to edit
     * @param {EditWebhookRequest} editWebhookRequest - the request object containing the webhook information
     * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
     * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
     */
    editWebhook(webhookID: string, editWebhookRequest: EditWebhookRequest): Promise<Webhook>;
    /**
     * Appends an array of addresses to an existing webhook by its ID
     * @param {string} webhookID - the ID of the webhook to edit
     * @param {string[]} newAccountAddresses - the array of addresses to be added to the webhook
     * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
     * @throws {Error} if there is an error calling the webhooks endpoint, if the response contains an error, or if the number of addresses exceeds 10,000
     */
    appendAddressesToWebhook(webhookID: string, newAccountAddresses: string[]): Promise<Webhook>;
    /**
     * Removes an array of addresses from an existing webhook by its ID
     * @param {string} webhookID - the ID of the webhook to edit
     * @param {string[]} addressesToRemove - the array of addresses to be removed from the webhook
     * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
     * @throws {Error} if there is an error calling the webhooks endpoint, if the response contains an error
     */
    removeAddressesFromWebhook(webhookID: string, addressesToRemove: string[]): Promise<Webhook>;
    createCollectionWebhook(request: CreateCollectionWebhookRequest): Promise<Webhook>;
    getMintlist(request: MintlistRequest): Promise<MintlistResponse>;
    /**
     * Mints a cNFT via Helius Mint API
     * @param {MintApiRequest} mintApiRequest - the request object containing the mint information
     * @returns {Promise<MintApiResponse>} a promise that resolves to the mint response object
     */
    mintCompressedNft(mintApiRequest: MintApiRequest): Promise<MintApiResponse>;
    /**
     * Delegates collection authority to a new address.
     * @param {DelegateCollectionAuthorityRequest} request - The request object containing the following fields:
     * @param {string} request.collectionMint - The address of the collection mint.
     * @param {string} [request.newCollectionAuthority] - The new collection authority (optional). Defaults to Helius Mint API authority if none is provided.
     * @param {Keypair} request.updateAuthorityKeypair - The keypair for the update authority for the collection.
     * @param {Keypair} [request.payerKeypair] - The keypair for the payer (optional). Defaults to the update authority keypair if none is provided.
     * @returns {Promise<string>} A promise that resolves to the transaction signature.
     */
    delegateCollectionAuthority(request: DelegateCollectionAuthorityRequest): Promise<string>;
    /**
     * Revokes collection authority from an address.
     * @param {RevokeCollectionAuthorityRequest} request - The request object containing the following fields:
     * @param {string} request.collectionMint - The address of the collection mint.
     * @param {string} [request.delegatedCollectionAuthority] - The address of the delegated collection authority (optional). Defaults to Helius Mint API authority if none is provided.
     * @param {Keypair} request.revokeAuthorityKeypair - The keypair for the authority that revokes collection access.
     * @param {Keypair} [request.payerKeypair] - The keypair for the payer (optional). Defaults to the revoke authority keypair if none is provided.
     * @returns {Promise<string>} A promise that resolves to the transaction signature.
     */
    revokeCollectionAuthority(request: RevokeCollectionAuthorityRequest): Promise<string>;
    /**
     * Get the API endpoint for the specified path.
     * @param path - The API path to append to the base endpoint.
     * @returns The full URL to the API endpoint including the API key.
     * @throws Error if the path is not valid.
     */
    getApiEndpoint(path: string): string;
    private _editWebhook;
    private handleImageUpload;
    private uploadImageToArweave;
    private getCollectionAuthorityRecord;
    private getCollectionMetadataAccount;
}
