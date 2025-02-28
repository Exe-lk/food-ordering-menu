import express from 'express'
import { createServer } from 'http'
import { Server as SocketIOServer} from "socket.io"
import next from 'next'
import cors from 'cors'
import {ref, onValue} from 'firebase/database'
import { database } from './config/firebase'

const dev = process.env.NODE_ENV !== "production";
const app = next({dev})
const handle = app.getRequestHandler();
const PORT = 3000

app.prepare().then(() =>{
    const server = express();

    server.use(cors());

    const httpServer = createServer(server);
    const io = new SocketIOServer(httpServer,{
        cors:{
            origin:"",
        },
    });

    const ordersRef = ref(database,"orders");
    onValue(ordersRef, (snapShot) =>{
        const ordersData = snapShot.val();
        if(ordersData){
            const billedOrders:any[] = [];
            for(const id in ordersData){
                if(ordersData[id].status === "Billed"){
                    billedOrders.push({id, ...ordersData[id]});
                }
            }
            io.emit("billedOrdersUpdate",billedOrders);
        }
    });
    io.on("connection",(socket) =>{
        console.log("New Client connected",socket.id);
    });
    server.all("*", (req, res) => {
        return handle(req, res);
    });
    
      httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})