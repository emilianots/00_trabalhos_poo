import {User} from "./user";
import {Zap} from "./zap";

export class UserInbox{
    public _inboxId: string;
    public _user: User;
    public _inbox: Zap[];

    constructor(user: User){
        this._user = user;
        this._inbox = [];
        this._inboxId = user.userId;
    }

    public addZap(zap: Zap){
        this._inbox.unshift(zap);
    }

    public unreadCount(){
        return this._inbox.length;
    }
    
    public getZaps(): Array<Zap>{
        let msgs = this._inbox;
        this._inbox = [];
        return msgs;
    }
}