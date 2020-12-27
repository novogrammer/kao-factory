import * as fs from "fs";
import express from "express";
import * as http from "http";
import * as https from "https";
import socketIo from "socket.io";
import next from "next";

const isHttps=false;

const serverKeyPath='cert/server-key.pem';
const serverCrtPath='cert/server-crt.pem';
const port = 3000;
const dev = process.env.NODE_ENV !== 'production'

export default class ServerApp{
  constructor(){

    this.setupPromise=this.setupAsync();

  }
  async setupAsync(){
    const app =express();
    this.app=app;
    let server = null;
    if(isHttps){
      const options={
        key: fs.readFileSync(serverKeyPath),
        cert: fs.readFileSync(serverCrtPath),
      };
      server = https.createServer(options,app);
    }else{
      server = http.createServer(app);
    }
    this.server=server;

    this.setupSocketIo();
    await this.setupNextAsync();

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on ${isHttps?"https":"http"}://localhost:${port}`)
    });
  }
  setupSocketIo(){
    const {server}=this;
    const io = socketIo(server);
    this.io=io;

    io.on('connect',this.onConnect.bind(this));
  }
  async setupNextAsync(){
    const {app}=this;
    const nextApp = next({ dev });
    const nextHandler = nextApp.getRequestHandler()
    await nextApp.prepare();
    app.get('*',(req,res)=>{
      return nextHandler(req,res);
    });

  }
  onConnect(socket){
    socket.emit('now',{
      message:'zeit',
    });
  }
}

