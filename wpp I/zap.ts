export class Zap{
    public _userId: string;
    public _msg: string;

    constructor(userId: string, msg: string){
        this._userId = userId;
        this._msg = msg;
    }
    public toString(): string{
        return "[ " + this._userId + ": " + this._msg + " ]"; 
    }
}