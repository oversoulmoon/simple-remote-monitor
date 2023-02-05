"use strict";

/**
 * The instructions goes:
 *      The client will query at /init on every ip on LAN, if valid and this node is listening on port 53782. 
 *      return an intial object through JSON:
 *          {
 *              hostname: str,
 *              architecture: str,
 *              platform: str,
 *              uptime: int,
 *              cpu:[{
                        model: str,
                        speed: float,
                        times: { user: int, nice: int, sys: int, idle: int, irq: int },
                        usage: { user: float, sys: float, idle: float }
                    }],
                memory: {used: int, total: int}
 *              network:[{
                            name: str,
                            IPv4: [],
                            IPv6: [],
                            usage: {TX: int, RX: int},
                            totalUsage: {TX: int, RX: int}
                        }]
                date: date
 *          }
 */

const os = require("os");
const cpu = require("./CPUMonitor.js");
const memory = require("./MemoryMonitor");
const network = require("./NetworkMonitor");
const port = 5782;
const cors = require("cors");
const http = require("http");
const express = require("express");
const {Server} = require("socket.io");
const app = express();
app.use(cors());
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin:"*",
        mrthogs: ["POST", "GET"],
    }
})

io.on("connection",(socket)=>{
    console.log("connected with", socket.id);
    socket.on("disconnect",()=>{
        console.log(socket.id, "disconnected");
    });
    socket.on("get_init",()=>{
        console.log("{get_init} requested from",socket.id);
        socket.emit("send_data",{
            hostname: os.hostname(),
            architecture: os.arch(),
            platform: os.platform(),
            uptime: os.uptime(),
            cpu:cpu(null),
            memory: memory(),
            network: network(null,null),
            date: new Date()})
    });
    socket.on("get_status",(data)=>{
        console.log("{get_status} requested from",socket.id);
        socket.emit("send_data",{
            hostname: os.hostname(),
            architecture: os.arch(),
            platform: os.platform(),
            uptime: os.uptime(),
            cpu:cpu(data.cpu),
            memory: memory(),
            network: network(data.network,data.date),
            date: new Date()})
    })
})


server.listen(port, ()=>{
    console.log("Listenting on port", port);
})