import { constants } from "./constants.js";

export default class Controller {
    #users = new Map();
    #rooms = new Map();

    constructor({ socketServer }) {
        this.socketServer = socketServer;
    }

    onNewConnection(socket) {
        const {id} = socket;
        console.log('connection stablished with', id);
        const userData = {id, socket};
        this.#updateGlobalUserData(id, userData);

        socket.on('data', this.#onSocketData(id));
        socket.on('error', this.#onSocketClose(id));
        socket.on('end', this.#onSocketClose(id))
    }

    async joinRoom(socketId, data) {
        const userData = data;
        console.log(`${userData.userName} joined! ${socketId}`);

        const { roomId } = userData;
        const user = this.#updateGlobalUserData(socketId, userData);

        const users = this.#joinUserOnRoom(roomId, user);

        const currentUsers = Array.from(users.values())
            .map((({id, userName}) => (userName, id)));

        //update current user about all users connected on the room
        this.socketServer
            .sendMessage(user.socket, constants.event.UPDATE_USERS, currentUsers);

    }

    #joinUserOnRoom(roomId, user) {
        const usersOnRoom = this.#rooms.get(roomId) ?? new Map();
        usersOnRoom.set(user.id, user);
        this.#rooms.set(roomId, usersOnRoom);

        return usersOnRoom;
    }

    #onSocketClose(id) {
        return data => {
            console.log('onSocketClose', id);
        }
    }

    #onSocketData(id) {
        return data => {
           try {
            const { event, message } = JSON.parse(data);
            this[event](id, message);
           } catch (error) {
            console.error(`wrong event format!!`, data.toString());
           }
            
        }
    }

    #updateGlobalUserData(socketId, userData) {
        const users = this.#users;
        const user = users.get(socketId) ?? {}

        const updatedUserData = {
            ...user,
            ...userData
        }

        users.set(socketId, updatedUserData);

        return users.get(socketId);
    }
}