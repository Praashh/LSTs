"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintApiAuthority = void 0;
const types_1 = require("../types");
function mintApiAuthority(cluster) {
    switch (cluster) {
        case 'devnet':
            return types_1.MintApiAuthority.DEVNET;
        case 'mainnet-beta':
            return types_1.MintApiAuthority.MAINNET;
        default:
            throw new Error('Invalid cluster');
    }
}
exports.mintApiAuthority = mintApiAuthority;
