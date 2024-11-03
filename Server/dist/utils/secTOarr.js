"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bs58_1 = __importDefault(require("bs58"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const key = process.env.SEC_KEY;
const base58PrivateKey = key;
const privateKeyBytes = bs58_1.default.decode(base58PrivateKey);
const privateKeyArray = Array.from(privateKeyBytes);
console.log(privateKeyArray);
