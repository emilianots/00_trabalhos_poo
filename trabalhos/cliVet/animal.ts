export class Animal{
    public _idAni: number;
    public _nome: string;
    public _especie: string;
    public _dono: string;

    public constructor(idAni: number, nome: string, especie: string, dono: string) {
        this._idAni = idAni;
        this._nome = nome;
        this._especie = especie;
        this._dono = dono;
    } 

    public toString(): string {
        return "" + this._idAni + " " + this._nome + " " + this._especie + " " + this._dono;
    }

}//Animal