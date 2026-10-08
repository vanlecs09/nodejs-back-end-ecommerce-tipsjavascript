const app = require("./src/app");

const PORT = 3510


const server = app.listen(PORT, () => {
    console.log(`WS ecormece start on port ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => console.log('exit server express'));
});