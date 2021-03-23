/*
node index.js \
    --userName gustavo \
    --room sala01 \
    --hostUri localhost
*/

import Events from 'events';
import CliConfig from './src/cliConfig.js';
import SocketClient from './src/socket.js';
import TerminalController from "./src/terminalController.js";

const[nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);
// console.log('config', config);
// console.log('commads', commands);

const socketClient = new SocketClient(config);
socketClient.initialize();

// const componentEmitter = new Events();

// const controller = new TerminalController();

// await controller.initializeTable(componentEmitter);


