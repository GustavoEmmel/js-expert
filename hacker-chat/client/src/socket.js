export default class SocketClient {
    #serverConnection = {};
    constructor({ host, port, protocol }) {
        this.host = host;
        this.port = port;
        this.protocol = protocol;
    }

    async createConnection() {
        const options = {
            port: this.port,
            host: this.host,
            headers: {
                Connection: 'Upgrade',
                Upgrade: 'websocket'
            }
        }

        const http = await import(this.protocol);
        const req = http.request(options);
        req.end();

        return new Promise(resolve => {
            req.once('upgrade', (req, socket) => resolve(socket))
        });

        // req.on('upgrade', (req, socket) => {
        //     socket.on('data', data => {
        //         console.log('client received', data.toString());
        //     });

        //     setInterval(() => {
        //         socket.write("hello")
        //     }, 500);
        // });
    }

    async initialize() {
        this.#serverConnection = await this.createConnection();
        console.log('i connected to the server!!');
    }
}