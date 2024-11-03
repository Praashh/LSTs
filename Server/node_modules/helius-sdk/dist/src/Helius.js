"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helius = void 0;
const axios_1 = __importDefault(require("axios"));
const web3_js_1 = require("@solana/web3.js");
const sdk_1 = __importDefault(require("@irys/sdk"));
const fs = __importStar(require("fs"));
const utils_1 = require("./utils");
const RpcClient_1 = require("./RpcClient");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const mintApi_1 = require("./utils/mintApi");
/**
 * This is the base level class for interfacing with all Helius API methods.
 * @class
 */
class Helius {
    /**
     * Initializes Helius API client with an API key
     * @constructor
     * @param apiKey - API key generated at dev.helius.xyz
     * @param url - Secure RPC URL generated at dev.helius.xyz
     */
    constructor(apiKey, cluster = 'mainnet-beta', id = 'helius-sdk', url = '') {
        this.cluster = cluster;
        this.endpoints = (0, utils_1.getHeliusEndpoints)(cluster);
        if (apiKey !== '') {
            this.apiKey = apiKey;
            this.connection = new web3_js_1.Connection(`${this.endpoints.rpc}?api-key=${apiKey}`);
        }
        else if (url !== '') {
            this.connection = new web3_js_1.Connection(url);
        }
        else {
            throw Error('either `apiKey` or `url` is required');
        }
        this.endpoint = this.connection.rpcEndpoint;
        this.rpc = new RpcClient_1.RpcClient(this.connection, id);
        this.mintApiAuthority = (0, mintApi_1.mintApiAuthority)(cluster);
    }
    /**
     * Retrieves a list of all webhooks associated with the current API key
     * @returns {Promise<Webhook[]>} a promise that resolves to an array of webhook objects
     * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
     */
    getAllWebhooks() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(this.getApiEndpoint(`/v0/webhooks`));
                return data;
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err)) {
                    throw new Error(`error calling getWebhooks: ${((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.error) || err}`);
                }
                else {
                    throw new Error(`error calling getWebhooks: ${err}`);
                }
            }
        });
    }
    /**
     * Retrieves a single webhook by its ID, associated with the current API key
     * @param {string} webhookID - the ID of the webhook to retrieve
     * @returns {Promise<Webhook>} a promise that resolves to a webhook object
     * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
     */
    getWebhookByID(webhookID) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(this.getApiEndpoint(`/v0/webhooks/${webhookID}`));
                return data;
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err)) {
                    throw new Error(`error during getWebhookByID: ${((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.error) || err}`);
                }
                else {
                    throw new Error(`error during getWebhookByID: ${err}`);
                }
            }
        });
    }
    /**
     * Creates a new webhook with the provided request
     * @param {CreateWebhookRequest} createWebhookRequest - the request object containing the webhook information
     * @returns {Promise<Webhook>} a promise that resolves to the created webhook object
     * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
     */
    createWebhook(createWebhookRequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.post(this.getApiEndpoint(`/v0/webhooks`), Object.assign({}, createWebhookRequest));
                return data;
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err)) {
                    throw new Error(`error during createWebhook: ${((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.error) || err}`);
                }
                else {
                    throw new Error(`error during createWebhook: ${err}`);
                }
            }
        });
    }
    /**
     * Deletes a webhook by its ID
     * @param {string} webhookID - the ID of the webhook to delete
     * @returns {Promise<boolean>} a promise that resolves to true if the webhook was successfully deleted, or false otherwise
     * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
     */
    deleteWebhook(webhookID) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.delete(this.getApiEndpoint(`/v0/webhooks/${webhookID}`));
                return true;
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err)) {
                    throw new Error(`error during deleteWebhook: ${((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.error) || err}`);
                }
                else {
                    throw new Error(`error during deleteWebhook: ${err}`);
                }
            }
        });
    }
    /**
     * Edits an existing webhook by its ID with the provided request
     * @param {string} webhookID - the ID of the webhook to edit
     * @param {EditWebhookRequest} editWebhookRequest - the request object containing the webhook information
     * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
     * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
     */
    editWebhook(webhookID, editWebhookRequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existing = yield this.getWebhookByID(webhookID);
                return this._editWebhook(webhookID, existing, editWebhookRequest);
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err)) {
                    throw new Error(`error during editWebhook: ${((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.error) || err}`);
                }
                else {
                    throw new Error(`error during editWebhook: ${err}`);
                }
            }
        });
    }
    /**
     * Appends an array of addresses to an existing webhook by its ID
     * @param {string} webhookID - the ID of the webhook to edit
     * @param {string[]} newAccountAddresses - the array of addresses to be added to the webhook
     * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
     * @throws {Error} if there is an error calling the webhooks endpoint, if the response contains an error, or if the number of addresses exceeds 10,000
     */
    appendAddressesToWebhook(webhookID, newAccountAddresses) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const webhook = yield this.getWebhookByID(webhookID);
                const accountAddresses = webhook.accountAddresses.concat(newAccountAddresses);
                if (accountAddresses.length > 100000) {
                    throw new Error(`a single webhook cannot contain more than 100,000 addresses`);
                }
                const editRequest = { accountAddresses };
                return this._editWebhook(webhookID, webhook, editRequest);
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err)) {
                    throw new Error(`error during appendAddressesToWebhook: ${((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.error) || err}`);
                }
                else {
                    throw new Error(`error during appendAddressesToWebhook: ${err}`);
                }
            }
        });
    }
    /**
     * Removes an array of addresses from an existing webhook by its ID
     * @param {string} webhookID - the ID of the webhook to edit
     * @param {string[]} addressesToRemove - the array of addresses to be removed from the webhook
     * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
     * @throws {Error} if there is an error calling the webhooks endpoint, if the response contains an error
     */
    removeAddressesFromWebhook(webhookID, addressesToRemove) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const webhook = yield this.getWebhookByID(webhookID);
                // Filter out the addresses to be removed
                const accountAddresses = webhook.accountAddresses.filter((address) => !addressesToRemove.includes(address));
                const editRequest = { accountAddresses };
                return this._editWebhook(webhookID, webhook, editRequest);
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err)) {
                    throw new Error(`error during removeAddressesFromWebhook: ${((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.error) || err}`);
                }
                else {
                    throw new Error(`error during removeAddressesFromWebhook: ${err}`);
                }
            }
        });
    }
    createCollectionWebhook(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((request === null || request === void 0 ? void 0 : request.collectionQuery) == undefined) {
                throw new Error(`must provide collectionQuery object.`);
            }
            const { firstVerifiedCreators, verifiedCollectionAddresses } = request.collectionQuery;
            if (firstVerifiedCreators != undefined &&
                verifiedCollectionAddresses != undefined) {
                throw new Error(`cannot provide both firstVerifiedCreators and verifiedCollectionAddresses. Please only provide one.`);
            }
            let mintlist = [];
            let query = {};
            if (firstVerifiedCreators != undefined) {
                query = { firstVerifiedCreators };
            }
            else {
                // must have used verifiedCollectionAddresses
                query = { verifiedCollectionAddresses };
            }
            try {
                let mints = yield this.getMintlist({
                    query,
                    options: {
                        limit: 10000,
                    },
                });
                mintlist.push(...mints.result);
                while (mints.paginationToken) {
                    mints = yield this.getMintlist({
                        query,
                        options: {
                            limit: 10000,
                            paginationToken: mints.paginationToken,
                        },
                    });
                    mintlist.push(...mints.result);
                }
                const { webhookURL, transactionTypes, authHeader, webhookType } = request;
                const payload = {
                    webhookURL,
                    accountAddresses: mintlist.map((x) => x.mint),
                    transactionTypes,
                };
                if (authHeader) {
                    payload['authHeader'] = authHeader;
                }
                if (webhookType) {
                    payload['webhookType'] = webhookType;
                }
                return yield this.createWebhook(Object.assign({}, payload));
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err)) {
                    throw new Error(`error during createCollectionWebhook: ${((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.error) || err}`);
                }
                else {
                    throw new Error(`error during createCollectionWebhook: ${err}`);
                }
            }
        });
    }
    getMintlist(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((request === null || request === void 0 ? void 0 : request.query) == undefined) {
                throw new Error(`must provide query object.`);
            }
            const { firstVerifiedCreators, verifiedCollectionAddresses } = request.query;
            if (firstVerifiedCreators != undefined &&
                verifiedCollectionAddresses != undefined) {
                throw new Error(`cannot provide both firstVerifiedCreators and verifiedCollectionAddresses. Please only provide one.`);
            }
            try {
                const { data } = yield axios_1.default.post(this.getApiEndpoint(`/v1/mintlist`), Object.assign({}, request));
                return data;
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err)) {
                    throw new Error(`error during getMintlist: ${((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.error) || err}`);
                }
                else {
                    throw new Error(`error during getMintlist: ${err}`);
                }
            }
        });
    }
    /**
     * Mints a cNFT via Helius Mint API
     * @param {MintApiRequest} mintApiRequest - the request object containing the mint information
     * @returns {Promise<MintApiResponse>} a promise that resolves to the mint response object
     */
    mintCompressedNft(mintApiRequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleImageUpload(mintApiRequest);
            try {
                const { data } = yield axios_1.default.post(this.endpoint, {
                    jsonrpc: '2.0',
                    id: 'helius-test',
                    method: 'mintCompressedNft',
                    params: Object.assign({}, mintApiRequest),
                });
                return data;
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err)) {
                    throw new Error(`error during mintCompressedNft: ${((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.error.message) || err}`);
                }
                else {
                    throw new Error(`error during mintCompressedNft: ${err}`);
                }
            }
        });
    }
    /**
     * Delegates collection authority to a new address.
     * @param {DelegateCollectionAuthorityRequest} request - The request object containing the following fields:
     * @param {string} request.collectionMint - The address of the collection mint.
     * @param {string} [request.newCollectionAuthority] - The new collection authority (optional). Defaults to Helius Mint API authority if none is provided.
     * @param {Keypair} request.updateAuthorityKeypair - The keypair for the update authority for the collection.
     * @param {Keypair} [request.payerKeypair] - The keypair for the payer (optional). Defaults to the update authority keypair if none is provided.
     * @returns {Promise<string>} A promise that resolves to the transaction signature.
     */
    delegateCollectionAuthority(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { collectionMint, updateAuthorityKeypair, newCollectionAuthority, payerKeypair, } = request;
                payerKeypair = payerKeypair !== null && payerKeypair !== void 0 ? payerKeypair : updateAuthorityKeypair;
                newCollectionAuthority = newCollectionAuthority !== null && newCollectionAuthority !== void 0 ? newCollectionAuthority : this.mintApiAuthority;
                const collectionMintPubkey = new web3_js_1.PublicKey(collectionMint);
                const collectionMetadata = this.getCollectionMetadataAccount(collectionMintPubkey);
                const newCollectionAuthorityPubkey = new web3_js_1.PublicKey(newCollectionAuthority);
                const collectionAuthorityRecord = this.getCollectionAuthorityRecord(collectionMintPubkey, newCollectionAuthorityPubkey);
                const accounts = {
                    collectionAuthorityRecord,
                    newCollectionAuthority: newCollectionAuthorityPubkey,
                    updateAuthority: updateAuthorityKeypair.publicKey,
                    payer: payerKeypair.publicKey,
                    metadata: collectionMetadata,
                    mint: collectionMintPubkey,
                };
                const inx = (0, mpl_token_metadata_1.createApproveCollectionAuthorityInstruction)(accounts);
                const tx = new web3_js_1.Transaction().add(inx);
                tx.feePayer = payerKeypair.publicKey;
                const sig = yield (0, web3_js_1.sendAndConfirmTransaction)(this.connection, tx, [payerKeypair, updateAuthorityKeypair], {
                    commitment: 'confirmed',
                    skipPreflight: true,
                });
                return sig;
            }
            catch (e) {
                console.error('Failed to delegate collection authority: ', e);
                throw e;
            }
        });
    }
    /**
     * Revokes collection authority from an address.
     * @param {RevokeCollectionAuthorityRequest} request - The request object containing the following fields:
     * @param {string} request.collectionMint - The address of the collection mint.
     * @param {string} [request.delegatedCollectionAuthority] - The address of the delegated collection authority (optional). Defaults to Helius Mint API authority if none is provided.
     * @param {Keypair} request.revokeAuthorityKeypair - The keypair for the authority that revokes collection access.
     * @param {Keypair} [request.payerKeypair] - The keypair for the payer (optional). Defaults to the revoke authority keypair if none is provided.
     * @returns {Promise<string>} A promise that resolves to the transaction signature.
     */
    revokeCollectionAuthority(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { collectionMint, revokeAuthorityKeypair, delegatedCollectionAuthority, payerKeypair, } = request;
                payerKeypair = payerKeypair !== null && payerKeypair !== void 0 ? payerKeypair : revokeAuthorityKeypair;
                delegatedCollectionAuthority =
                    delegatedCollectionAuthority !== null && delegatedCollectionAuthority !== void 0 ? delegatedCollectionAuthority : this.mintApiAuthority;
                const collectionMintPubkey = new web3_js_1.PublicKey(collectionMint);
                const collectionAuthority = new web3_js_1.PublicKey(delegatedCollectionAuthority);
                const collectionMetadata = this.getCollectionMetadataAccount(collectionMintPubkey);
                const collectionAuthorityRecord = this.getCollectionAuthorityRecord(collectionMintPubkey, collectionAuthority);
                const accounts = {
                    collectionAuthorityRecord,
                    delegateAuthority: collectionAuthority,
                    revokeAuthority: revokeAuthorityKeypair.publicKey,
                    metadata: collectionMetadata,
                    mint: collectionMintPubkey,
                };
                const inx = (0, mpl_token_metadata_1.createRevokeCollectionAuthorityInstruction)(accounts);
                const tx = new web3_js_1.Transaction().add(inx);
                tx.feePayer = payerKeypair.publicKey;
                const sig = yield (0, web3_js_1.sendAndConfirmTransaction)(this.connection, tx, [revokeAuthorityKeypair], {
                    commitment: 'confirmed',
                    skipPreflight: true,
                });
                return sig;
            }
            catch (e) {
                console.error('Failed to revoke collection authority: ', e);
                throw e;
            }
        });
    }
    /**
     * Get the API endpoint for the specified path.
     * @param path - The API path to append to the base endpoint.
     * @returns The full URL to the API endpoint including the API key.
     * @throws Error if the path is not valid.
     */
    getApiEndpoint(path) {
        // Check if the path starts with '/v0' or '/v1'
        if (!path.startsWith('/v0') && !path.startsWith('/v1')) {
            throw new Error(`Invalid API path provided: ${path}. Path must start with '/v0' or '/v1'.`);
        }
        if (!this.apiKey) {
            throw new Error(`API key is not set`);
        }
        // Construct and return the full API endpoint URL
        return `${this.endpoints.api}${path}?api-key=${this.apiKey}`;
    }
    _editWebhook(webhookID, existingWebhook, editWebhookRequest) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            const editRequest = {
                webhookURL: (_a = editWebhookRequest.webhookURL) !== null && _a !== void 0 ? _a : existingWebhook.webhookURL,
                transactionTypes: (_b = editWebhookRequest.transactionTypes) !== null && _b !== void 0 ? _b : existingWebhook.transactionTypes,
                accountAddresses: (_c = editWebhookRequest.accountAddresses) !== null && _c !== void 0 ? _c : existingWebhook.accountAddresses,
                accountAddressOwners: (_d = editWebhookRequest.accountAddressOwners) !== null && _d !== void 0 ? _d : existingWebhook.accountAddressOwners,
                webhookType: (_e = editWebhookRequest.webhookType) !== null && _e !== void 0 ? _e : existingWebhook.webhookType,
                authHeader: (_f = editWebhookRequest.authHeader) !== null && _f !== void 0 ? _f : existingWebhook.authHeader,
                txnStatus: (_g = editWebhookRequest.txnStatus) !== null && _g !== void 0 ? _g : existingWebhook.txnStatus,
                encoding: (_h = editWebhookRequest.encoding) !== null && _h !== void 0 ? _h : existingWebhook.encoding,
            };
            const { data } = yield axios_1.default.put(this.getApiEndpoint(`/v0/webhooks/${webhookID}`), editRequest);
            return data;
        });
    }
    handleImageUpload(mintApiRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mintApiRequest.imagePath && mintApiRequest.imageUrl) {
                throw new Error('Cannot provide both imagePath and imageUrl. Please only provide one.');
            }
            if (mintApiRequest.imagePath && !mintApiRequest.walletPrivateKey) {
                throw new Error('Must provide wallet privateKey if providing imagePath.');
            }
            if (mintApiRequest.imagePath && mintApiRequest.walletPrivateKey) {
                mintApiRequest.imageUrl = yield this.uploadImageToArweave(mintApiRequest.imagePath, mintApiRequest.walletPrivateKey);
            }
            delete mintApiRequest.imagePath;
            delete mintApiRequest.walletPrivateKey;
        });
    }
    uploadImageToArweave(imagePath, privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const irys = new sdk_1.default({
                url: this.cluster === 'mainnet-beta'
                    ? 'https://node2.irys.xyz'
                    : 'https://devnet.irys.xyz',
                token: 'solana',
                key: privateKey,
                config: {
                    providerUrl: this.endpoint,
                },
            });
            const stats = fs.statSync(imagePath);
            const fileSizeInBytes = stats.size;
            const fileSizeInKB = fileSizeInBytes / 1000;
            if (this.cluster === 'devnet' || fileSizeInKB >= 200) {
                // Uploads on node2 (mainnet) are free for files under 200KB
                const price = yield irys.getPrice(fileSizeInBytes);
                yield irys.fund(price, 1.1);
            }
            try {
                const receipt = yield irys.uploadFile(imagePath);
                const url = `https://arweave.net/${receipt.id}`;
                return url;
            }
            catch (e) {
                throw new Error(`error uploading image to Arweave: ${e}`);
            }
        });
    }
    getCollectionAuthorityRecord(collectionMint, collectionAuthority) {
        const [collectionAuthRecordPda] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from('metadata'),
            mpl_token_metadata_1.PROGRAM_ID.toBuffer(),
            collectionMint.toBuffer(),
            Buffer.from('collection_authority'),
            collectionAuthority.toBuffer(),
        ], mpl_token_metadata_1.PROGRAM_ID);
        return collectionAuthRecordPda;
    }
    getCollectionMetadataAccount(collectionMint) {
        const [collectionMetadataAccount] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from('metadata', 'utf8'),
            mpl_token_metadata_1.PROGRAM_ID.toBuffer(),
            collectionMint.toBuffer(),
        ], mpl_token_metadata_1.PROGRAM_ID);
        return collectionMetadataAccount;
    }
}
exports.Helius = Helius;
