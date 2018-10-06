"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userInbox_1 = require("./userInbox");
class Grupo {
    constructor(grupoId) {
        this._grupoId = grupoId;
        this.rgUserinbox = new Array();
    }
    get grupoId() {
        return this._grupoId;
    }
    /* getMsgs (userId: string, qtd: number): Zap[]{
        return
    } */
    deliverZap(userId, msg) {
    }
    getUsers() {
        let lista = [];
        console.log(this.rgUserinbox.length);
        for (let i = 0; i < this.rgUserinbox.length; i++) {
            console.log(i);
            lista.push(this.rgUserinbox[i]._inboxId);
        }
        return lista;
    }
    unreadCount(userId) {
        /* let inbox = this.rgUserinbox.get(userId);
        if (inbox)
            return inbox.unreadCount();
        return 0; */
        let inbox = this.rgUserinbox.find(x => x._user.userId == userId);
        if (!inbox)
            return 0;
        return inbox.unreadCount();
    }
    hasUser(userId) {
        let inbox = this.rgUserinbox.find(x => x._user.userId == userId);
        if (!inbox)
            return false;
        return true;
    }
    addUserGrupo(user) {
        let inbox = this.rgUserinbox.find(x => x._user == user);
        console.log(inbox);
        if (!inbox) {
            console.log(1);
            this.rgUserinbox.push(new userInbox_1.UserInbox(user));
            console.log(2);
        }
        else {
            throw new Error("Usuario " + user.userId + " já esta no grupo\n");
        }
        console.log(3);
    }
    toString() {
        return this._grupoId;
    }
}
exports.Grupo = Grupo;
