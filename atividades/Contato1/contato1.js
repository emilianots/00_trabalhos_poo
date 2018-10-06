"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Contato {
    constructor(nome, email) {
        this._nome = nome;
        this._email = email;
        this.telefones = new Array();
    }
    get nome() {
        return this._nome;
    }
    set nome(value) {
        this._nome = value;
    }
    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
    addFone(telefone) {
        if (this.validar(telefone.numero)) {
            for (let fone of this.telefones) {
                if (fone.foneid == telefone.foneid) {
                    throw new Error("id já existe no sistema\n");
                }
            }
            this.telefones.push(telefone);
            return true;
        }
        return false;
    }
    validar(fone) {
        if (fone == "" || fone == " ")
            throw new Error("Numero vazio\n");
        for (let caractere of fone) {
            if (!("-()1234567890".includes(caractere)))
                throw new Error("Numero invalido\n");
        }
        return true;
    }
    rmFone(foneid) {
        for (let fone in this.telefones) {
            if (foneid == this.telefones[fone].foneid) {
                this.telefones.splice(Number(fone), 1);
                return true;
            }
        }
        return false;
    }
}
exports.Contato = Contato;
