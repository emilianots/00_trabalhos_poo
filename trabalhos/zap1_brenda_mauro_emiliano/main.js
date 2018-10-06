"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const poo_1 = require("./poo");
const repositorio_1 = require("./repositorio");
class Zap {
    constructor(userId = "", msg = "") {
        this._UserId = userId;
        this._Msg = msg;
    }
    toString() {
        return "[ " + this._UserId + ": " + this._Msg + " ]";
    }
}
class UserInbox {
    constructor(user) {
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
class Notify {
    constructor(chatId = "", qtd = 0) {
        this.chatId = chatId;
        this.qtd = qtd;
    }
    toString() {
        let saida = this.chatId;
        if (this.qtd > 0)
            saida += "(" + this.qtd + ")";
        return saida;
    }
}
class User {
    constructor(id) {
        this._id = id;
        this._rGrupos = new repositorio_1.Repository("Grupo");
    }
    get id() {
        return this._id;
    }
    get rGrupos() {
        return this._rGrupos;
    }
    sendMsg(grupoId, msg) {
        let grupo = this._rGrupos.get(grupoId);
        grupo.deliverZap(this._id, msg);
    }
    getNotify() {
        let lista = [];
        for (let elem of this._rGrupos.getAll())
            lista.push(elem.getNotify(this._id));
        return lista;
    }
    getGrupo(id) {
        return this._rGrupos.get(id);
    }
    getGrupos() {
        let lista = [];
        for (let elem of this._rGrupos.getAll())
            lista.push(elem.grupoId);
        return lista;
    }
    toString() {
        return this._id;
    }
}
class Grupo {
    constructor(chatId = "") {
        this._grupoId = chatId;
        this._mUserInbox = new Map();
    }
    get grupoId() {
        return this._grupoId;
    }
    newUser(user) {
        if (this._mUserInbox.has(user.id) == true) {
            throw new Error("Usuario " + user + " já estah no grupo\n");
        }
        user.rGrupos.add(this.grupoId, this);
        this._mUserInbox.set(user.id, new UserInbox(user));
    }
    rmUser(user) {
        if (!this._mUserInbox.has(user.id))
            throw new Error(user.id + " não estah no grupo " + this._grupoId + "\n");
        this._mUserInbox.delete(user.id);
        user.rGrupos.rm(this._grupoId);
    }
    getMembers() {
        let lista = [];
        for (let elem of this._mUserInbox.keys())
            lista.push(elem);
        return lista;
    }
    deliverZap(userId, msg) {
        let zap = new Zap(userId, msg);
        for (let elem of this._mUserInbox.values()) {
            elem.addZap(zap);
        }
    }
    getNotify(id) {
        let inbox = this._mUserInbox.get(id);
        if (!inbox)
            throw new Error("Usuario " + id + " nao estah no grupo\n");
        return new Notify(this.grupoId, inbox._inbox.length);
    }
    getMsgs(id) {
        let inbox = this._mUserInbox.get(id);
        if (!inbox)
            throw new Error("Usuario " + id + " nao estah no grupo\n");
        let aux = inbox.getZaps();
        inbox._inbox = new Array();
        return aux;
    }
    toString() {
        return "" + this._grupoId;
    }
}
class WhatsappService {
    constructor() {
        this._rUsers = new repositorio_1.Repository("User");
        this._rGrupos = new repositorio_1.Repository("Chat");
    }
    newUser(userId) {
        this._rUsers.add(userId, new User(userId));
    }
    getUser(userId) {
        return this._rUsers.get(userId);
    }
    newGrupo(userId, grupoId) {
        let user = this._rUsers.get(userId);
        let grupo = new Grupo(grupoId);
        this._rGrupos.add(grupo.grupoId, grupo);
        grupo.newUser(user);
    }
    addByIvite(userId, invited, grupoId) {
        let user = this._rUsers.get(userId);
        let user2 = this._rUsers.get(invited);
        let grupo = user.rGrupos.get(grupoId);
        grupo.newUser(user2);
    }
    getMsgs(userId, grupoId) {
        let grupo = this._rGrupos.get(grupoId);
        let user = this._rUsers.get(userId);
        let lista = [];
        for (let elem of grupo.getMsgs(userId)) {
            lista.unshift("" + elem);
        }
        return lista;
    }
    rmUser(userId, grupoId) {
        let grupo = this._rGrupos.get(grupoId);
        let user = this._rUsers.get(userId);
        grupo.rmUser(user);
    }
    usersGrupo(grupoId) {
        return this._rGrupos.get(grupoId).getMembers();
    }
    sendZap(userId, grupoId, msg) {
        let user = this._rUsers.get(userId);
        user.sendMsg(grupoId, msg);
    }
    getNotify(userId) {
        let user = this._rUsers.get(userId);
        return user.getNotify();
    }
    getAllUsers() {
        return this._rUsers.getAll();
    }
    getAllGrupos() {
        return this._rGrupos.getAll();
    }
}
class Controller {
    constructor() {
        this.wpp = new WhatsappService;
    }
    process(line) {
        let eh = line.split(" ");
        let cmd = eh[0];
        if (cmd == "help") {
            return "addUser _username" + "\n" +
                "allUsers" + "\n" +
                "newGrupo _userDono _nomeGrupo" + "\n" +
                "grupos _user" + "\n" +
                "invite _userDono _amigo _grupo" + "\n" +
                "users _grupo" + "\n" +
                "sairDoGrupo _user _Grupo" + "\n" +
                "zap _user _grupo _mensagem" + "\n" +
                "notificacoes _user" + "\n" +
                "ler _user _grupo" + "\n" +
                "fim";
        }
        else if (cmd == "addUser") {
            this.wpp.newUser(eh[1]);
        }
        else if (cmd == "allUsers") {
            return poo_1.Poo.vet2str("Usuarios:\n[ ", this.wpp.getAllUsers(), " ") + "]\n";
        }
        else if (cmd == "newGrupo") {
            this.wpp.newGrupo(eh[1], eh[2]);
        }
        else if (cmd == "grupos") {
            return poo_1.Poo.vet2str("Grupos| " + eh[1] + ":\n[ ", this.wpp.getUser(eh[1]).getGrupos(), " ") + "]\n";
        }
        else if (cmd == "invite") {
            this.wpp.addByIvite(eh[1], eh[2], eh[3]);
        }
        else if (cmd == "users") {
            return poo_1.Poo.vet2str("Usuarios| " + eh[1] + ":\n[ ", this.wpp.usersGrupo(eh[1]), " ") + "]\n";
        }
        else if (cmd == "leave") {
            this.wpp.rmUser(eh[1], eh[2]);
        }
        else if (cmd == "zap") {
            this.wpp.sendZap(eh[1], eh[2], eh.slice(3).join(" "));
        }
        else if (cmd == "notify") {
            return poo_1.Poo.vet2str("Notificacoes| " + eh[1] + ":\n[ ", this.wpp.getNotify(eh[1]), " ") + "]\n";
        }
        else if (cmd == "ler") {
            return poo_1.Poo.vet2str(eh[2] + ":\n", this.wpp.getMsgs(eh[1], eh[2]), "\n") + "\n";
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
            line = poo_1.Poo.cin("Digite comanto ou help: ");
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
