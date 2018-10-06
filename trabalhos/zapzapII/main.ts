import {Poo} from "./poo";
import {Repository} from "./repsitory";


let HELP = `
help;
addUser _nome;
show;
newGrupo _userId _grupoId;
grupos _userId;
invite _userId _invitedId _grupoId;
grupers _grupo;//ainda por fazer
leave _userId _grupoId;
zap _userId _grupoId _msg;
notify _userId;
ler _userId _grupoId;
`;

class WhatsappService {
    private rep_conversa: Repository<Conversa>;
    private rep_user: Repository<User>;
    public rep_talk: Repository<Talk>;
    private rep_grupo: Repository<Grupo>;

    constructor(){
        this.rep_conversa = new Repository<Conversa>("Chat");
        this.rep_user = new Repository<User>("Usuario");
        this.rep_talk = new Repository<Talk>("Talk");
        this.rep_grupo = new Repository<Grupo>("Grupo");
    }

    public allUsers(): Array<User> {
        return this.rep_user.getAll();
    }

    public addUser(userId: string, user: User): void {
        this.rep_user.add(userId, user);
    }

    public addGrupo(userId: string, grupoId: string, grupo: Grupo): void {
        let gr = this.rep_grupo.has(grupoId);
        let user = this.rep_user.get(userId);
        if (!gr) {
            if (!user) {
                throw new Error(userId + " nao encontrado no sistema\n");
            } else {
                this.rep_grupo.add(grupoId, grupo);
                user.newGrupo(this.rep_grupo.get(grupoId));
                let grup = this.rep_grupo.get(grupoId);
                grup.addUserGrupo(user);
            }
            
        } else {
            throw new Error("Grupo " + grupoId + " ja existe no sistema\n");
        }
    }
    public addTalk(user1: User, user2: User) {
        
    }

    public getAllGrupos(): Array<Conversa> {
        return this.rep_grupo.getAll();
    }    
    public getUser(userId: string): User {
        return this.rep_user.get(userId);
    }
    public getAllMembersGrup(grupoId: string): Conversa {
        return this.rep_grupo.get(grupoId);
    }
}

class Zap {
    public _UserId: string;
    public _Msg: string;

    constructor(userId = "", msg = "") {
        this._UserId = userId;
        this._Msg = msg;
    }
    public toString(): string {
        return "[ " + this._UserId + ": " + this._Msg + " ]";
    }
}

class User{
    private _id: string;
    private map_conversas: Map<string, Conversa>;

    constructor(userId = ""){
        this._id = userId;
        this.map_conversas = new Map<string, Conversa>();
    }

	public get id(): string {
		return this._id;
    }
    
    public showGrupos(): Array<string>{
        let saida = [""];
        let ram = "";
        for (let ele of this.map_conversas.values()) {
            ram += ele.grupoId;
            if (ele.unreadCount(this._id) > 0)
                ram += "(" + ele.unreadCount(this._id) + ") ";
            saida.push(ram);
            ram = "";   
        }
        return saida;
    }
    
    public newGrupo(grupo: Conversa): void {
        this.map_conversas.set(grupo.grupoId, grupo);
    }

    public newTalk(user1: User, user2: User): void{
        
    }

    public getGrupo(grupoId: string): Conversa{
        let gr = this.map_conversas.get(grupoId);
        if (!gr)
            throw new Error("grupo " + grupoId + " nao encontrado\n");
        return gr;
    }

    public leave(grupoId: string): void {
        let gp = this.map_conversas.get(grupoId);
        if (!gp)
            throw new Error(this._id + " nao estah no grupo\n");
        gp.dellUser(this);
        this.map_conversas.delete(gp.grupoId);
    }

    public addGrupo(grupo: Conversa): void{
        this.map_conversas.set(grupo.grupoId, grupo)
    }

    public toString(): string {
        return this.id;
    }
}

class UserInbox {
    public _id: string;
    public _user: User;
    public _inbox: Array<Zap>;
    public _unreadCount: number;
    
    constructor(user: User) {
        this._user = user;
        this._id = user.id;
        this._inbox = new Array<Zap>();
        this._unreadCount = 0;
    
    }

    public addZap(zap: Zap) {
        this._inbox.unshift(zap);
    }
    public getZaps(): Array<Zap>{
        return this._inbox;
    }
}

class Conversa {
    protected _grupoId: string;
    protected _rep_User: Repository<User>;
    protected _rgUserInbox: Map<string, UserInbox>;

    constructor(grupoId: string, groupCreator: User) {
        this._grupoId = grupoId;
        this._rep_User = new Repository<User>("usuario");
        this._rgUserInbox = new Map<string, UserInbox>();
    }

	public get grupoId(): string {
		return this._grupoId;
    }
    public dellUser(user: User) {
        this._rgUserInbox.delete(user.id);
        this._rep_User.rm(user.id);
    }

    public unreadCount(userId: string): number{
        let inbox = this._rgUserInbox.get(userId);
        if (inbox) {
            return inbox._unreadCount;
        }
        return 0;
    }

    public getAllMembers(): Array<string>{
        let saida = [''];
        for(let ele of this._rep_User.getAll()){
            saida.push(ele.id);
        }
        return saida;
    }

    public getMsgs(userId: string, qtd: number): Array<Zap>{
        let inbox = this._rgUserInbox.get(userId);
        let saida = [];
        if (inbox) {
            for (let i = 0; i < qtd; i++){
                saida.unshift(inbox.getZaps()[i]);
            }
            inbox._unreadCount = 0;
        }
        return saida;
    }

    public deliverZap(userId: string, zap: Zap) {
        for (let inbox of this._rgUserInbox.values()) {
            inbox.addZap(zap);
            inbox._unreadCount++;
        }
    }

    public addUserGrupo(user: User) {
        this._rep_User.add(user.id, user);
        this._rgUserInbox.set(user.id, new UserInbox(user));
        
    }
    public addByInvite(user: User, invited: User) {
        this._rep_User.add(invited.id, invited);
        invited.addGrupo(this);
        this._rgUserInbox.set(invited.id, new UserInbox(invited));
    }
    
    public getInbox(userId: string): UserInbox {
        let inbox = this._rgUserInbox.get(userId);
        if (!inbox)
            throw new Error("Usuario " + userId + " nao esta no grupo\n");
        return inbox;
    }
}

class Talk extends Conversa{
    public talkId: string;

    constructor(grupoId: string, groupCreator: User, user2: User) {
        super(grupoId, groupCreator)
        this.talkId = this.setPair(groupCreator, user2);
    }

    public setPair(user1: User, user2: User): string {
        let ord = [user1.id, user2.id];
        let final = "";
        let ordAux = [];
        let ordOrg = "";

        ordAux.push(ord[0].toLowerCase(), ord[1].toLowerCase());
        ordAux.sort();
        ordOrg = ord[0];

        if (ord[0].toLowerCase() == ordAux[0]) {
            final = ordOrg + "-" + ord[1];
        } else {
            final = ord[1] + "-" + ordOrg;
        }
        return(final);
    }

    public addUserTalk(user: User) {
        throw new Error("fail: operação de adicionar usuários não suportada\n")
    }

    public rmUserTalk(user: User) {
        throw new Error("fail: operação de remover usuários não suportada\n")
    }
}

class Grupo extends Conversa{
    constructor(grupoId: string, groupCreator: User) {
        super(grupoId, groupCreator);
    }

    public addUserChat(user: User) {
        // this._rep_User.add(user.id, user);
        // this._rgUserInbox.set(user.id, new UserInbox(user));
    }

    public rmUserChat(user: User) {
        
    }
}

class Controller{
    whatsapp_service: WhatsappService;

    constructor(){
        this.whatsapp_service = new WhatsappService;
    }

    public process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];
        
        if (cmd == "help") {
            return HELP;
        } else if (cmd == "addUser") {
            this.whatsapp_service.addUser(ui[1], new User(ui[1]));

        } else if (cmd == "show") {
            return Poo.vet2str("Usuarios: \n[ ", this.whatsapp_service.allUsers(), " ") + "]\n";
            
        } else if (cmd == "newGrupo") {
            this.whatsapp_service.addGrupo(ui[1], ui[2], new Grupo(ui[2], this.whatsapp_service.getUser(ui[1])));
                        
        } else if (cmd == "newTalk") { 
            /* this.whatsapp_service.addTalk() */
        } else if (cmd == "grupos") {
            return Poo.vet2str("Grupos;\n[", this.whatsapp_service.getUser(ui[1]).showGrupos(), " ") + "]\n";
        
        } else if (cmd == "invite") {
            /* let user = this.whatsapp_service.getUser(ui[1]);
            let invited = this.whatsapp_service.getUser(ui[2]);
            let talk = this.whatsapp_service.rep_talk.get(ui[3]);
            if (!talk) {
                user.getGrupo(ui[3]).addByInvite(user, invited);
            }
            talk.addUserTalk(user); */

            let user = this.whatsapp_service.getUser(ui[1]);
            let invited = this.whatsapp_service.getUser(ui[2]);
            

        } else if (cmd == "grupers") {
            return Poo.vet2str("Usuarios;\n", this.whatsapp_service.getAllMembersGrup(ui[1]).getAllMembers(), " ");

        } else if (cmd == "leave") {
            let user = this.whatsapp_service.getUser(ui[1]);
            user.leave(ui[2]);

        } else if (cmd == "zap") {
            let user = this.whatsapp_service.getUser(ui[1]);
            user.getGrupo(ui[2]).deliverZap(user.id, new Zap(user.id, ui.slice(3).join(" ")));

        } else if (cmd == "notify") {
            let user = this.whatsapp_service.getUser(ui[1]);
            return Poo.vet2str("Grupos\n[ ", user.showGrupos(), " ") + "]\n";
            
        } else if (cmd == "newTalk") { 
            let user = this.whatsapp_service.getUser(ui[1]);
            
        } else if (cmd =="") { 

        } else if (cmd == "ler") {
            let user = this.whatsapp_service.getUser(ui[1]);
            return Poo.vet2str("", user.getGrupo(ui[2]).getMsgs(user.id, user.getGrupo(ui[2]).unreadCount(user.id)), "\n");

        } else {
            return "comando invalido\n";
        }
        return "done\n";
    }

    public main() {
        let c: Controller = new Controller();
        let line: string = "";
        while(line != "fim") {
            line = Poo.cin(">>>");
            if((line == "") || (line.substr(0, 2) == "  ") || (line[0] == "#"))
                continue;
            try {
                Poo.cout(this.process(line));
            } catch(e) {
                Poo.cout("" + e.message);
            }
        }
    }
}
let c: Controller = new Controller();
c.main();