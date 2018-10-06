import {Tweet} from "./tweet"

export class User{
    private _userName: string;
    private _seguidores: Array<User>;
    private _seguindo: Array<User>;
    private _myTweets: Array<Tweet>;
    private _timeline: Array<Tweet>;
    private _unreadCount: number;

    constructor(name: string) {
        this._userName = name;
        this._seguidores = new Array<User>();
        this._seguindo = new Array<User>();
        this._myTweets = new Array<Tweet>();
        this._timeline = new Array<Tweet>();
        this._unreadCount = 0;
    }

	public get userName(): string {
		return this._userName;
	}

	public get seguidores(): Array<User> {
		return this._seguidores;
	}

	public get seguindo(): Array<User> {
		return this._seguindo;
	}

	public get myTweets(): Array<Tweet> {
		return this._myTweets;
	}

	public get timeline(): Array<Tweet> {
        this._unreadCount = 0;
        return this._timeline;
	}

    public seguir(user: User): void {
        for(let us of this.seguindo){
            if (user == us){
                throw new Error ("" + this.userName + " já tá seguindo " + user.userName + "\n");
            }
        }
        this._seguindo.push(user);
        user._seguidores.push(this);
    }
    
    public twitar(tweet: Tweet): void {
        this._myTweets.unshift(tweet);
        for(let usr of this._seguidores) {
            usr._timeline.unshift(tweet);
            usr._unreadCount++;
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
        let estah = false;
        let t: Tweet = new Tweet(-1, "------", "------");
        for(let tw of this._timeline) {
            if(tw.idTw == idTw){
                t = tw;
                estah = true;
            }
        }
        if(estah) {
            if(!t.likes.join(" ").includes(this.userName)){
                t.likes.push(this.userName);
            } else {
                throw new Error("fail: tweet " + idTw + " ja foi curtido\n");
            }
        } else {
            throw new Error("fail: tweet " + idTw + " nao existe\n");
        }
    }

    public static genStrT(lista: Array<Tweet>): string {
        let saida = "";
        for(let elem of lista) {
            saida += elem + "\n";
        }
        return saida;
    }

    public static genStrU(lista: Array<User>): string {
        let saida = "[ ";
        for(let elem of lista) {
            saida += elem.userName + " ";
        }
        saida += "]";
        return saida;
    }
}
