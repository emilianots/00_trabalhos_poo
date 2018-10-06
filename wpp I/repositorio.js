"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Repository {
    constructor(nomeTipo = "") {
        this.mapa = new Map();
        this.nomeTipo = nomeTipo;
    }
    add(key, t) {
        if (this.mapa.has(key)) {
            throw new Error("" + this.nomeTipo + " " + key + " ja existe");
        }
        this.mapa.set(key, t);
    }
    has(key) {
        return this.mapa.has(key);
    }
    rm(key) {
        if (!this.mapa.delete(key))
            throw new Error(this.nomeTipo + " " + key + " nao existe");
    }
    get(key) {
        let resp = this.mapa.get(key);
        if (!resp) {
            throw new Error(this.nomeTipo + " " + key + " nao existe");
        }
        return resp;
    }
    set(key, t) {
        this.mapa.set(key, t);
    }
    values() {
        let vet = new Array();
        for (let value of this.mapa.values())
            vet.push(value);
        return vet;
    }
    /* ver o nome dos contatos
    */
    keys() {
        let vet = new Array();
        for (let value of this.mapa.keys())
            vet.push(value);
        return vet;
    }
    toString() {
        return this.mapa.values();
    }
}
exports.Repository = Repository;
