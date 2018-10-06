
export class Tweet{
    private _idTw: number;
    private _userName: string;
    private _msg: string;
    private _likes: Array<string>;

    public constructor(id: number, userName: string, msg: string) {
        this._idTw = id;
        this._userName = userName;
        this._msg = msg;
        this._likes = [];
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
        let saida = "" + this._idTw + " " + this.userName + ": " + this.msg;
        if(this.likes.length == 0)
            return saida;
        saida += " { "
        for(let like of this.likes){
            saida += like + " ";
        }
        saida += "}";
        return saida;
    } 
}
