"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Zap {
    constructor(userId, msg) {
        this._userId = userId;
        this._msg = msg;
    }
    toString() {
        return "[ " + this._userId + ": " + this._msg + " ]";
    }
}
exports.Zap = Zap;
