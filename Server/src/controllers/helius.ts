import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Request, Response } from "express";
import { mintToken } from "../utils/token_mint";
import { connection, keypair, mint } from "../env.state";
import { transferToken } from "../utils/transfer_token";

export async function heliusWebhook(
    req: Request,
    res: Response
) {
    const requestBody = req.body;

    const fee = requestBody[0].fee;
    const sender = new PublicKey(requestBody[0].feePayer);
    const totalSentLamp = requestBody[0].accountData[0].nativeBalanceChange;
    const amount = Math.abs((totalSentLamp + fee) / LAMPORTS_PER_SOL);
    const receiver = requestBody[0].accountData[1].account;

    console.log("sender", sender)
    console.log("reciver", receiver);
    console.log("amount", amount);

    if (receiver === process.env.PUB_KEY as unknown as PublicKey) {

        console.log("minting the token...");
        const minTxn = await mintToken(connection, keypair, mint);

        console.log("minted here", minTxn);
        console.log("transferring token...");

        const transferTxn = await transferToken(connection, keypair, mint, sender, amount);
        console.log("transferred", transferToken);
    }
    res.status(200).json({ msg: 'Webhook processed' });
}