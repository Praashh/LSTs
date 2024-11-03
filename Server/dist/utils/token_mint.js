"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintToken = mintToken;
const spl_token_1 = require("@solana/spl-token");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const token_decimals = 1000000n;
async function mintToken(connection, keypair, mint) {
    try {
        // Create an ATA 5XPMH75Y2h4dmpGKe9pxGxw9vJmCEr12BpiSGgucNVny
        const ata = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);
        // Mint to ATA 2TfgP8pgbh5VeNeVfEY67PRsjiTptR4KLXYJe77Cm568w3jcfQ6ooYnoG2nPgArew3xC24acrSz8wjZtc3UycCjX
        const mintTx = await (0, spl_token_1.mintTo)(connection, keypair, mint, ata.address, keypair, 10n * token_decimals);
        console.log(`Your mint txid: ${mintTx}`);
    }
    catch (error) {
        console.log(`Oops, something went wrong: ${error}`);
    }
}
