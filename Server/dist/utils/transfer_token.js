"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferToken = transferToken;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
async function transferToken(connection, keypair, mint, to, amount) {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ataFromWallet = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keypair, mint, keypair.publicKey);
        console.log(`ataFromWallet ata is: ${ataFromWallet.address.toBase58()}`);
        console.log(keypair.publicKey);
        // Get the token account of the toWallet address, and if it does not exist, create it
        const ataToWallet = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keypair, mint, to);
        console.log(`ataToWallet ata is: ${ataToWallet.address.toBase58()}`);
        // Check the balance of the ataFromWallet account
        const fromWalletAccountInfo = await (0, spl_token_1.getAccount)(connection, ataFromWallet.address);
        const balance = fromWalletAccountInfo.amount; // Token balance in the smallest unit (not in SOL)
        console.log(`Token balance in the fromWallet: ${balance}`);
        // Check if there are enough tokens to transfer
        const amountToTransfer = amount * web3_js_1.LAMPORTS_PER_SOL; // Adjust the amount if necessary
        if (balance < amountToTransfer) {
            throw new Error(`Insufficient funds: Required ${amountToTransfer}, but only ${balance} available.`);
        }
        // Transfer the tokens to the ataToWallet account
        const signature = await (0, spl_token_1.transfer)(connection, keypair, ataFromWallet.address, ataToWallet.address, keypair, amountToTransfer);
        console.log(`Transfer signature: ${signature}`);
    }
    catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
}
