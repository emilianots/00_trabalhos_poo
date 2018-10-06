import {Repository} from "./repository";
import {Animal} from "./animal";

export class Cliente{
    private idCli: string;
    private nome: string;
    private animais: Repository<Animal>;

    public constructor(idCli: string, nome: string) {
        this.idCli = idCli;
        this.nome = nome;
        this.animais = new Repository<Animal>("Animal");
    }

	public get $nome(): string {
		return this.nome;
	}
    
    public addAni(ani: Animal) {
        
    }

    public getIdCli() {
        
    }

    public getAnimais() {
        
    }

    public toString(): string {
        //ARRUMAR O TOSTRING NA PARTE DE ANIMAIS;
        return "" + this._idCli + " " + this._nome + " " + this._animais;
    }

}//Cliente