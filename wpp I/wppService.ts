import {Repository} from "./repositorio";
import {Grupo} from "./grupo";
import {User} from "./user";

export class WhatsappService{
    private rep_grupo: Repository<Grupo>;
    public rep_user: Repository<User>;

    constructor(){
        this.rep_grupo = new Repository<Grupo>();
        this.rep_user = new Repository<User>();
    }

    addGrupo(userId: string, grupoId: string){   
        let grupo = new Grupo(grupoId);
        let user = this.rep_user.get(userId)
        this.rep_grupo.add(grupo.grupoId, grupo);
        user.rep_grupo.add(grupo.grupoId, grupo);
        grupo.addUserGrupo(user);
    }
    addByInvite(userId: string, invitedId: string, grupoId: string): void{
        let grupo = this.rep_grupo.get(grupoId);
        if (grupo.hasUser(userId) == false)
            return;
        let invited = this.rep_user.get(invitedId);
        grupo.addUserGrupo(invited);
    }

    addUser(userId: string){
        this.rep_user.add(userId, new User(userId));
    }
    
    showChatUser(userId: string){
        let resp = "";
        let user = this.rep_user.get(userId);
        let chats = user.getGrupos();
        for(let key of chats){
            resp += key;
        }
        return resp;
    }

    allUsers(): Array<User>{
        return this.rep_user.values();
    }

    getGrupoWpp(grupoId: string) {
        console.log("11");
        return this.rep_grupo.get(grupoId);
    }

    getUser(userId: string){
        return this.rep_user.get(userId);
    }
}
