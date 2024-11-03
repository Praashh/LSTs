"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send('hello');
});
app.post("/helius", async (req, res) => {
    console.log(req.body);
    res.status(200).json({ done: "yes" });
});
app.listen(3001, () => console.log(`Listening on http://localhost:3001`));
