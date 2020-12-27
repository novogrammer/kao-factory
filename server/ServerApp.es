


export default class ServerApp{
  constructor(){
    const fs = require('fs');
    const app =require('express')();
    const isHttps=false;
    let server = null;
    if(isHttps){
      const options={
        key: fs.readFileSync('cert/server-key.pem'),
        cert: fs.readFileSync('cert/server-crt.pem'),
      };
      server = require('https').createServer(options,app);
    }else{
      server = require('http').createServer(app);
    }
    const io = require('socket.io')(server);
    const next = require('next')
    
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

