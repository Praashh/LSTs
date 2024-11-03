"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const devnet_wallet_json_1 = __importDefault(require("../../devnet-wallet.json"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const publicKey = new web3_js_1.PublicKey(process.env.PUB_KEY);
console.log(typeof (publicKey));
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), 'confirmed');
const decimals = 6;
async function createMintAccount(connection, Keypair, decimals) {
    const mint = await (0, spl_token_1.createMint)(connection, Keypair, Keypair.publicKey, null, decimals);
    console.log("mint", mint.toBase58());
    return mint.toBase58();
}
(async () => {
    const keyPair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(devnet_wallet_json_1.default));
    const mintAddress = await createMintAccount(connection, keyPair, decimals);
    console.log("mintAddress", mintAddress);
})();
