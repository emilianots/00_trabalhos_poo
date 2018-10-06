"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Repository {
    constructor(filetype) {
        this.filetype = filetype;
        this._map = new Map();
    }
    add(key, t) {
        if (this._map.has(key)) {
            throw new Error(key + " ja existe\n");
        }
        this._map.set(key, t);
    }
    rm(key) {
        if (!this._map.delete(key))
            throw new Error("" + key + " nao encontrado\n");
    }
    key() {
        let saida = new Array();
        for (let key of this._map.keys()) {
            saida.push(key);
        }
        return saida;
    }
    get(key) {
        let value = this._map.get(key);
        if (value) {
            return value;
        }
        else {
            throw new Error("" + key + " nao encontrado\n");
        }
    }
    getAll() {
        let saida = new Array();
        for (let t of this._map.values()) {
            saida.push(t);
        }
        return saida;
    }
    has(key) {
        return this._map.has(key);
    }
} //Repository
exports.Repository = Repository;
