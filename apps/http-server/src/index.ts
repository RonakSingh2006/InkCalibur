import express from "express"

const app = express();

app.post("/signin",(req,res)=>{
  res.send("Signed In");
});

app.post("/signup",(req,res)=>{
  res.send("Signed Up");
});

app.get("/chat",(req,res)=>{
  res.send("Chating ....");
});

app.listen(3001);
