"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repositorio_1 = require("./repositorio");
const grupo_1 = require("./grupo");
const user_1 = require("./user");
class WhatsappService {
    constructor() {
        this.rep_grupo = new repositorio_1.Repository();
        this.rep_user = new repositorio_1.Repository();
    }
    addGrupo(userId, grupoId) {
        let grupo = new grupo_1.Grupo(grupoId);
        let user = this.rep_user.get(userId);
        this.rep_grupo.add(grupo.grupoId, grupo);
        user.rep_grupo.add(grupo.grupoId, grupo);
        grupo.addUserGrupo(user);
    }
    addByInvite(userId, invitedId, grupoId) {
        let grupo = this.rep_grupo.get(grupoId);
        if (grupo.hasUser(userId) == false)
            return;
        let invited = this.rep_user.get(invitedId);
        grupo.addUserGrupo(invited);
    }
    addUser(userId) {
        this.rep_user.add(userId, new user_1.User(userId));
    }
    showChatUser(userId) {
        let resp = "";
        let user = this.rep_user.get(userId);
        let chats = user.getGrupos();
        for (let key of chats) {
            resp += key;
        }
        return resp;
    }
    allUsers() {
        return this.rep_user.values();
    }
    getGrupoWpp(grupoId) {
        console.log("11");
        return this.rep_grupo.get(grupoId);
    }
    getUser(userId) {
        return this.rep_user.get(userId);
    }
}
exports.WhatsappService = WhatsappService;
