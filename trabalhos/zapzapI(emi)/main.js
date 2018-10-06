"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const poo_1 = require("./poo");
const repsitory_1 = require("./repsitory");
let HELP = `
help;
addUser _nome;
show;
newGrupo _userId _grupoId;
grupos _userId;
invite _userId _invitedId _grupoId;
grupers _Grupo;//ainda por fazer
leave _userId _grupoId;
zap _userId _grupoId _msg;
notify _userId;
ler _userId _grupoId;
`;
class WhatsappService {
    constructor() {
        this.rep_grupo = new repsitory_1.Repository("Chat");
        this.rep_user = new repsitory_1.Repository("Usuario");
    }
    allUsers() {
        return this.rep_user.getAll();
    }
    addUser(userId, user) {
        this.rep_user.add(userId, user);
    }
    addGrupo(userId, grupoId, grupo) {
        let gr = this.rep_grupo.has(grupoId);
        let user = this.rep_user.get(userId);
        if (!gr) {
            if (!user) {
                throw new Error(userId + " nao encontrado no sistema\n");
            }
            else {
                this.rep_grupo.add(grupoId, grupo);
                user.newGrupo(this.rep_grupo.get(grupoId));
                let grup = this.rep_grupo.get(grupoId);
                grup.addUserGrupo(user);
            }
        }
        else {
            throw new Error("Grupo " + grupoId + " ja existe no sistema\n");
        }
    }
    getAllGrupos() {
        return this.rep_grupo.getAll();
    }
    getUser(userId) {
        return this.rep_user.get(userId);
    }
    getAllMembersGrup(grupoId) {
        return this.rep_grupo.get(grupoId);
    }
}
class Zap {
    constructor(userId = "", msg = "") {
        this._UserId = userId;
        this._Msg = msg;
    }
    toString() {
        return "[ " + this._UserId + ": " + this._Msg + " ]";
    }
}
class User {
    constructor(userId = "") {
        this._id = userId;
        this.map_grupo = new Map();
    }
    get id() {
        return this._id;
    }
    showGrupos() {
        let saida = [""];
        let ram = "";
        let lista = this.map_grupo.values();
        for (let ele of lista) {
            ram += ele.grupoId;
            if (ele.unreadCount(this._id) > 0)
                ram += "(" + ele.unreadCount(this._id) + ") ";
            saida.push(ram);
            ram = "";
        }
        return saida;
    }
    newGrupo(grupo) {
        this.map_grupo.set(grupo.grupoId, grupo);
    }
    getGrupo(grupoId) {
        let gr = this.map_grupo.get(grupoId);
        if (!gr)
            throw new Error("grupo " + grupoId + " nao encontrado\n");
        return gr;
    }
    leave(grupoId) {
        let gp = this.map_grupo.get(grupoId);
        if (!gp)
            throw new Error(this._id + " nao estah no grupo\n");
        gp.dellUser(this);
        this.map_grupo.delete(gp.grupoId);
    }
    addGrupo(grupo) {
        this.map_grupo.set(grupo.grupoId, grupo);
    }
    toString() {
        return this.id;
    }
}
class UserInbox {
    constructor(user) {
        this._user = user;
        this._id = user.id;
        this._inbox = new Array();
        this._unreadCount = 0;
    }
    addZap(zap) {
        this._inbox.unshift(zap);
    }
    getZaps() {
        return this._inbox;
    }
}
class Grupo {
    constructor(grupoId, groupCreator) {
        this._grupoId = grupoId;
        this._rep_User = new repsitory_1.Repository("usuario");
        this._rgUserInbox = new Map();
    }
    get grupoId() {
        return this._grupoId;
    }
    dellUser(user) {
        this._rgUserInbox.delete(user.id);
        this._rep_User.rm(user.id);
    }
    unreadCount(userId) {
        let inbox = this._rgUserInbox.get(userId);
        if (inbox) {
            return inbox._unreadCount;
        }
        return 0;
    }
    getAllMembers() {
        let saida = [''];
        for (let ele of this._rep_User.getAll()) {
            saida.push(ele.id);
        }
        return saida;
    }
    getMsgs(userId, qtd) {
        let inbox = this._rgUserInbox.get(userId);
        let saida = [];
        if (inbox) {
            for (let i = 0; i < qtd; i++) {
                saida.unshift(inbox.getZaps()[i]);
            }
            inbox._unreadCount = 0;
        }
        return saida;
    }
    deliverZap(userId, zap) {
        for (let inbox of this._rgUserInbox.values()) {
            inbox.addZap(zap);
            inbox._unreadCount++;
        }
    }
    addUserGrupo(user) {
        this._rep_User.add(user.id, user);
        this._rgUserInbox.set(user.id, new UserInbox(user));
    }
    /* public addByInvite( invited: User) {
        this._rep_User.add(invited.id, invited);
        invited.addGrupo(this);
        this._rgUserInbox.set(invited.id, new UserInbox(invited));
    }
     */
    getInbox(userId) {
        let inbox = this._rgUserInbox.get(userId);
        if (!inbox)
            throw new Error("Usuario " + userId + " nao esta no grupo\n");
        return inbox;
    }
}
class Controller {
    constructor() {
        this.whatsapp_service = new WhatsappService;
    }
    process(line) {
        let ui = line.split(" ");
        let cmd = ui[0];
        if (cmd == "help") {
            return HELP;
        }
        else if (cmd == "addUser") {
            this.whatsapp_service.addUser(ui[1], new User(ui[1]));
        }
        else if (cmd == "show") {
            return poo_1.Poo.vet2str("Usuarios: \n[ ", this.whatsapp_service.allUsers(), " ") + "]\n";
        }
        else if (cmd == "newGrupo") {
            this.whatsapp_service.addGrupo(ui[1], ui[2], new Grupo(ui[2], this.whatsapp_service.getUser(ui[1])));
        }
        else if (cmd == "grupos") {
            return poo_1.Poo.vet2str("Grupos;\n[", this.whatsapp_service.getUser(ui[1]).showGrupos(), " ") + "]\n";
        }
        else if (cmd == "invite") {
            let user = this.whatsapp_service.getUser(ui[1]);
            let invited = this.whatsapp_service.getUser(ui[2]);
            user.getGrupo(ui[3]).addUserGrupo(invited);
        }
        else if (cmd == "grupers") {
            return poo_1.Poo.vet2str("Usuarios;\n[ ", this.whatsapp_service.getAllMembersGrup(ui[1]).getAllMembers(), " ") + "]\n";
        }
        else if (cmd == "leave") {
            let user = this.whatsapp_service.getUser(ui[1]);
            user.leave(ui[2]);
        }
        else if (cmd == "zap") {
            let user = this.whatsapp_service.getUser(ui[1]);
            user.getGrupo(ui[2]).deliverZap(user.id, new Zap(user.id, ui.slice(3).join(" ")));
        }
        else if (cmd == "notify") {
            let user = this.whatsapp_service.getUser(ui[1]);
            return poo_1.Poo.vet2str("Grupos\n[ ", user.showGrupos(), " ") + "]\n";
        }
        else if (cmd == "ler") {
            let user = this.whatsapp_service.getUser(ui[1]);
            return poo_1.Poo.vet2str("", user.getGrupo(ui[2]).getMsgs(user.id, user.getGrupo(ui[2]).unreadCount(user.id)), "\n");
        }
        else {
            return "comando invalido\n";
        }
        return "done\n";
    }
    main() {
        let c = new Controller();
        let line = "";
        while (line != "fim") {
            line = poo_1.Poo.cin(">>>");
            if ((line == "") || (line.substr(0, 2) == "  ") || (line[0] == "#"))
                continue;
            try {
                poo_1.Poo.cout(this.process(line));
            }
            catch (e) {
                poo_1.Poo.cout("" + e);
            }
        }
    }
}
let c = new Controller();
c.main();
