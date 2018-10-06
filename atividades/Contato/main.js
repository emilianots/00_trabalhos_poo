"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("./readline");
class Controller {
    //public contato: Array<Contato>;
    constructor() {
        //this.contato = new Array<Contato>();
    }
    process(line) {
        let ui = line.split(" ");
        let cmd = ui[0];
        if (cmd == "help") {
            return "iniciar _nome\n" +
                "setNome _nome\n" +
                "setMail _mail\n" +
                "addFone _foneId _number\n" +
                "rmFone _foneId\n" +
                "mostrar\n";
        }
        else if (cmd == "iniciar") {
            return "iniciar";
        }
        else if (cmd == "setNome") {
            return "setNome";
        }
        else if (cmd == "setMail") {
            return "setMail";
        }
        else if (cmd == "addFone") {
            return "addFone";
        }
        else if (cmd == "rmFone") {
            return "rmFone";
        }
        else if (cmd == "mostrar") {
            return "mostrar";
        }
        else {
            return "comando nao reconhecido";
        }
        //return "done";
    }
    static main() {
        let c = new Controller();
        let line = "";
        while (line != "fim") {
            line = readline_1.cin(">>>");
            if (line == "")
                continue;
            readline_1.cout(c.process(line));
        }
    }
}
Controller.main();
