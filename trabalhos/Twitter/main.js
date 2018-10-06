"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("./readline");
class Twitter {
    constructor(id = 0, userName = "", msg = "") {
        this._idTw = id;
        this._userName = userName;
        this._msg = msg;
        this._likes = [];
    }
    get idTw() {
        return this._idTw;
    }
    get userName() {
        return this._userName;
    }
    get msg() {
        return this._msg;
    }
    set msg(value) {
        this._msg = value;
    }
    addLike(user) {
        this._likes.push(user);
    }
    toString() {
        let saida = "" + this._idTw + "| " + this._userName + ": " + this._msg + " { ";
        for (let user of this._likes) {
            saida += user.userName;
            saida += " ";
        }
        saida += "}";
        return saida;
    }
}
class User {
    constructor(userName = "") {
        this._userName = userName;
        this._seguidores = new Map();
        this._seguindo = new Map();
        this._myMsg = [];
        this._timeline = [];
        this._unreadCount = 0;
    }
    get userName() {
        return this._userName;
    }
    get seguidores() {
        return this._seguidores;
    }
    get seguindo() {
        return this._seguindo;
    }
    get timeline() {
        return this._timeline;
    }
    get myMsg() {
        return this._myMsg;
    }
    get unreadCount() {
        return this._unreadCount;
    }
    set unreadCount(value) {
        this._unreadCount = value;
    }
    getTwit(id) {
        for (let twit of this._myMsg) {
            if (twit.idTw == id)
                return twit;
        }
        return undefined;
    }
    seguir(seguido) {
        if (!this._seguindo.has(seguido._userName)) {
            this._seguindo.set(seguido._userName, seguido);
            seguido._seguidores.set(this._userName, this);
            return true;
        }
        return false;
    }
    twitar(id, msg) {
        let twit = new Twitter(id, this._userName, msg);
        this._myMsg.unshift(twit);
        for (let usuario of this._seguidores.values()) {
            usuario._timeline.unshift(twit);
            usuario._unreadCount++;
        }
        return true;
    }
    like(idTwit, user) {
        let liker = this._seguindo.get(user);
        if (liker) {
            let twite = liker.getTwit(idTwit);
            if (twite) {
                twite.addLike(liker);
                return true;
            }
        }
        return false;
    }
    getSeguidores() {
        let saida = "[ ";
        for (let elem of this._seguidores.keys()) {
            saida += elem + " ";
        }
        saida += " ]";
        if (saida.length <= 4)
            saida = "[ -- vazio -- ]";
        return saida;
    }
    getSeguindo() {
        let saida = "[ ";
        for (let elem of this._seguindo.keys()) {
            saida += elem + " ";
        }
        saida += " ]";
        if (saida.length <= 4)
            saida = "[ -- vazio -- ]";
        return saida;
    }
    getTimeline() {
        let st = "---Timeline " + this.userName + "---\n";
        for (let twit of this._timeline) {
            st += twit.toString() + "\n";
        }
        this.unreadCount = 0;
        return st;
    }
    getUnread() {
        let saida = "---unread " + this.userName + "---\n";
        for (let i = 0; i < this.unreadCount; i++) {
            saida += this._timeline[i].toString() + "\n";
        }
        this.unreadCount = 0;
        return saida;
    }
    toString() {
        let st = "Nome: " + this._userName + "\n";
        for (let valor of this._myMsg) {
            st += valor.toString() + "\n";
        }
        return st;
    }
}
User._nextId = 0;
class Manager {
    constructor() {
        this._usuarios = new Map();
    }
    add(usuario) {
        if (!this._usuarios.has(usuario.userName)) {
            this._usuarios.set(usuario.userName, usuario);
            return true;
        }
        return false;
    }
    get(useName) {
        return this._usuarios.get(useName);
    }
    getUsers() {
        let lista = [];
        for (let elem of this._usuarios.values()) {
            lista.push(elem);
        }
        return lista;
    }
}
class Controller {
    constructor() {
        this.manager = new Manager;
    }
    process(line) {
        let ui = line.split(" ");
        let cmd = ui[0];
        if (cmd == "help") {
            return "addUser" + "\n" +
                "show" + "\n" +
                "seguir _seguidor _seguido" + "\n" +
                "seguindo _nome" + "\n" +
                "seguidores _nome" + "\n" +
                "twitar _nome _msg" + "\n" +
                "unread _nome" + "\n" +
                "myMsg _nome" + "\n" +
                "like _nome _idTwit\n";
        }
        else if (cmd == "show") {
            let listaUser = this.manager.getUsers();
            let saida = "[ ";
            for (let nome of listaUser) {
                saida += nome.userName + " ";
            }
            saida += "]\n";
            return saida;
        }
        else if (cmd == "addUser") {
            let nUser = new User(ui[1]);
            if (nUser) {
                if (this.manager.add(nUser))
                    return "usuario adicionado\n";
                else
                    return "|erro ao adicionar usuario|\n";
            }
            else {
                return "|erro ao adicionar usuario|\n";
            }
        }
        else if (cmd == "seguir") {
            let seguidor = this.manager.get(ui[1]);
            let seguido = this.manager.get(ui[2]);
            if (seguidor && seguido) {
                if (seguidor.seguir(seguido))
                    return "sucesso\n";
                else
                    return "|erro|\n";
            }
            else {
                return "|erro|\n";
            }
        }
        else if (cmd == "seguindo") {
            let user = this.manager.get(ui[1]);
            if (user)
                return user.getSeguindo();
            else
                return "|erro|\n";
        }
        else if (cmd == "seguidores") {
            let user = this.manager.get(ui[1]);
            if (user)
                return user.getSeguidores();
            else
                return "|erro|\n";
        }
        else if (cmd == "twitar") {
            let usuario = this.manager.get(ui[1]);
            if (usuario) {
                if (usuario.twitar(User._nextId, ui.slice(2).join(" "))) {
                    User._nextId++;
                    return "twitou com sucesso\n";
                }
                else {
                    return "|erro no twit|\n";
                }
            }
            else {
                return "|usuario nao encontrado|\n";
            }
        }
        else if (cmd == "timeline") {
            let user = this.manager.get(ui[1]);
            if (user)
                return user.getTimeline();
            else
                return "|usuario nao encontrado|\n";
        }
        else if (cmd == "unread") {
            let user = this.manager.get(ui[1]);
            if (user) {
                return user.getUnread();
            }
            else {
                return "|erro\n|";
            }
        }
        else if (cmd == "myMsg") {
            let user = this.manager.get(ui[1]);
            if (user)
                return user.toString();
            else
                return "|erro|\n";
        }
        else if (cmd == "like") {
            let user = this.manager.get(ui[1]);
            if (user) {
                let usuarios = this.manager.getUsers();
                for (let elem of usuarios) {
                    let twitte = elem.getTwit(Number(ui[2]));
                    if (twitte) {
                        twitte.addLike(user);
                        return "Likou\n";
                    }
                }
            }
            return "|erro|\n";
        }
        else if (cmd == "bug") {
            let user = this.manager.get(ui[1]);
            if (user)
                readline_1.cout(user);
        }
        else {
            return "|comando invalido|";
        }
        return "done";
    }
    static main() {
        let c = new Controller();
        let line = "";
        while (line != "fim") {
            line = readline_1.cin(">>> ");
            if (line == "")
                continue;
            readline_1.cout(c.process(line));
        }
    }
}
Controller.main();
