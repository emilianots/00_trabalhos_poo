import{input, print} from "./readline";

class Transacao{
    _idTr: number;
    _idCliente: string;
    _valor: number;
    constructor(idTr: number = 0, idCliente: string = "", valor: number = 0) {
        this._idTr = idTr;
        this._idCliente = idCliente;
        this._valor = valor;
    }
    public toString(): string {
        let saida = "id: " + this._idTr + "\nidCliente: " + this._idCliente + "\nValor: " + this._valor;
        return saida;
    }
}
class Sistema{
    static _nextId: number = 0;
    private _transacoes: Map<number,Transacao>;
    private _saldo: number;

    constructor(saldoInicial: number = 0) {
        this._saldo = saldoInicial;
        this._transacoes = new Map<number,Transacao>();
    }

    public emprestar(idCliente: string, valor: number) {
        if(Math.abs(valor) < this._saldo){
            this._transacoes.set(Sistema._nextId, new Transacao(Sistema._nextId, idCliente, valor));
            this._saldo += valor;
            Sistema._nextId ++;
        } else {
            print("Valor insuficiente para emprestimo\n")
        }

    }
    public receber(idCliente: string, valor: number) {
        this._transacoes.set(Sistema._nextId, new Transacao(Sistema._nextId, idCliente, valor));
        this._saldo += valor;
        Sistema._nextId ++;

    } 
    public rmTran(idTr: number) {
        if(this._transacoes.delete(idTr)) {
            
        }
    }

	public get transacoes(): Map<number,Transacao> {
		return this._transacoes;
    }

	public get saldo(): number {
		return this._saldo;
	}
    
    public showAll() {

    }
    public showClien(idCliente: string) {

    }
    public saldoCliente(idCliente) {

    }
    public contarClientes(): number {
        return 
    }
    public toString(): string {
        return
    }
}