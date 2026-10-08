const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`number connection : ${numConnection}`);
}

// check db connecton over load
const checkOverload = () => {
    setInterval(() => {
        const numDbConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // assume that each core can handle maximum of 5 connections
        const maxConnections = numCores * 5;
        console.log(`Active connections ${numDbConnections}`);
        console.log(`MemoryUsages : ${memoryUsage / 1024 / 1024} MB`);

        if (numDbConnections > maxConnections)
        {
            console.log(`db connection overload`);
        }

    }, _SECONDS); // monitor every 5 seoconds 
}

module.exports = {
    countConnect,
    checkOverload
}