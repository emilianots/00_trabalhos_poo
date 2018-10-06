"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserInbox {
    constructor(user) {
        this._user = user;
        this._inbox = [];
        this._inboxId = user.userId;
    }
    addZap(zap) {
        this._inbox.unshift(zap);
    }
    unreadCount() {
        return this._inbox.length;
    }
    getZaps() {
        let msgs = this._inbox;
        this._inbox = [];
        return msgs;
    }
}
exports.UserInbox = UserInbox;
