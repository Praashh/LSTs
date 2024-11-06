import express from "express"
import { heliusWebhook } from "./controllers/helius";
import { port } from "./env.state";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => { res.send('hello') })
app.post("/helius", heliusWebhook)

app.listen(3001, () => console.log(`Listening on http://localhost:${port}`));