import ComponentBuilder from "./components.js";
import { constants } from "./constants.js";

export default class TerminalController {
    #userCollors = new Map();
    constructor() {}

    #pickCollor() {
        return '#' + ((1 << 24) * Math.random() | 0 ).toString(16) + '-fg';
    }

    #getUserCollor(userName) {
        if(this.#userCollors.has(userName))
            return this.#userCollors.get(userName);

        const collor = this.#pickCollor();
        this.#userCollors.set(userName, collor);

        return collor;
    }

    #onInputReceived(eventEmitter) {
        return function () {
            const message = this.getValue();
            console.log(message);
            this.clearValue();
        }
    }

    #onMessageReceived({ screen, chat }) {
        return msg => {
            const {userName, message } = msg;
            const collor = this.#getUserCollor(userName);
            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`);
            screen.render();
        }
    }

    #onLogChanged({ screen, activityLog }) {
        return msg => {
            const[userName] = msg.split(/\s/);
            const collor = this.#getUserCollor(userName);
            activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`);

            screen.render();
        }
    }

    #onStatusChanged({ screen, status }) {
        return users => {
            const { content } = status.items.shift();
            status.clearItems();
            status.addItem(content);

            users.forEach(userName => {
                const collor = this.#getUserCollor(userName);
                status.addItem(`{${collor}}{bold}${userName}{/}`)
            });
            screen.render();
        }
    }

    #registerEvents(eventEmitter, components) {
        // eventEmitter.emit('turma01', 'hey');
        // eventEmitter.on('turma01', msg => console.log(msg.toString()));

        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components));
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components));
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components));
    }
    async initializeTable(eventEmitter) {
        const components = new ComponentBuilder()
        .setScreen({title: 'HackerChat - Gustavo'})
        .setLayoutComponent()
        .setInputComponent(this.#onInputReceived(eventEmitter))
        .setChatComponent()
        .setActivityLogComponent()
        .setStatusComponent()
        .build();

        this.#registerEvents(eventEmitter, components);
        components.input.focus();
        components.screen.render();

        // setInterval(() => {
            
            const users = ['gustavo']
            eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
            eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'gustavo join');
            users.push('jane');
            eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
            eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'jane join');
            
            eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, {message: 'hello world!!', userName: 'gustavo'});
            eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, {message: 'Hey', userName: 'jane'});

            // users.pop();
            // eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'gustavo left');
            // users.pop();
            // eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'jane left');
        // }, 2000);
    }
}