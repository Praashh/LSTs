"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const devnet_wallet_json_1 = __importDefault(require("../../devnet-wallet.json"));
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const umi_uploader_irys_1 = require("@metaplex-foundation/umi-uploader-irys");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const mint = (0, umi_1.publicKey)(process.env.MINT_ADDRESS);
const umi = (0, umi_bundle_defaults_1.createUmi)(process.env.RPC_URL, "confirmed");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(devnet_wallet_json_1.default));
const signer = (0, umi_1.createSignerFromKeypair)(umi, keypair);
umi.use((0, umi_uploader_irys_1.irysUploader)());
umi.use((0, umi_1.signerIdentity)(signer));
(async () => {
    try {
        // Start here
        // const image = await readFile("/home/praash/Desktop/lst-be/image.png");
        // const umiImageFile = createGenericFile(image, "HPSOL.png", {
        //     tags: [{ name: "Content-Type", value: "image/png" }],
        // });
        // const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
        //     throw new Error(err);
        // });
        // console.log("Your image URI: ", imageUri[0]); // https://arweave.net/6tbDUtEsnQHLmGLNHgbjaie3iAzbnQzDNQehQLAm3eBd
        const metadata = {
            name: 'Harry Potter Stake Token',
            symbol: 'HPSOL',
            description: 'This is the liquidity stake token created by harry potter',
            uri: "https://devnet.irys.xyz/6tbDUtEsnQHLmGLNHgbjaie3iAzbnQzDNQehQLAm3eBd",
            creators: [
                {
                    address: '9kQGWWmror3KP7nhe6hiYpWMjJn5GcAHDoRbPdXvKn6u',
                },
            ],
        };
        const umiJSOnFile = (0, umi_1.createGenericFile)(JSON.stringify(metadata), "explore HPSOL metadata", {
            tags: [{ name: "Content-Type", value: "JSON" }],
        });
        const Uri = await umi.uploader.upload([umiJSOnFile]).catch((err) => {
            throw new Error(err);
        });
        console.log("Your metadata URI: ", Uri); // https://arweave.net/FqXh7icUvN7YiUdMBDaUqM3Wrkx1Md4PXeXBMqTe97nS
        // let accounts: CreateMetadataAccountV3InstructionAccounts = {
        //     mint: mint,
        //     mintAuthority: signer,
        // };
        // let data: DataV2Args = {
        //     name: "Harry Potter Stake Token",
        //     symbol: "HPSOL",
        //     uri: "https://arweave.net/EiqRmDFnNVb8ZhxqkBq5Tf98R7fDSX515NmoVE7sM24m",
        //     sellerFeeBasisPoints: 0,
        //     creators: null,
        //     collection: null,
        //     uses: null,
        // };
        // let args: CreateMetadataAccountV3InstructionArgs = {
        //     data: data,
        //     isMutable: true,
        //     collectionDetails: null,
        // };
        // let tx = createMetadataAccountV3(umi, {
        //     ...accounts,
        //     ...args,
        // });
        // let result = await tx.sendAndConfirm(umi);
        // console.log(bs58.encode(result.signature)); // ky3ffSBvfCAaVBJ8wrhaabFQs1ZUkqWTGx6n4vHBgMoBc3pNnXV2XtASccZjEaMZFamdzH5gHC3AnxQLYGqKSgz
    }
    catch (e) {
        console.error(`Oops, something went wrong: z${e}`);
    }
})();
