import * as fs from "fs";
import express from "express";
import * as http from "http";
import * as https from "https";
import socketIo from "socket.io";
import next from "next";

const isHttps=false;

export default class ServerApp{
  constructor(){
    const app =express();
    let server = null;
    if(isHttps){
      const options={
        key: fs.readFileSync('cert/server-key.pem'),
        cert: fs.readFileSync('cert/server-crt.pem'),
      };
      server = https.createServer(options,app);
    }else{
      server = http.createServer(app);
    }
    const io = socketIo(server);
    
    const dev = process.env.NODE_ENV !== 'production'
    const nextApp = next({ dev })
    const nextHandler = nextApp.getRequestHandler()
    const port = 3000;
    
    io.on('connect',socket=>{
      socket.emit('now',{
        message:'zeit',
      })
    });
    
    nextApp.prepare().then(() => {
      app.get('*',(req,res)=>{
        return nextHandler(req,res);
      });
    
      server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on ${isHttps?"https":"http"}://localhost:${port}`)
      })
    })
    console.log("this is ServerApp");

  }
}

