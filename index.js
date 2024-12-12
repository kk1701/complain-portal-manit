/**
 * @file Entry point for the Complain Portal backend.
 * @module index
 */

import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';
import app from './app.js';
import connectToDB from './config/connectDB.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master process is running. Forking ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new worker.`);
        cluster.fork();
    });
} else {
    connectToDB();

    app.listen(PORT, () => {
        console.log(`Server is live at port: ${PORT} (Worker ${process.pid})`);
    });
}