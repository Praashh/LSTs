import express from "express"
import { config } from "dotenv";
config();
const app = express();


app.get("/", (req, res)=>{
    res.send('hello');
})

app.post("/helius", async (req, res)=>{
    console.log(req.body);
    res.status(200).json({done:"yes"})
})


app.listen(3001, ()=> console.log(`Listening on http://localhost:3001`));