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
class Repository {
    constructor(filetype) {
        this.filetype = filetype;
        this._map = new Map();
    }
    add(key, t) {
        if (this._map.has(key)) {
            throw new Error("" + key + " ja existe");
        }
        this._map.set(key, t);
    }
    rm(key) {
        if (!this._map.delete(key))
            throw new Error("" + key + " nao encontrado");
    }
    key() {
        let saida = new Array();
        for (let key of this._map.keys()) {
            saida.push(key);
        }
        return saida;
    }
    get(key) {
        let user = this._map.get(key);
        readline_1.cout(key);
        if (user) {
            return user;
        }
        else {
            throw new Error("" + key + " nao encontrado\n");
        }
    }
    getAll() {
        let saida = new Array();
        for (let t of this._map.values()) {
            saida.push(t);
        }
        return saida;
    }
}
class Tweet {
    constructor(id, userName, msg) {
        this._idTw = id;
        this._userName = userName;
        this._msg = msg;
        this._likes = [];
        //this._likes = new Array<string>();
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
        let saida = "id: " + this._idTw + " UserName: " + this._userName + "\ntexto: " + this._msg + "\nlikes { ";
        for (let nome of this._likes) {
            saida += nome + " ";
        }
        saida += "}";
        return saida;
    }
}
class User {
    constructor(name) {
        this._userName = name;
        this._seguidores = new Repository("usuario");
        this._seguindo = new Repository("usuario");
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
    get seguidos() {
        return this._seguindo;
    }
    get myTweets() {
        return this._myTweets;
    }
    get timeline() {
        return this._timeline;
    }
    seguir(user) {
        if (this._seguindo.get("" + user.userName))
            throw new Error("voce ja segue " + user.userName + "\n");
        user._seguidores.add(this.userName, this);
        this._seguindo.add(user.userName, user);
    }
    twitar(tweet) {
        this._myTweets.unshift(tweet);
        let users = this._seguidores.getAll();
        for (let user of users) {
            user._timeline.unshift(tweet);
            user._unreadCount++;
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
        for (let tw of this._timeline) {
            if (tw.idTw == idTw && !tw.likes.join(" ").includes(this.userName))
                tw.likes.push(this.userName);
            else
                throw new Error("voce já curtiu esse tweet");
        }
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
        readline_1.cout(this._r_tw.get("" + 0));
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
        /* let user1 = this.repo.get(ui[1]);
        let user2 = this.repo.get(ui[2]); */
        if (cmd == "help") {
            return HELP;
        }
        else if (cmd == "addUser") {
            this.repo.add(ui[1], new User(ui[1]));
        }
        else if (cmd == "users") {
            return "[ " + this.repo.key().join(" ") + " ]";
        }
        else if (cmd == "seguir") {
            let user1 = this.repo.get(ui[1]);
            let user2 = this.repo.get(ui[2]);
            user1.seguir(user2);
        }
        else if (cmd == "twittar") {
            let user1 = this.repo.get(ui[1]);
            user1.twitar(this.twGen.create(user1.userName, ui.slice(2).join(" ")));
        }
        else {
            return "comando invalido\n";
        }
        return "done";
    }
    main() {
        let c = new Controller();
        let line = "";
        while (line != "fim") {
            line = readline_1.cin(">>>");
            if ((line == "") || (line.substr(0, 2) == "  ") || (line[0] == "#"))
                continue;
            try {
                readline_1.cout(this.process(line));
            }
            catch (e) {
                readline_1.cout("" + e.mensagem);
            }
        }
    }
}
let c = new Controller();
c.main();
