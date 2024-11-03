"use strict";
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
exports.RpcClient = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const axios_1 = __importDefault(require("axios"));
const types_1 = require("./types");
/**
 * The beefed up RPC client from Helius SDK
 */
class RpcClient {
    constructor(connection, id) {
        this.connection = connection;
        this.id = id;
    }
    /**
     * Request an allocation of lamports to the specified address
     * @returns {Promise<SendAndConfirmTransactionResponse>}
     */
    airdrop(publicKey, lamports, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this.connection.requestAirdrop(publicKey, lamports);
            const blockhashWithExpiryBlockHeight = yield this.getLatestBlockhash();
            const confirmResponse = yield this.connection.confirmTransaction(Object.assign({ signature }, blockhashWithExpiryBlockHeight), commitment);
            return Object.assign({ signature, confirmResponse }, blockhashWithExpiryBlockHeight);
        });
    }
    /**
     * Fetch the latest blockhash from the cluster
     * @returns {Promise<BlockhashWithExpiryBlockHeight>}
     */
    getLatestBlockhash(commitmentOrConfig = 'finalized') {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.getLatestBlockhash(commitmentOrConfig);
        });
    }
    /**
     * Returns the current transactions per second (TPS) rate — including voting transactions.
     *
     * @returns {Promise<number>} A promise that resolves to the current TPS rate.
     * @throws {Error} If there was an error calling the `getRecentPerformanceSamples` method.
     */
    getCurrentTPS() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const samples = yield this.connection.getRecentPerformanceSamples(1);
                return ((_a = samples[0]) === null || _a === void 0 ? void 0 : _a.numTransactions) / ((_b = samples[0]) === null || _b === void 0 ? void 0 : _b.samplePeriodSecs);
            }
            catch (e) {
                throw new Error(`error calling getCurrentTPS: ${e}`);
            }
        });
    }
    /**
     * Returns all the stake accounts for a given public key
     *
     * @returns {Promise<number>} A promise that resolves to the current TPS rate.
     * @throws {Error} If there was an error calling the `getStakeAccounts` method.
     */
    getStakeAccounts(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.connection.getParsedProgramAccounts(new web3_js_1.PublicKey('Stake11111111111111111111111111111111111111'), {
                    filters: [
                        {
                            dataSize: 200,
                        },
                        {
                            memcmp: {
                                offset: 44,
                                bytes: wallet,
                            },
                        },
                    ],
                });
            }
            catch (e) {
                throw new Error(`error calling getStakeAccounts: ${e}`);
            }
        });
    }
    /**
     * Returns all the token accounts for a given mint address (ONLY FOR SPL TOKENS)
     *
     * @returns {Promise<{pubkey: PublicKey; account: AccountInfo<ParsedAccountData | Buffer}[]>} A promise that resolves to an array of accountInfo
     * @throws {Error} If there was an error calling the `getTokenHolders` method.
     */
    getTokenHolders(mintAddress) {
        try {
            return this.connection.getParsedProgramAccounts(new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), {
                filters: [
                    {
                        dataSize: 165,
                    },
                    {
                        memcmp: {
                            offset: 0,
                            bytes: mintAddress,
                        },
                    },
                ],
            });
        }
        catch (e) {
            throw new Error(`error calling getTokenHolders: ${e}`);
        }
    }
    /**
     * Get a single asset by ID.
     * @param {DAS.GetAssetRequest | string} id - Asset ID
     * @returns {Promise<DAS.GetAssetResponse>}
     * @throws {Error}
     */
    getAsset(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getAsset',
                    params,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const { result } = response.data;
                return result;
            }
            catch (error) {
                throw new Error(`Error in getAsset: ${error}`);
            }
        });
    }
    /**
     * Get RWA Asset by mint.
     * @param {DAS.GetRwaAssetRequest} - RWA Asset ID
     * @returns {Promise<DAS.GetRwaAssetResponse>}
     * @throws {Error}
     */
    getRwaAsset(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getRwaAccountsByMint',
                    params,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const { result } = response.data;
                return result;
            }
            catch (error) {
                throw new Error(`Error in getRwaAsset: ${error}`);
            }
        });
    }
    /**
     * Get multiple assets.
     * @returns {Promise<DAS.GetAssetResponse[]>}
     * @throws {Error}
     */
    getAssetBatch(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getAssetBatch',
                    params, // <-- Here we directly pass the params
                });
                return response.data.result;
            }
            catch (error) {
                throw new Error(`Error in getAssetBatch: ${error}`);
            }
        });
    }
    /**
     * Get Asset proof.
     * @returns {Promise<DAS.GetAssetProofResponse>}
     * @throws {Error}
     */
    getAssetProof(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getAssetProof',
                    params,
                });
                const { data } = response;
                return data.result;
            }
            catch (error) {
                throw new Error(`Error in getAssetProof: ${error}`);
            }
        });
    }
    /**
     * Get Assets By group.
     * @returns {Promise<DAS.GetAssetResponseList>}
     * @throws { Error }
     */
    getAssetsByGroup(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getAssetsByGroup',
                    params,
                });
                const { data } = response;
                return data.result;
            }
            catch (error) {
                throw new Error(`Error in getAssetsByGroup: ${error}`);
            }
        });
    }
    /**
     * Get all assets (compressed and regular) for a public key.
     * @returns {Promise<DAS.GetAssetResponseList>}
     * @throws {Error}
     */
    getAssetsByOwner(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getAssetsByOwner',
                    params,
                });
                const { data } = response;
                return data.result;
            }
            catch (error) {
                throw new Error(`Error in getAssetsByOwner: ${error}`);
            }
        });
    }
    /**
     * Request assets for a given creator.
     * @returns {Promise<DAS.GetAssetResponseList>}
     * @throws {Error}
     */
    getAssetsByCreator(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getAssetsByCreator',
                    params,
                });
                const { data } = response;
                return data.result;
            }
            catch (error) {
                throw new Error(`Error in getAssetsByCreator: ${error}`);
            }
        });
    }
    /**
     * Get assets by authority.
     * @returns {Promise<DAS.GetAssetResponseList>}
     * @throws {Error}
     */
    getAssetsByAuthority(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getAssetsByAuthority',
                    params,
                });
                const { data } = response;
                return data.result;
            }
            catch (error) {
                throw new Error(`Error in getAssetsByAuthority: ${error}`);
            }
        });
    }
    /**
     * Search Assets
     * @returns {Promise<DAS.GetAssetResponseList>}
     * @throws {Error}
     */
    searchAssets(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'searchAssets',
                    params,
                });
                const { data } = response;
                return data.result;
            }
            catch (error) {
                throw new Error(`Error in searchAssets: ${error}`);
            }
        });
    }
    /**
     * Get transaction history for the asset.
     * @returns {Promise<GetSignatureForAssetResponse>}
     * @throws {Error}
     */
    getSignaturesForAsset(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getSignaturesForAsset',
                    params,
                });
                const { data } = response;
                return data.result;
            }
            catch (error) {
                throw new Error(`Error in getSignaturesForAsset: ${error}`);
            }
        });
    }
    /**
     * Get priority fee estimate
     * @returns {Promise<GetPriorityFeeEstimateResponse>}
     * @throws {Error}
     */
    getPriorityFeeEstimate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getPriorityFeeEstimate',
                    params: [params],
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (response.data.error) {
                    throw new Error(`Error fetching priority fee estimate: ${JSON.stringify(response.data.error, null, 2)}`);
                }
                return response.data.result;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error) && error.response) {
                    throw new Error(`Error fetching priority fee estimate: ${JSON.stringify(error.response.data, null, 2)}`);
                }
                throw new Error(`Error fetching priority fee estimate: ${error}`);
            }
        });
    }
    /**
     * Simulate a transaction to get the total compute units consumed
     * @param {TransactionInstruction[]} instructions - The transaction instructions
     * @param {PublicKey} payer - The public key of the payer
     * @param {AddressLookupTableAccount[]} lookupTables - The address lookup tables
     * @param {Signer[]} signers - Optional signers for the transaction
     * @returns {Promise<number | null>} - The compute units consumed, or null if unsuccessful
     */
    getComputeUnits(instructions, payer, lookupTables, signers) {
        return __awaiter(this, void 0, void 0, function* () {
            const testInstructions = [
                web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({ units: 1400000 }),
                ...instructions,
            ];
            const testTransaction = new web3_js_1.VersionedTransaction(new web3_js_1.TransactionMessage({
                instructions: testInstructions,
                payerKey: payer,
                recentBlockhash: (yield this.connection.getLatestBlockhash()).blockhash,
            }).compileToV0Message(lookupTables));
            if (signers) {
                testTransaction.sign(signers);
            }
            const rpcResponse = yield this.connection.simulateTransaction(testTransaction, {
                sigVerify: !!signers,
            });
            if (rpcResponse.value.err) {
                console.error(`Simulation error: ${JSON.stringify(rpcResponse.value.err, null, 2)}`);
                return null;
            }
            return rpcResponse.value.unitsConsumed || null;
        });
    }
    /**
     * Poll a transaction to check whether it has been confirmed
     * @param {TransactionSignature} txtSig - The transaction signature
     * @param {PollTransactionOptions} pollOptions - Optional parameters for polling
     * @returns {Promise<TransactionSignature>} - The confirmed transaction signature or an error if the confirmation times out
     */
    pollTransactionConfirmation(txtSig, pollOptions = {
        confirmationStatuses: ["confirmed", "finalized"],
        timeout: 15000,
        interval: 5000
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            let elapsed = 0;
            return new Promise((resolve, reject) => {
                const intervalId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    elapsed += pollOptions.interval;
                    if (elapsed >= pollOptions.timeout) {
                        clearInterval(intervalId);
                        reject(new Error(`Transaction ${txtSig}'s confirmation timed out`));
                    }
                    const status = yield this.connection.getSignatureStatus(txtSig);
                    if (((_a = status === null || status === void 0 ? void 0 : status.value) === null || _a === void 0 ? void 0 : _a.confirmationStatus) && ((_b = pollOptions.confirmationStatuses) === null || _b === void 0 ? void 0 : _b.includes((_c = status === null || status === void 0 ? void 0 : status.value) === null || _c === void 0 ? void 0 : _c.confirmationStatus))) {
                        clearInterval(intervalId);
                        resolve(txtSig);
                    }
                }), pollOptions.interval);
            });
        });
    }
    /**
     * Create a smart transaction with the provided configuration
     * @param {TransactionInstruction[]} instructions - The transaction instructions
     * @param {Signer[]} signers - The transaction's signers. The first signer should be the fee payer
     * @param {AddressLookupTableAccount[]} lookupTables - The lookup tables to be included in a versioned transaction. Defaults to `[]`
     * @param {Signer} feePayer - Optional fee payer separate from the signers
     * @param {SerializeConfig} serializeOptions - Options for transaction serialization. This applies only to legacy transactions. Defaults to `{ requireAllSignatures = true, verifySignatures: true }`
     * @returns {Promise<SmartTransactionContext>} - The transaction with blockhash, blockheight and slot
     */
    createSmartTransaction(instructions, signers, lookupTables = [], feePayer, serializeOptions = {
        requireAllSignatures: true,
        verifySignatures: true,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!signers.length) {
                throw new Error('The transaction must have at least one signer');
            }
            // Check if any of the instructions provided set the compute unit price and/or limit, and throw an error if true
            const existingComputeBudgetInstructions = instructions.filter((instruction) => instruction.programId.equals(web3_js_1.ComputeBudgetProgram.programId));
            if (existingComputeBudgetInstructions.length > 0) {
                throw new Error('Cannot provide instructions that set the compute unit price and/or limit');
            }
            // For building the transaction
            const payerKey = feePayer ? feePayer.publicKey : signers[0].publicKey;
            const { context: { slot: minContextSlot }, value: blockhash, } = yield this.connection.getLatestBlockhashAndContext();
            const recentBlockhash = blockhash.blockhash;
            // Determine if we need to use a versioned transaction
            const isVersioned = lookupTables.length > 0;
            let legacyTransaction = null;
            let versionedTransaction = null;
            // Build the initial transaction based on whether lookup tables are present
            if (isVersioned) {
                const v0Message = new web3_js_1.TransactionMessage({
                    instructions,
                    payerKey,
                    recentBlockhash,
                }).compileToV0Message(lookupTables);
                versionedTransaction = new web3_js_1.VersionedTransaction(v0Message);
                // Include feePayer in signers if it exists and is not already in the list
                const allSigners = feePayer ? [...signers, feePayer] : signers;
                versionedTransaction.sign(allSigners);
            }
            else {
                legacyTransaction = new web3_js_1.Transaction().add(...instructions);
                legacyTransaction.recentBlockhash = recentBlockhash;
                legacyTransaction.feePayer = payerKey;
                for (const signer of signers) {
                    legacyTransaction.partialSign(signer);
                }
                if (feePayer) {
                    legacyTransaction.partialSign(feePayer);
                }
            }
            // Serialize the transaction
            const serializedTransaction = bs58_1.default.encode(isVersioned
                ? versionedTransaction.serialize()
                : legacyTransaction.serialize(serializeOptions));
            // Get the priority fee estimate based on the serialized transaction
            const priorityFeeEstimateResponse = yield this.getPriorityFeeEstimate({
                transaction: serializedTransaction,
                options: {
                    recommended: true,
                },
            });
            const { priorityFeeEstimate } = priorityFeeEstimateResponse;
            if (!priorityFeeEstimate) {
                throw new Error('Priority fee estimate not available');
            }
            // Add the compute unit price instruction with the estimated fee
            const computeBudgetIx = web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: priorityFeeEstimate,
            });
            instructions.unshift(computeBudgetIx);
            // Get the optimal compute units
            const units = yield this.getComputeUnits(instructions, payerKey, isVersioned ? lookupTables : [], signers);
            if (!units) {
                throw new Error(`Error fetching compute units for the instructions provided`);
            }
            // For very small transactions, such as simple transfers, default to 1k CUs
            const customersCU = units < 1000 ? 1000 : Math.ceil(units * 1.1);
            const computeUnitsIx = web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
                units: customersCU,
            });
            instructions.unshift(computeUnitsIx);
            // Rebuild the transaction with the final instructions
            if (isVersioned) {
                const v0Message = new web3_js_1.TransactionMessage({
                    instructions,
                    payerKey,
                    recentBlockhash,
                }).compileToV0Message(lookupTables);
                versionedTransaction = new web3_js_1.VersionedTransaction(v0Message);
                const allSigners = feePayer ? [...signers, feePayer] : signers;
                versionedTransaction.sign(allSigners);
                return {
                    transaction: versionedTransaction,
                    blockhash,
                    minContextSlot,
                };
            }
            legacyTransaction = new web3_js_1.Transaction().add(...instructions);
            legacyTransaction.recentBlockhash = recentBlockhash;
            legacyTransaction.feePayer = payerKey;
            for (const signer of signers) {
                legacyTransaction.partialSign(signer);
            }
            if (feePayer) {
                legacyTransaction.partialSign(feePayer);
            }
            return {
                transaction: legacyTransaction,
                blockhash,
                minContextSlot,
            };
        });
    }
    /**
     * Build and send an optimized transaction, and handle its confirmation status
     * @param {TransactionInstruction[]} instructions - The transaction instructions
     * @param {Signer[]} signers - The transaction's signers. The first signer should be the fee payer
     * @param {AddressLookupTableAccount[]} lookupTables - The lookup tables to be included in a versioned transaction. Defaults to `[]`
     * @param {SendOptions & { feePayer?: Signer; lastValidBlockHeightOffset?: number }} sendOptions - Options for sending the transaction, including an optional feePayer and lastValidBlockHeightOffset. Defaults to `{ skipPreflight: false; lastValidBlockheightOffset: 150 }`
     * @returns {Promise<TransactionSignature>} - The transaction signature
     */
    sendSmartTransaction(instructions, signers, lookupTables = [], sendOptions = { skipPreflight: false, lastValidBlockHeightOffset: 150 }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const lastValidBlockHeightOffset = (_a = sendOptions.lastValidBlockHeightOffset) !== null && _a !== void 0 ? _a : 150;
            if (lastValidBlockHeightOffset < 0)
                throw new Error('expiryBlockOffset must be a positive integer');
            try {
                // Create a smart transaction
                const { transaction, blockhash, minContextSlot } = yield this.createSmartTransaction(instructions, signers, lookupTables, sendOptions.feePayer);
                const commitment = (sendOptions === null || sendOptions === void 0 ? void 0 : sendOptions.preflightCommitment) || 'confirmed';
                const currentBlockHeight = yield this.connection.getBlockHeight();
                const lastValidBlockHeight = Math.min(blockhash.lastValidBlockHeight, currentBlockHeight + lastValidBlockHeightOffset);
                let error;
                // We will retry the transaction on TransactionExpiredBlockheightExceededError
                // until the lastValidBlockHeightOffset is reached in case the transaction is
                // included after the lastValidBlockHeight due to network latency or
                // to the leader not forwarding the transaction for an unknown reason
                // Worst case scenario, it'll retry until the lastValidBlockHeightOffset is reached
                // The tradeoff is better reliability at the cost of a possible longer confirmation time
                do {
                    try {
                        // signature does not change when it resends the same one
                        const signature = yield this.connection.sendRawTransaction(transaction.serialize(), Object.assign({ maxRetries: 0, preflightCommitment: 'confirmed', skipPreflight: sendOptions.skipPreflight, minContextSlot }, sendOptions));
                        const abortSignal = AbortSignal.timeout(15000);
                        yield this.connection.confirmTransaction({
                            abortSignal,
                            signature,
                            blockhash: blockhash.blockhash,
                            lastValidBlockHeight: lastValidBlockHeight,
                        }, commitment);
                        abortSignal.removeEventListener('abort', () => { });
                        return signature;
                    }
                    catch (_error) {
                        if (!(_error instanceof Error))
                            error = new Error();
                        error = _error;
                    }
                } while (!(error instanceof web3_js_1.TransactionExpiredBlockheightExceededError));
            }
            catch (error) {
                throw new Error(`Error sending smart transaction: ${error}`);
            }
            throw new Error('Transaction failed to confirm within lastValidBlockHeight');
        });
    }
    /**
     * Add a tip instruction to the last instruction in the bundle provided
     * @param {TransactionInstruction[]} instructions - The transaction instructions
     * @param {PublicKey} feePayer - The public key of the fee payer
     * @param {string} tipAccount - The public key of the tip account
     * @param {number} tipAmount - The amount of lamports to tip
     */
    addTipInstruction(instructions, feePayer, tipAccount, tipAmount) {
        const tipInstruction = web3_js_1.SystemProgram.transfer({
            fromPubkey: feePayer,
            toPubkey: new web3_js_1.PublicKey(tipAccount),
            lamports: tipAmount,
        });
        instructions.push(tipInstruction);
    }
    /**
     * Create a smart transaction with a Jito tip
     * @param {TransactionInstruction[]} instructions - The transaction instructions
     * @param {Signer[]} signers - The transaction's signers. The first signer should be the fee payer if a separate one isn't provided
     * @param {AddressLookupTableAccount[]} lookupTables - The lookup tables to be included. Defaults to `[]`
     * @param {number} tipAmount - The amount of lamports to tip. Defaults to 1000
     * @param {Signer} feePayer - Optional fee payer separate from the signers
     * @returns {Promise<{ serializedTransaction: string, lastValidBlockHeight: number }>} - The serialized transaction
     */
    createSmartTransactionWithTip(instructions, signers, lookupTables = [], tipAmount = 1000, feePayer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!signers.length) {
                throw new Error('The transaction must have at least one signer');
            }
            // Select a random tip account
            const randomTipAccount = types_1.JITO_TIP_ACCOUNTS[Math.floor(Math.random() * types_1.JITO_TIP_ACCOUNTS.length)];
            // Set the fee payer and add the tip instruction
            const payerKey = feePayer ? feePayer.publicKey : signers[0].publicKey;
            this.addTipInstruction(instructions, payerKey, randomTipAccount, tipAmount);
            return this.createSmartTransaction(instructions, signers, lookupTables, feePayer);
        });
    }
    /**
     * Send a bundle of transactions to the Jito Block Engine
     * @param {string[]} serializedTransactions - The serialized transactions in the bundle
     * @param {string} jitoApiUrl - The Jito Block Engine API URL
     * @returns {Promise<string>} - The bundle ID
     */
    sendJitoBundle(serializedTransactions, jitoApiUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(jitoApiUrl, {
                jsonrpc: '2.0',
                id: 1,
                method: 'sendBundle',
                params: [serializedTransactions],
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.data.error) {
                throw new Error(`Error sending bundles: ${JSON.stringify(response.data.error, null, 2)}`);
            }
            return response.data.result;
        });
    }
    /**
     * Get the status of Jito bundles
     * @param {string[]} bundleIds - An array of bundle IDs to check the status for
     * @param {string} jitoApiUrl - The Jito Block Engine API URL
     * @returns {Promise<any>} - The status of the bundles
     */
    getBundleStatuses(bundleIds, jitoApiUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(jitoApiUrl, {
                jsonrpc: '2.0',
                id: 1,
                method: 'getBundleStatuses',
                params: [bundleIds],
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.data.error) {
                throw new Error(`Error getting bundle statuses: ${JSON.stringify(response.data.error, null, 2)}`);
            }
            return response.data.result;
        });
    }
    /**
     * Send a smart transaction as a Jito bundle with a tip
     * @param {TransactionInstruction[]} instructions - The transaction instructions
     * @param {Signer[]} signers - The transaction's signers. The first signer should be the fee payer if a separate one isn't provided
     * @param {AddressLookupTableAccount[]} lookupTables - The lookup tables to be included. Defaults to `[]`
     * @param {number} tipAmount - The amount of lamports to tip. Defaults to 1000
     * @param {JitoRegion} region - The Jito Block Engine region. Defaults to "Default" (i.e., https://mainnet.block-engine.jito.wtf)
     * @param {Signer} feePayer - Optional fee payer separate from the signers
     * @param {number} lastValidBlockHeightOffset - The offset to add to lastValidBlockHeight. Defaults to 150
     * @returns {Promise<string>} - The bundle ID
     */
    sendSmartTransactionWithTip(instructions, signers, lookupTables = [], tipAmount = 1000, region = 'Default', feePayer, lastValidBlockHeightOffset = 150) {
        return __awaiter(this, void 0, void 0, function* () {
            if (lastValidBlockHeightOffset < 0)
                throw new Error('lastValidBlockHeightOffset must be a positive integer');
            if (!signers.length) {
                throw new Error('The transaction must have at least one signer');
            }
            // Create the smart transaction with tip based
            const { transaction, blockhash } = yield this.createSmartTransactionWithTip(instructions, signers, lookupTables, tipAmount, feePayer);
            const serializedTransaction = bs58_1.default.encode(transaction.serialize());
            // Get the Jito API URL for the specified region
            const jitoApiUrl = `${types_1.JITO_API_URLS[region]}/api/v1/bundles`;
            // Send the transaction as a Jito Bundle
            const bundleId = yield this.sendJitoBundle([serializedTransaction], jitoApiUrl);
            const currentBlockHeight = yield this.connection.getBlockHeight();
            const lastValidBlockHeight = Math.min(blockhash.lastValidBlockHeight, currentBlockHeight + lastValidBlockHeightOffset);
            // Poll for confirmation status
            const timeout = 60000; // 60 second timeout
            const interval = 5000; // 5 second interval
            const startTime = Date.now();
            while (Date.now() - startTime < timeout ||
                (yield this.connection.getBlockHeight()) <= lastValidBlockHeight) {
                const bundleStatuses = yield this.getBundleStatuses([bundleId], jitoApiUrl);
                if (bundleStatuses &&
                    bundleStatuses.value &&
                    bundleStatuses.value.length > 0) {
                    const status = bundleStatuses.value[0].confirmation_status;
                    if (status === 'confirmed') {
                        return bundleStatuses.value[0].transactions[0];
                    }
                }
                yield new Promise((resolve) => setTimeout(resolve, interval));
            }
            throw new Error('Bundle failed to confirm within the timeout period');
        });
    }
    /**
     * Get information about all the edition NFTs for a specific master NFT
     * @returns {Promise<DAS.GetNftEditionsResponse>}
     * @throws {Error}
     */
    getNftEditions(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getNftEditions',
                    params,
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                return response.data.result;
            }
            catch (error) {
                throw new Error(`Error in getNftEditions: ${error}`);
            }
        });
    }
    /**
     * Get information about all token accounts for a specific mint or a specific owner
     * @returns {Promise<DAS.GetTokenAccountsResponse>}
     * @throws {Error}
     */
    getTokenAccounts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'getTokenAccounts',
                    params,
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                return response.data.result;
            }
            catch (error) {
                throw new Error(`Error in getTokenAccounts: ${error}`);
            }
        });
    }
    /**
     * Send a transaction
     * @param {Transaction} transaction - The transaction to send
     * @param {HeliusSendOptions} options - Options for sending the transaction
     * @returns {Promise<TransactionSignature>} - The transaction signature
     */
    sendTransaction(transaction, options = {
        skipPreflight: true,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            let rawTransaction;
            if (transaction instanceof web3_js_1.VersionedTransaction) {
                rawTransaction = Buffer.from(transaction.serialize()).toString('base64');
            }
            else {
                rawTransaction = transaction.serialize().toString('base64');
            }
            try {
                const url = `${this.connection.rpcEndpoint}`;
                const response = yield axios_1.default.post(url, {
                    jsonrpc: '2.0',
                    id: this.id,
                    method: 'sendTransaction',
                    params: [rawTransaction, Object.assign({ encoding: 'base64' }, options)],
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (response.data.error) {
                    throw new Error(`RPC error: ${JSON.stringify(response.data.error)}`);
                }
                return response.data.result;
            }
            catch (error) {
                throw new Error(`Error sending transaction: ${error}`);
            }
        });
    }
}
exports.RpcClient = RpcClient;
