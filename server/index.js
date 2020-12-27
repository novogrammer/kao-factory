require("@babel/register");
require("./server");
const ServerApp=require("./ServerApp.es").default;

const serverApp=new ServerApp();

