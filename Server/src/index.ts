import express from "express"
import { config } from "dotenv";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import wallet from "../devnet-wallet.json"
import { mintToken } from "./utils/token_mint";
import { transferToken } from "./utils/transfer_token";
config();
const app = express();

app.use(express.json());

const mint = new PublicKey(process.env.MINT_ADDRESS as unknown as string);
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');


app.get("/", (req, res)=>{
    res.send('hello');
})

app.post("/helius", async (req, res)=>{
    const requestBody = req.body;
    
    const fee = requestBody[0].fee;
    const sender = requestBody[0].feePayer;
    const signature = requestBody[0].signature;
    const totalSentLamp = requestBody[0].accountData[0].nativeBalanceChange;
    const amount = Math.abs((totalSentLamp + fee)/LAMPORTS_PER_SOL);
    const receiverAdd = requestBody[0].accountData[1].account;

    console.log("sender", sender)
    console.log("reciver", receiverAdd);
    console.log("amount",amount);
    console.log("minting the token...");
    const minTxn = await mintToken(connection, keypair, mint);
    console.log("minted here", minTxn);
    console.log("transferring token...");
    // const transferTxn = await transferToken(connection, keypair, mint, sender, amount);
    // console.log("transferred", transferToken);
    res.status(200).json({ msg: 'Webhook processed' });
})


app.listen(3001, ()=> console.log(`Listening on http://localhost:3001`));