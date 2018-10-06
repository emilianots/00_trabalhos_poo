"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("./readline");
const contato1_1 = require("./contato1");
const telefone_1 = require("./telefone");
class Controller {
    constructor(name = "", email = "") {
        this.contato = new contato1_1.Contato(name, email);
    }
    process(line) {
        let ui = line.split(" ");
        let cmd = ui[0];
        if (cmd == "help") {
            return "iniciar _nome\n" +
                "setNome _oldName _newName\n" +
                "setMail _mail\n" +
                "addFone _foneId _number\n" +
                "rmFone _foneId\n" +
                "mostrar\n";
        }
        else if (cmd == "iniciar") {
            if (ui[1] == "" || ui[2] == "")
                throw new Error("nome ou email invalido\n");
            this.contato = new contato1_1.Contato(ui[1], ui[2]);
            return "contato adicionado\n";
        }
        else if (cmd == "setNome") {
            if (ui[1] == this.contato.nome) {
                if (ui[2] != "")
                    this.contato.nome = ui[2];
                return "nome modificado\n";
            }
            return "nome invalido\n";
        }
        else if (cmd == "setMail") {
            this.contato.email = ui[1];
            return "email modificado\n";
        }
        else if (cmd == "addFone") {
            if (this.contato.addFone(new telefone_1.Telefone(ui[1], ui[2])))
                return "contato add com sucesso.";
        }
        else if (cmd == "rmFone") {
            if (this.contato.rmFone(ui[1]))
                return "contato removido\n";
            return "id nao cadastrado\n";
        }
        else if (cmd == "bug") {
            readline_1.cout(this.contato);
        }
        else if (cmd == "mostrar") {
            return "" + this.contato;
        }
        else {
            return "comando nao reconhecido";
        }
        return "done";
    }
    static main() {
        let c = new Controller();
        let line = "";
        while (line != "fim") {
            line = readline_1.cin(">>>");
            if (line == "")
                continue;
            try {
                readline_1.cout(c.process(line));
            }
            catch (e) {
                readline_1.cout("" + e);
            }
        }
    }
}
Controller.main();
