"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("./readline");
let HELP = `
help
users
addUser    _nome
seguir     _nome _outro
twittar    _nome _(mensagem com varias palavras)
like       _nome _tweetId
seguidores _nome
seguidos   _nome
timeline   _nome
myTweets   _nome
unread     _nome
`;

class Tweet {
    constructor(id, userName, msg) {
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
    get likes() {
        return this._likes;
    }
    toString() {
        let saida = "" + this._idTw + " " + this.userName + ": " + this.msg;
        if (this.likes.length == 0)
            return saida;
        saida += " { ";
        for (let like of this.likes) {
            saida += like + " ";
        }
        saida += "}";
        return saida;
    }
}
class User {
    constructor(name) {
        this._userName = name;
        this._seguidores = new Array();
        this._seguindo = new Array();
        this._myTweets = new Array();
        this._timeline = new Array();
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
    get myTweets() {
        return this._myTweets;
    }
    get timeline() {
        this._unreadCount = 0;
        return this._timeline;
    }
    seguir(user) {
        for (let us of this.seguindo) {
            if (user == us) {
                throw new Error("" + this.userName + " já tá seguindo " + user.userName + "\n");
            }
        }
        this._seguindo.push(user);
        user._seguidores.push(this);
    }
    twitar(tweet) {
        this._myTweets.unshift(tweet);
        for (let usr of this._seguidores) {
            usr._timeline.unshift(tweet);
            usr._unreadCount++;
        }
    }
    getUnread() {
        let saida = new Array();
        for (let i = 0; i < this._unreadCount; i++) {
            saida.push(this._timeline[i]);
        }
        this._unreadCount = 0;
        return saida;
    }
    addLike(idTw) {
        let estah = false;
        let t = new Tweet(-1, "------", "------");
        for (let tw of this._timeline) {
            if (tw.idTw == idTw) {
                t = tw;
                estah = true;
            }
        }
        if (estah) {
            if (!t.likes.join(" ").includes(this.userName)) {
                t.likes.push(this.userName);
            }
            else {
                throw new Error("fail: tweet " + idTw + " ja foi curtido\n");
            }
        }
        else {
            throw new Error("fail: tweet " + idTw + " nao existe\n");
        }
    }
    static genStrT(lista) {
        let saida = "";
        for (let elem of lista) {
            saida += elem + "\n";
        }
        return saida;
    }
    static genStrU(lista) {
        let saida = "[ ";
        for (let elem of lista) {
            saida += elem.userName + " ";
        }
        saida += "]";
        return saida;
    }
}
class TweetGenerator {
    constructor(r_tw) {
        this._r_tw = r_tw;
    }
    create(username, msg) {
        let nextId = TweetGenerator._nextId;
        this._r_tw.add("" + TweetGenerator._nextId, new Tweet(nextId, username, msg));
        TweetGenerator._nextId++;
        return this._r_tw.get("" + nextId);
    }
}
TweetGenerator._nextId = 0;
class Controller {
    constructor() {
        this.repo = new Repository("usuario");
        this.repoTw = new Repository("tweet");
        this.twGen = new TweetGenerator(this.repoTw);
    }
    process(line) {
        let ui = line.split(" ");
        let cmd = ui[0];
        if (cmd == "help") {
            return HELP;
        }
        else if (cmd == "addUser") {
            this.repo.add(ui[1], new User(ui[1]));
        }
        else if (cmd == "users") {
            return "usuarios\n[" + this.repo.key().join(" ") + "]";
        }
        else if (cmd == "seguir") {
            this.repo.get(ui[1]).seguir(this.repo.get(ui[2]));
            return "" + ui[1] + " esta seguindo " + ui[2] + "\n";
        }
        else if (cmd == "twittar") {
            let user = this.repo.get(ui[1]);
            user.twitar(this.twGen.create(user.userName, ui.slice(2).join(" ")));
        }
        else if (cmd == "seguidores") {
            return User.genStrU(this.repo.get(ui[1]).seguidores);
        }
        else if (cmd == "seguidos") {
            return User.genStrU(this.repo.get(ui[1]).seguindo);
        }
        else if (cmd == "timeline") {
            return User.genStrT(this.repo.get(ui[1]).timeline);
        }
        else if (cmd == "unread") {
            return User.genStrT(this.repo.get(ui[1]).getUnread());
        }
        else if (cmd == "myTweets") {
            return User.genStrT(this.repo.get(ui[1]).myTweets);
        }
        else if (cmd == "like") {
            this.repo.get(ui[1]).addLike(Number(ui[2]));
        }
        else {
            return "comando invalido";
        }
        return "done";
    }
    commandLine() {
        let line = "";
        readline_1.cout("Digite cmd, help ou fim");
        while (line != "fim") {
            line = readline_1.cin(">>>");
            if ((line == "") || (line.substr(0, 2) == "  ") || (line[0] == "#"))
                continue;
            try {
                readline_1.cout(this.process(line));
            }
            catch (e) {
                readline_1.cout("" + e.message);
            }
        }
    }
}
let c = new Controller();
c.commandLine();
