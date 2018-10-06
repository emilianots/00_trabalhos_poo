import {Grupo} from "./grupo";
import {Repository} from "./repositorio";

export class User{
    private _userId: string;
    private _rep_grupo: Repository<Grupo>;

    constructor(userId: string){
        this._userId = userId;
        this._rep_grupo = new Repository<Grupo>();
    }

	public get rep_grupo(): Repository<Grupo> {
		return this._rep_grupo;
	}

	public get userId(): string {
		return this.userId;
	}
    
    hasGrupo(grupoId: string): boolean{
        return this._rep_grupo.has(grupoId);
    }

    getGrupos(): Array<string>{
        return this._rep_grupo.keys();
    }

    getGrupo(grupoId: string): Grupo{
        return this._rep_grupo.get(grupoId);
    }

    showGrupos(): string{
        let saida = "[ ";
        for (let elem of this._rep_grupo.keys())
            saida += elem + " ";
        return saida;
    }
/* 
    addGrupo(grupo: Grupo){
        this.rep_grupo.add(grupo.grupoId, grupo);
        grupo.addUserGrupo(this);
        
        try{
            this.rep_grupo.add(grupo.grupoId, grupo);
            grupo.addUserGrupo(this);
        }catch(e){

        }
    } 
 */
    toString(){
        return this._userId;
    }
}