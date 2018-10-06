"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repositorio_1 = require("./repositorio");
class User {
    constructor(userId) {
        this._userId = userId;
        this._rep_grupo = new repositorio_1.Repository();
    }
    get rep_grupo() {
        return this._rep_grupo;
    }
    get userId() {
        return this.userId;
    }
    hasGrupo(grupoId) {
        return this._rep_grupo.has(grupoId);
    }
    getGrupos() {
        return this._rep_grupo.keys();
    }
    getGrupo(grupoId) {
        return this._rep_grupo.get(grupoId);
    }
    showGrupos() {
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
    toString() {
        return this._userId;
    }
}
exports.User = User;
