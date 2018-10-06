import {cin, cout} from "./readline";

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

class Repository<T>{
    private _map: Map<string,T>;
    private filetype: string;

    public constructor(filetype: string){
        this.filetype = filetype;
        this._map = new Map<string, T>();
    }

    public add(key: string, t: T): void {
        if(this._map.has(key)) {
            throw new Error("" + key + " ja existe");
        }
        this._map.set(key, t);
    }

    public rm(key: string): void {
        if(!this._map.delete(key))
            throw new Error("" + key + " nao encontrado");
    }

    public key(): Array<string> {
        let saida = new Array<string>();
        for(let key of this._map.keys()) {
            saida.push(key);
        }
        return saida;
    }

    public get(key: string): T {
        let user = this._map.get(key);
        cout(key);
        if(user){
            return user;
        } else {
            throw new Error("" + key + " nao encontrado\n");
        }
    }

    public getAll(): Array<T> {
        let saida = new Array<T>();
        for(let t of this._map.values()) {
            saida.push(t);
        }
        return saida;
    }
}

class Tweet{
    private _idTw: number;
    private _userName: string;
    private _msg: string;
    private _likes: Array<string>;

    public constructor(id: number, userName: string, msg: string) {
        this._idTw = id;
        this._userName = userName;
        this._msg = msg;
        this._likes = [];
        //this._likes = new Array<string>();
    }

	public get idTw(): number {
		return this._idTw;
	}

	public get userName(): string {
		return this._userName;
	}

	public get msg(): string {
		return this._msg;
    }


	public get likes(): Array<string> {
		return this._likes;
	}    
    
    public toString(): string {
        let saida = "id: " + this._idTw + " UserName: " + this._userName + "\ntexto: " + this._msg + "\nlikes { "; 
        for(let nome of this._likes) {
            saida += nome + " ";
        }
        saida += "}";
        return saida;
    } 
}

class User{
    private _userName: string;
    private _seguidores: Repository<User>;
    private _seguindo: Repository<User>;
    private _myTweets: Array<Tweet>;
    private _timeline: Array<Tweet>;
    private _unreadCount: number;

    constructor(name: string) {
        this._userName = name;
        this._seguidores = new Repository<User>("usuario");
        this._seguindo = new Repository<User>("usuario");
        this._myTweets = new Array<Tweet>();
        this._timeline = new Array<Tweet>();
        this._unreadCount = 0;
    }

	public get userName(): string {
		return this._userName;
	}

	public get seguidores(): Repository<User> {
		return this._seguidores;
	}

	public get seguidos(): Repository<User> {
		return this._seguindo;
    }

	public get myTweets(): Array<Tweet> {
		return this._myTweets;
	}

	public get timeline(): Array<Tweet> {
		return this._timeline;
	}

    public seguir(user: User): void {
        if(this._seguindo.get("" + user.userName))
            throw new Error("voce ja segue " + user.userName + "\n");
        user._seguidores.add(this.userName, this);
        this._seguindo.add(user.userName, user);
    }
    
    public twitar(tweet: Tweet): void {
        this._myTweets.unshift(tweet);
        let users = this._seguidores.getAll();
        for(let user of users) {
            user._timeline.unshift(tweet);
            user._unreadCount++;
        }
    }
    public getUnread(): Array<Tweet> {
        let saida = new Array<Tweet>();
        for(let i = 0; i < this._unreadCount; i++) {
            saida.push(this._timeline[i]);
        }
        this._unreadCount = 0;
        return saida;
    }
    public addLike(idTw: number): void {
        for(let tw of this._timeline) {
            if(tw.idTw == idTw && !tw.likes.join(" ").includes(this.userName))
                tw.likes.push(this.userName);
            else
                throw new Error("voce já curtiu esse tweet");
        }
    }
    
}

class TweetGenerator{
    public static _nextId: number = 0;
    public _r_tw: Repository<Tweet>;

    constructor(r_tw: Repository<Tweet>) {
        this._r_tw = r_tw;
    }

    public create(username: string, msg: string): Tweet {
        let nextId = TweetGenerator._nextId;
        this._r_tw.add("" + TweetGenerator._nextId, new Tweet(nextId, username, msg))
        TweetGenerator._nextId++;
        cout(this._r_tw.get("" + 0));
        return this._r_tw.get("" + nextId);
    }
}


class Controller{
    repo: Repository<User>;
    twGen: TweetGenerator;
    repoTw: Repository<Tweet>;

    constructor(){
        this.repo = new Repository<User>("usuario");
        this.repoTw = new Repository<Tweet>("tweet");
        this.twGen = new TweetGenerator(this.repoTw);
    }

    public process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];
        /* let user1 = this.repo.get(ui[1]);
        let user2 = this.repo.get(ui[2]); */
        if(cmd == "help") {
            return HELP;
        } else if(cmd == "addUser") {
            this.repo.add(ui[1], new User(ui[1]));
        } else if(cmd == "users") {
            return "[ " + this.repo.key().join(" ") + " ]";
        } else if(cmd == "seguir") {
            let user1 = this.repo.get(ui[1]);
            let user2 = this.repo.get(ui[2]);
            user1.seguir(user2);
        } else if(cmd == "twittar") {
            let user1 = this.repo.get(ui[1]);
            user1.twitar(this.twGen.create(user1.userName,ui.slice(2).join(" ")));
        } else {
            return "comando invalido\n";
        }
        return "done";
    }
    public main() {
        let c: Controller = new Controller();
        let line: string = "";
        while(line != "fim") {
            line = cin(">>>");
            if((line == "") || (line.substr(0, 2) == "  ") || (line[0] == "#"))
                continue;
            try{
                cout(this.process(line));
            }catch(e){
                cout("" + e.mensagem);
            }
        }
    }
}
let c: Controller = new Controller();
c.main();
