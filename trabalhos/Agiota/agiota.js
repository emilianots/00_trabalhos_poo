var input = require('readline-sync');
class Transacao {
    constructor(id = 0, nome, valor = 0.0) {
        this.id = id;
        this.nome = nome;
        this.valor = valor;
    }
}
class Sistema {
    constructor(valor = 0) {
        this.valor = valor;
        this.nexId = 0;
        this.balanco = 0;
        this.balanco += valor;
        this.transacoes = [];
    }
    addTran(nome, valor) {
        let valorRam = this.balanco;
        if ((valorRam + valor) < 0) {
            console.log("erro | nao ha dinheiro suficiente\n");
            return false;
        }
        this.transacoes.push(new Transacao(this.nexId, nome, valor));
        this.balanco += valor;
        console.log("ok | transacao " + this.nexId + " adicionada");
        this.nexId++;
        return true;
    }
    mostrar() {
        console.log("lista de operacoes;");
        for (let operacao of this.transacoes) {
            console.log(operacao.id + "| " + operacao.nome + " : " + operacao.valor);
        }
        console.log("\n");
    }
    rmTran(ident) {
        for (let i in this.transacoes) {
            if (this.transacoes[i].id == ident) {
                this.balanco -= this.transacoes[i].valor;
                this.transacoes.splice(Number(i), 1);
                return true;
            }
        }
        return false;
    }
    mostrarCliente(nome) {
        let saldoCliente = 0;
        console.log("lista de operacoes de " + nome);
        for (let operacao of this.transacoes) {
            if (operacao.nome == nome) {
                console.log(operacao.id + "| " + operacao.nome + ": " + operacao.valor);
                saldoCliente += operacao.valor;
            }
        }
        console.log("Saldo: " + saldoCliente + "\n");
    }
    balancoSis() {
        console.log("Balanco: " + this.balanco + "\n");
    }
    contarClientes() {
        let nLista = [];
        let nCliente = [];
        for (let nome of this.transacoes) {
            nLista.push(nome.nome);
        }
        for (let j = 0; j < nLista.length; j++) {
            if (nLista.indexOf(nLista[j]) != j) {
                nCliente.push(nLista[j]);
            }
        }
        let valueRam = (nLista.length - nCliente.length);
        console.log("Existem " + valueRam + " clientes diferentes no sistema");
    }
}
function inUser(sistema) {
    let op = [""];
    while (op[0] != "fim") {
        op = input.question("digite comando ou help:  ").split(" ");
        if (op[0] == "help") {
            console.log("\niniciar $valor");
            console.log("addTran $nome $valor");
            console.log("showTran");
            console.log("rmTran $id");
            console.log("showCli $nome");
            console.log("balanco");
            console.log("contarCli\n");
        }
        if (op[0] == "iniciar") {
            sistema = new Sistema(Number(op[1]));
            console.log("sistema iniciado");
            sistema.balancoSis();
        }
        if (op[0] == "addTran") {
            if (sistema.addTran(op[1], Number(op[2]))) {
                console.log("\n");
            }
            else {
                console.log("");
            }
        }
        if (op[0] == "showTran")
            sistema.mostrar();
        if (op[0] == "rmTran") {
            if (sistema.rmTran(Number(op[1]))) {
                console.log("ok | transacao removida\n");
            }
            else {
                console.log("erro | transacao nao encontrada\n");
            }
        }
        if (op[0] == "showCli")
            sistema.mostrarCliente(op[1]);
        if (op[0] == "balanco")
            sistema.balancoSis();
        if (op[0] == "contarCli")
            sistema.contarClientes();
    }
}
function inicializar(sistema) {
    sistema = new Sistema(0);
    sistema.addTran("paulao", 1000);
    sistema.addTran("dilma", -500);
    sistema.addTran("temer", -100);
    sistema.addTran("lula", -100);
    //sistema.addTran("lula", -100);
    sistema.addTran("anibal", 1000);
    sistema.addTran("sena", 1000);
    sistema.rmTran(0);
    sistema.balancoSis();
    sistema.mostrar();
    return sistema;
}
function running() {
    let sistema = new Sistema();
    sistema = inicializar(sistema);
    inUser(sistema);
}
running();
