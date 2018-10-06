import {Repository} from "./repository";
import {Venda} from "./venda";
import {Servico} from "./servico";
import {Cliente} from "./cliente";
import {Animal} from "./animal";

class ServicoClinica{
    private _nextIdSer: number;
    private _nextIdAni: number;
    private _nextIdVend: number;
    private _rSer: Repository<Servico>;
    private _rAni: Repository<Animal>;
    private _rCli: Repository<Cliente>;//NO DIAGRAMA TÁ PESSOA, tanto no atribto quanto no envio do tipo para o repositorio
    private _rVen: Repository<Venda>;

    public constructor(nextIdSer: number, nextIdAni: number, nextIdVend: number) {
        this._nextIdSer = nextIdSer;
        this._nextIdAni = nextIdAni;
        this._nextIdVend = nextIdVend;
        this._rSer = new Repository<Servico>("Servico");
        this._rAni = new Repository<Animal>("Animal"); 
        this._rCli = new Repository<Cliente>("Cliente");
        this._rVen = new Repository<Venda>("Venda");
    }


    public addCli(cliente : Cliente) {
        this._rCli.add(cliente.$nome, cliente);
    }

    public addSer(nome: string, servico : Servico) {
        this._rSer.add(nome, servico);
    }

    public addAni(idCli: string, nomeAni: string, especie: string) {
        
    }

    public vender(idCli: string, nomeAni: string, idSer: string) {//NO DIAGRAMA TÁ COMO STRING NESSA CLASSE MAS NO SERVICO O ATRIBUTO TÁ COMO NUMBER, vou deixar como string mesmo pois o usuario pode digitar qualquer coisa e depois eu trato;
        
    }

    public saldo(): number {
        return
    }

    public getAllCli(): Array<Cliente> {
        return
    }

    public getAllSer(): Array<Servico> {
        return
    }

    public getAllAni(): Array<Animal> {
        return
    }
    ////////////////////////
    public getCliente(idCli: string): Cliente {//NAO DIZ O TIPO DO PARAMETRO
        return
    }

    public getServico(idSer: string) {
        
    }

    public getAnimal(idAni: string) {
        
    }

}//ServicoClinica
