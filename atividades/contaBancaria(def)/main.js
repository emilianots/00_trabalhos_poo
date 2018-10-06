"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const poo_1 = require("./poo");
let HELP = `
help;
iniciar _numero _saldo;
saldo;
saque _valor;
deposito _valor;
extrato;
extratoN _qtd;
`;
class Operacao {
    constructor(descricao, valor, saldo) {
        this._descricao = descricao;
        this._valor = valor;
        this._saldo = saldo;
    }
    get descricao() {
        return this._descricao;
    }
    get valor() {
        return this._valor;
    }
    get saldo() {
        return this._saldo;
    }
    toString() {
        return "[ " + this._descricao + ": R$ " + this._valor + ": Saldo: R$ " + this._saldo + " ]";
    }
}
class Conta {
    constructor(numero = 10, saldo = 0) {
        this._saldo = saldo;
        this._numero = numero;
        this._extrato = new Array();
    }
    depositar(valor) {
        this._saldo += valor;
        this._extrato.push(new Operacao("Deposito", +valor, this._saldo));
    }
    sacar(valor) {
        if (this._saldo < Math.abs(valor)) {
            throw new Error("Fundos insuficientes\n");
        }
        this._saldo -= valor;
        this._extrato.push(new Operacao("Saque", -valor, this._saldo));
    }
    getExtratoN(qtd) {
        return this._extrato.reverse().slice(0, qtd).reverse();
    }
    getAllExtratos() {
        return this._extrato;
    }
    toString() {
        return "Conta: R$ " + this._numero + "| saldo: " + this._saldo + ";\n";
    }
}
class Controller {
    constructor() {
        this.conta = new Conta();
    }
    process(line) {
        let ui = line.split(" ");
        let cmd = ui[0];
        if (cmd == "help") {
            return HELP;
        }
        else if (cmd == "iniciar") {
            this.conta = new Conta(Number(ui[1]), Number(ui[2]));
        }
        else if (cmd == "saldo") {
            return "" + this.conta;
        }
        else if (cmd == "saque") {
            this.conta.sacar(Number(ui[1]));
        }
        else if (cmd == "deposito") {
            this.conta.depositar(Number(ui[1]));
        }
        else if (cmd == "extrato") {
            return poo_1.Poo.vet2str("", this.conta.getAllExtratos(), "\n");
        }
        else if (cmd == "extratoN") {
            return poo_1.Poo.vet2str("", this.conta.getExtratoN(Number(ui[1])), "\n");
        }
        else {
            return "comando invalido\n";
        }
        return "done\n";
    }
    main() {
        let c = new Controller();
        let line = "";
        while (line != "fim") {
            line = poo_1.Poo.cin(">>> ");
            if ((line == "") || (line.substr(0, 2) == "  ") || (line[0] == "#"))
                continue;
            try {
                poo_1.Poo.cout(this.process(line));
            }
            catch (e) {
                poo_1.Poo.cout("" + e);
            }
        }
    }
}
let c = new Controller();
c.main();
