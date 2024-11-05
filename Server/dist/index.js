"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const web3_js_1 = require("@solana/web3.js");
const devnet_wallet_json_1 = __importDefault(require("../devnet-wallet.json"));
const token_mint_1 = require("./utils/token_mint");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const mint = new web3_js_1.PublicKey(process.env.MINT_ADDRESS);
const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(devnet_wallet_json_1.default));
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), 'confirmed');
app.get("/", (req, res) => {
    res.send('hello');
});
app.post("/helius", async (req, res) => {
    const requestBody = req.body;
    const fee = requestBody[0].fee;
    const sender = requestBody[0].feePayer;
    const signature = requestBody[0].signature;
    const totalSentLamp = requestBody[0].accountData[0].nativeBalanceChange;
    const amount = Math.abs((totalSentLamp + fee) / web3_js_1.LAMPORTS_PER_SOL);
    const receiverAdd = requestBody[0].accountData[1].account;
    console.log("sender", sender);
    console.log("reciver", receiverAdd);
    console.log("amount", amount);
    console.log("minting the token...");
    const minTxn = await (0, token_mint_1.mintToken)(connection, keypair, mint);
    console.log("minted here", minTxn);
    console.log("transferring token...");
    // const transferTxn = await transferToken(connection, keypair, mint, sender, amount);
    // console.log("transferred", transferToken);
    res.status(200).json({ msg: 'Webhook processed' });
});
app.listen(3001, () => console.log(`Listening on http://localhost:3001`));
