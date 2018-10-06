import {UserInbox} from "./userInbox";
import {Zap} from "./zap";
import {Repository} from "./repositorio";
import {User} from "./user";

export class Grupo{
    private _grupoId: string;
    protected rgUserinbox: Array<UserInbox>;

    constructor(grupoId: string){
        this._grupoId = grupoId;
        this.rgUserinbox = new Array<UserInbox>();
    }


    public get grupoId(): string {
        return this._grupoId;
    }

    /* getMsgs (userId: string, qtd: number): Zap[]{
        return 
    } */

    deliverZap (userId: string, msg: Zap){

    }
    getUsers(): Array<string>{
        let lista = [];
        console.log(this.rgUserinbox.length);
        for (let i = 0; i < this.rgUserinbox.length; i++){
            console.log(i);
            lista.push(this.rgUserinbox[i]._inboxId);
        }
        return lista;
    }

    unreadCount (userId: string): number{
        /* let inbox = this.rgUserinbox.get(userId);
        if (inbox)
            return inbox.unreadCount();
        return 0; */
        let inbox = this.rgUserinbox.find(x => x._user.userId == userId);
        if (!inbox)
            return 0;
        return inbox.unreadCount();
    }

    hasUser (userId: string): boolean{
        let inbox = this.rgUserinbox.find(x => x._user.userId == userId);
        if (!inbox)
            return false;
        return true;
    }

    addUserGrupo(user: User){
        let inbox = this.rgUserinbox.find(x => x._user == user);
        console.log(inbox);
        if (!inbox) {
            console.log(1);
            this.rgUserinbox.push(new UserInbox(user));
            console.log(2);
        } else {
            throw new Error("Usuario " + user.userId + " já esta no grupo\n");
        }
        console.log(3);
    }
    toString(): string{
        return this._grupoId;
    }

  /*   addByInvite(invited: User) {
        console.log("varios1");
        if (this.userInboxes.has(invited.userId)) {
            console.log("varios 2")
            return;
        }
        console.log("varios 3");
        this.userInboxes.set(invited.userId, new UserInbox(invited));
        console.log("varios 4");
        invited.addGrupo(this);
        console.log("varios 5");
    }   */

    /* rmUserChat (user: User){
        for(let key of this.rep_chat.keys()){
            if(this.rep_chat.get(key).hasUser(user.userId)){
                user.userId.split(user.userId, 1);
            }
        }
        throw new Error("Erro | Este usuário não existe")
    } */

}
