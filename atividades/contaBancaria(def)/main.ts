import { Poo } from "./poo";

let HELP = `
help;
iniciar _numero _saldo;
saldo;
saque _valor;
deposito _valor;
extrato;
extratoN _qtd;
`

class Operacao{
    private _descricao: string;
    private _valor: number;
    private _saldo: number;

    constructor(descricao: string, valor: number, saldo: number) {
        this._descricao = descricao;
        this._valor = valor;
        this._saldo = saldo;
    }

	public get descricao(): string {
		return this._descricao;
	}

	public get valor(): number {
		return this._valor;
	}

	public get saldo(): number {
		return this._saldo;
    }
    public toString(): string {
        return "[ " + this._descricao + ": R$ " + this._valor + ": Saldo: R$ " + this._saldo + " ]";
    }
    
}


class Conta{
    private _saldo: number;
    private _numero: number;
    private _extrato: Array<Operacao>;

    constructor(numero: number = 10, saldo: number = 0) {
        this._saldo = saldo;
        this._numero = numero;
        this._extrato = new Array<Operacao>();
    }

    public depositar(valor: number) {
        this._saldo += valor;
        this._extrato.push(new Operacao("Deposito", +valor, this._saldo));
    }

    public sacar(valor: number) {
        if (this._saldo < Math.abs(valor)) {
            throw new Error("Fundos insuficientes\n");
        }
        this._saldo -= valor; 
        this._extrato.push(new Operacao("Saque", -valor, this._saldo));
    }

    public getExtratoN(qtd: number): Array<Operacao> {
        return this._extrato.reverse().slice(0, qtd).reverse();
            
    }
    getAllExtratos(): Array<Operacao>{
        return this._extrato;
    }

    public toString(): string{
        return "Conta:" + this._numero + "| saldo: R$ " + this._saldo + ";\n";
    }
}

class Controller {
    conta: Conta;

    constructor() {
        this.conta = new Conta();
    }

    public process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];

        if (cmd == "help") {
            return HELP;

        } else if (cmd == "iniciar") { 
            this.conta = new Conta(Number(ui[1]), Number(ui[2]));


        }else if (cmd == "saldo") {
            return "" + this.conta;

        } else if (cmd == "saque") {
            this.conta.sacar(Number(ui[1]));

        } else if (cmd == "deposito") {
            this.conta.depositar(Number(ui[1]));

        } else if (cmd == "extrato") {
            return Poo.vet2str("", this.conta.getAllExtratos(), "\n") ;

        } else if (cmd == "extratoN") {
            return Poo.vet2str("", this.conta.getExtratoN(Number(ui[1])), "\n");
            
        }
        else {
            return "comando invalido\n";
        }

        return "done\n";
    }

    public main() {
        let c: Controller = new Controller();
        let line: string = "";
        while (line != "fim") {
            line = Poo.cin(">>> ");
            if ((line == "") || (line.substr(0, 2) == "  ") || (line[0] == "#"))
                continue;
            try {
                Poo.cout(this.process(line));
            } catch (e) {
                Poo.cout("" + e);
            }
        }
    }
}


let c: Controller = new Controller();
c.main();
