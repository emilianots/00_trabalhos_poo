export class Servico{
    public _idSer: number;
    public _nome: string;
    public _valor: string; // no diagrama tá number mas lá no metodo add servico da classe ServicoClinica ele usa como parametro uma string e na imagem de teste do programa se usa sring.

    public constructor(idSer: number, nome: string, valor: string) {
        this._idSer = idSer;
        this._nome = nome;
        this._valor = valor; //NO DIAGRA TA ESPECIE
    }

    public toString(): string {
        return "" + this._idSer + " " + this._nome + " " + this._valor;
    }

}//Service