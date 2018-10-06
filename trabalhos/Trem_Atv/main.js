"use strict";
var input = require('readline-sync');
function cin(text = "") {
    return input.question(text);
}
function cout(texto) {
    return console.log(texto);
}
class Nota {
    constructor(titulo, texto) {
        this.titulo = titulo;
        this.texto = texto;
    }
    toString() {
        return ("[ " + this.titulo + "| " + this.texto + "]");
    }
}
class Usuario {
    constructor(nome, password) {
        this.isOn = false;
        this._name = nome;
        this._password = password;
        this.listaNotas = [];
    }
    get name() {
        return this._name;
    }
    set password(value) {
        this._password = value;
    }
    addNote(nota) {
        if (this.listaNotas.length == 0) {
            this.listaNotas.push(nota);
            return true;
        }
        for (let elemento of this.listaNotas) {
            if (elemento.titulo != nota.titulo) {
                this.listaNotas.push(nota);
                return true;
            }
        }
        return false;
    }
    reNote(title) {
        for (let i = 0; i < this.listaNotas.length; i++) {
            if (this.listaNotas[i].titulo == title) {
                this.listaNotas.splice(Number(i), 1);
                return true;
            }
        }
        return false;
    }
    changePass(oldPass, newPass) {
        //verificaçao por retorno de numeros (1 = oldPass n confere, 2 = erro senha inválida, 0 = senha alterada)
        if (this._password != oldPass) {
            return 1;
        }
        if (newPass == undefined) {
            return 2;
        }
        this.password = newPass;
        return 0;
    }
    matchPass(value) {
        return this._password == value;
    }
    toString() {
        return ("Nome : " + this._name + "| " + this.listaNotas);
    }
}
class Sistema {
    constructor() {
        this.listaUsers = [];
        this.listaUsers.push(new Usuario("admin", "admin"));
    }
    addUser(nUser) {
        if (this.listaUsers.length == 0) {
            this.listaUsers.push(nUser);
        }
        for (let i = 0; i < this.listaUsers.length; i++) {
            if (this.listaUsers[i].name == nUser.name) {
                return false;
            }
        }
        this.listaUsers.push(nUser);
        return true;
    }
    getUser(nome, pass) {
        for (let elemen of this.listaUsers) {
            if (elemen.name == nome) {
                if (elemen.matchPass(pass))
                    return elemen;
            }
        }
        return undefined;
    }
    getUsrName() {
        let names = [];
        for (let elemen of this.listaUsers) {
            names.push(elemen.name);
        }
        return names;
    }
}
class Controler {
    constructor() {
        this.sistema = new Sistema;
        this.usuario = undefined;
    }
    comandLine() {
        let op = [""];
        while (op[0] != "fim") {
            op = cin("Digite comando ou help;  ").split(" ");
            if (op[0] == "showUserNames") {
                let saida = "Nomes: ";
                let names = this.sistema.getUsrName();
                for (let nome of names) {
                    saida += nome + " ";
                }
            }
        }
    }
}
