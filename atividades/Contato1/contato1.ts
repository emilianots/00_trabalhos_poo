import {Telefone} from "./telefone";
import {cin, cout} from "./readline";
export class Contato{
    private _nome: string;
    private _email: string
    private telefones: Array<Telefone>;

    constructor(nome: string, email : string){
        this._nome = nome;
        this._email = email;
        this.telefones = new Array<Telefone>();
    }

	public get nome(): string {
		return this._nome;
	}

	public set nome(value: string) {
		this._nome = value;
    }    
    
    public get email(): string {
		return this._email;
	}

	public set email(value: string) {
		this._email = value;
    }    

    addFone(telefone: Telefone): boolean {
        if(this.validar(telefone.numero)){
            for(let fone of this.telefones){
                if(fone.foneid == telefone.foneid){
                    throw new Error("id já existe no sistema\n")
                }
            }
            this.telefones.push(telefone);
            return true;
        }
        return false;
    }
    validar(fone: string): boolean {
        if (fone == "" || fone == " ") throw new Error("Numero vazio\n");
            for (let caractere of fone) {
                if (!("-()1234567890".includes(caractere))) 
                    throw new Error("Numero invalido\n");
        } 
        return true;
    }

    rmFone(foneid: string): boolean{
        for(let fone in this.telefones){
            if(foneid == this.telefones[fone].foneid){
                this.telefones.splice(Number(fone), 1);
            return true;  
            }
        }
        return false;
    }
}