import {Poo} from "./poo"

class Transacao{
    id: number;
    nome: string;
    valor: number;

    constructor(id: number, nome: string, valor: number){
        this.id = id;
        this.nome = nome;
        this.valor = valor;
    }
}


class Sistema{
    nexId: number = 0;
    transacoes: Transacao[];
    saldo: number = 0;

    constructor(public valor : number = 0){
        this.saldo += valor;
        this.transacoes = [];
    }

    addTran(nome : string, valor : number) : boolean {
        let valorRam: number = this.saldo;
        if ((valorRam + valor) < 0) {
            console.log("erro | nao ha dinheiro suficiente\n")
            return false;
        }

        this.transacoes.push(new Transacao(this.nexId, nome, valor));
        this.saldo += valor;
        console.log("ok | transacao " + this.nexId + " adicionada")
        this.nexId ++; 
        return true;
    }

    mostrar(){
        console.log("lista de operacoes;")
        for(let operacao of this.transacoes){
            console.log(operacao.id + "| " + operacao.nome + " : " + operacao.valor);
        }
        console.log("\n")
    }
    rmTran(ident : number) : boolean {
        for(let i in this.transacoes){
            if(this.transacoes[i].id == ident){
                this.saldo -= this.transacoes[i].valor;
                this.transacoes.splice(Number(i), 1);
                return true;
            }
        }
        return false;
    }

    mostrarCliente(nome : string){
        let saldoCliente : number = 0;
        console.log("lista de operacoes de "+ nome);
        for(let operacao of this.transacoes){
            if(operacao.nome == nome){
                console.log(operacao.id + "| " + operacao.nome + ": " + operacao.valor);
                saldoCliente += operacao.valor;
            }
        }
        console.log("Saldo: " + saldoCliente + "\n");
    }
    balancoSis(){
        console.log("Balanco: " + this.saldo + "\n");
    }

    contarClientes(){
        let nLista : string[] = [];
        let nCliente : string[] = [];
        for(let nome of this.transacoes){
            nLista.push(nome.nome);
        }
        for(let j : number = 0; j < nLista.length; j++){
            if(nLista.indexOf(nLista[j]) != j){
                nCliente.push(nLista[j]);
            }
        }
        let valueRam : number = (nLista.length - nCliente.length);
        console.log( "Existem " + valueRam + " clientes diferentes no sistema");
    }
}

function inUser(sistema : Sistema) : void {
    let op : string[] = [""];

    while(op[0] != "fim"){
        op = Poo.cin("digite comando ou help:  ").split(" ");

        if(op[0] == "help"){
            console.log("\niniciar $valor");
            console.log("addTran $nome $valor");
            console.log("showTran");
            console.log("rmTran $id");
            console.log("showCli $nome");
            console.log("balanco");
            console.log("contarCli\n");
             }

        if(op[0] == "iniciar") {
            sistema = new Sistema(Number(op[1]))
            console.log("sistema iniciado")
            sistema.balancoSis();
        }


        if(op[0] == "addTran"){
            if(sistema.addTran(op[1], Number(op[2]))){
                console.log("\n");
            } else {
                console.log("")
            }
        }

        if(op[0] == "showTran")
            sistema.mostrar();
        
        if(op[0] == "rmTran"){
            if(sistema.rmTran(Number(op[1]))) {
                console.log("ok | transacao removida\n");
            } else {
                console.log("erro | transacao nao encontrada\n");
            }        
        }

        if(op[0] == "showCli")
            sistema.mostrarCliente(op[1]);

        if(op[0] == "balanco")
            sistema.balancoSis();

        if(op[0] == "contarCli")
            sistema.contarClientes();
    }
}

function inicializar(sistema : Sistema) : Sistema {
    sistema = new Sistema(0);
    sistema.addTran("paulao", 1000);
    sistema.addTran("dilma", -500);
    sistema.addTran("temer", -100);
    sistema.addTran("lula", -100);
    sistema.addTran("anibal", 1000);
    sistema.addTran("sena", 1000);
    sistema.rmTran(0);
    sistema.balancoSis();
    sistema.mostrar();
    return sistema    
}

function running(){
    let sistema : Sistema = new Sistema();
    sistema = inicializar(sistema);
    inUser(sistema);
}


running()