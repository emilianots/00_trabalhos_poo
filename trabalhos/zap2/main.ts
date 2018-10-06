import { Poo } from "./poo";
import { Repository } from "./repositorio";


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


class UserInbox {
    public _id: string;
    public _inbox: Array<Zap>;
    public _unreadCount: number;

    constructor(user: User) {
        this._id = user.id;
        this._inbox = new Array<Zap>();
        this._unreadCount = 0;
    }

    public addZap(zap: Zap) {
        this._inbox.unshift(zap);
    }

    public getZaps(): Array<Zap> {
        return this._inbox;
    }
}


class Notify{
    public chatId: string;
    public qtd: number;
    constructor(chatId = "", qtd = 0) {
        this.chatId = chatId;
        this.qtd = qtd;
    }

    toString(): string{
        let saida = this.chatId;
        if (this.qtd > 0)
            saida += "(" + this.qtd + ")";
        return saida;
    }
}


class User {
    private _id: string;
    private _rGrupos: Repository<Grupo>;

    constructor(id: string) {
        this._id = id;
        this._rGrupos = new Repository<Grupo>("Grupo");
    }

    public get id(): string {
        return this._id;
    }

    public get rGrupos(): Repository<Grupo> {
        return this._rGrupos;
    }
    
    sendMsg(grupoId: string, msg: string) {
        let grupo = this._rGrupos.get(grupoId);
        grupo.deliverZap(this._id, msg);
    }

    getNotify(): Array<Notify> {
        let lista = [];
        for (let elem of this._rGrupos.getAll())
            lista.push(elem.getNotify(this._id));
        return lista;
    }

    getGrupo(id: string): Grupo {
        return this._rGrupos.get(id);
    }

    getGrupos(): Array<string> {
        let lista = [];
        for (let elem of this._rGrupos.getAll())
            lista.push(elem.grupoId);
        return lista;
    }

    toString(): string {
        return this._id;
    }
}


class Grupo{
    private _grupoId: string;
    private _mUserInbox: Map<string, UserInbox>;

    constructor(chatId = "") {
        this._grupoId = chatId;
        this._mUserInbox = new Map<string, UserInbox>();
    }

	public get grupoId(): string {
		return this._grupoId;
    }

    newUser(user: User) {
        if (this._mUserInbox.has(user.id) == true) {
            throw new Error("Usuario " + user + " já estah no grupo\n");
        }
        user.rGrupos.add(this.grupoId, this);
        this._mUserInbox.set(user.id, new UserInbox(user));
    }

    rmUser(user: User) {
        if (!this._mUserInbox.has(user.id)) 
            throw new Error(user.id + " não estah no grupo " + this._grupoId + "\n");
        
        this._mUserInbox.delete(user.id);
        user.rGrupos.rm(this._grupoId);
        
    }

    getMembers(): Array<string>{
        let lista = [];
        for (let elem of this._mUserInbox.keys())
            lista.push(elem);
        return lista;
    }

    deliverZap(userId: string, msg: string) {
        let zap = new Zap(userId, msg);
        for (let elem of this._mUserInbox.values()) {
            elem.addZap(zap);
        }
    }
    
    getNotify(id: string): Notify{
        let inbox = this._mUserInbox.get(id);
        if (!inbox)
            throw new Error("Usuario " + id + " nao estah no grupo\n");
        return new Notify(this.grupoId, inbox._inbox.length);
    }

    getMsgs(id: string): Array<Zap>{
        let inbox = this._mUserInbox.get(id);
        if (!inbox) 
            throw new Error("Usuario " + id + " nao estah no grupo\n");
        let aux = inbox.getZaps();
        inbox._inbox = new Array<Zap>();
        return aux;
    }

    toString(): string{
        return "" + this._grupoId;
    }
}


class Talk extends Grupo{
    private _talkId: string;

    constructor(user1: User, user2: User) {
        super();
        this._talkId = this.setPair(user1, user2);

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
        return (final);
    }

    public addUserTalk() {
        throw new Error("fail: operação de adicionar usuários não suportada\n")
    }

    public rmUserTalk() {
        throw new Error("fail: operação de remover usuários não suportada\n")
    }

    public toString(): string {
        return "" + this._talkId
    }
}


class Chat extends Grupo{
    private _chatId: string;
    constructor() {
        super();
    }
}


class WhatsappService{
    private _rUsers: Repository<User>;
    private _rGrupos: Repository<Grupo>;

    constructor() {
        this._rUsers = new Repository<User>("User");
        this._rGrupos = new Repository<Grupo>("Chat");
    }

    newUser(userId: string) {
        this._rUsers.add(userId, new User(userId));
    }

    getUser(userId: string): User{
        return this._rUsers.get(userId);
    }

    newGrupo(userId: string, grupoId: string) {
        let user = this._rUsers.get(userId);
        let grupo = new Grupo(grupoId);
        this._rGrupos.add(grupo.grupoId, grupo);
        grupo.newUser(user);
    }

    addByIvite(userId: string, invited: string, grupoId: string) {
        let user = this._rUsers.get(userId);
        let user2 = this._rUsers.get(invited);
        let grupo = user.rGrupos.get(grupoId);
        grupo.newUser(user2);
    }

    getMsgs(userId: string, grupoId: string): Array<string> {
        let grupo = this._rGrupos.get(grupoId);
        let user = this._rUsers.get(userId);
        let lista = [];
        for (let elem of grupo.getMsgs(userId)) {
            lista.unshift("" + elem);
        }
        return lista;
    }

    rmUser(userId: string, grupoId: string) {
        let grupo = this._rGrupos.get(grupoId);
        let user = this._rUsers.get(userId);
        grupo.rmUser(user);
    }

    usersGrupo(grupoId: string): Array<string>{
        return this._rGrupos.get(grupoId).getMembers();
    }

    sendZap(userId: string, grupoId: string, msg: string) {
        let user = this._rUsers.get(userId);
        user.sendMsg(grupoId, msg);
    }

    getNotify(userId: string): Array<Notify> {
        let user = this._rUsers.get(userId);
        return user.getNotify();
    }
    
    getAllUsers(): Array<User>{
        return this._rUsers.getAll();
    }

    getAllGrupos(): Array<Grupo>{
        return this._rGrupos.getAll();
    }
}

class Controller {
    wpp: WhatsappService;

    constructor() {
        this.wpp = new WhatsappService;
    }

    public process(line: string): string {
        let eh = line.split(" ");
        let cmd = eh[0];

        if (cmd == "help") {
            return "addUser _userId" + "\n" +
                "allUsers" + "\n" +
                "newGrupo _user _grupoId" + "\n" +
                "grupos _user" + "\n" +
                "invite _user _invited _grupoId" + "\n" +
                "users _grupoId" + "\n" +
                "leave _user _grupoId" + "\n" +
                "zap _userId _grupoId _mensagem" + "\n" +
                "notificacoes _userId" + "\n" +
                "talk _user1 _user2" + "\n" +
                "ler _userId _grupoId" + "\n" +
                "fim";
            
        } else if (cmd == "addUser") {
            this.wpp.newUser(eh[1]);

        } else if (cmd == "allUsers") {
            return Poo.vet2str("Usuarios:\n[ ", this.wpp.getAllUsers(), " ") + "]\n";

        } else if (cmd == "newGrupo") {
            this.wpp.newGrupo(eh[1], eh[2]);

        } else if (cmd == "grupos") {
            return  Poo.vet2str("Grupos| " + eh[1] + ":\n[ ", this.wpp.getUser(eh[1]).getGrupos(), " ") + "]\n";

        } else if (cmd == "invite") {
            this.wpp.addByIvite(eh[1], eh[2], eh[3]);

        } else if (cmd == "users") {
            return Poo.vet2str("Usuarios| " + eh[1] + ":\n[ ", this.wpp.usersGrupo(eh[1]), " ") + "]\n";

        } else if (cmd == "leave") {
            this.wpp.rmUser(eh[1], eh[2]);

        } else if (cmd == "zap") {
            this.wpp.sendZap(eh[1], eh[2], eh.slice(3).join(" "));

        } else if (cmd == "notify") {
            return Poo.vet2str("Notificacoes| " + eh[1] + ":\n[ ", this.wpp.getNotify(eh[1]), " ") + "]\n";
            
        } else if (cmd == "ler") {
            return Poo.vet2str(eh[2] + ":\n", this.wpp.getMsgs(eh[1], eh[2]), "\n") + "\n";

        } else {
            return "comando invalido\n";
        }
    
        return "done\n";
    }

    public main() {
        let c: Controller = new Controller();
        let line: string = "";
        while (line != "fim") {
            line = Poo.cin(">>> ");
            if ((line == "") || (line.substr(0, 2) == "  ") || (line[0] == "#"))
                continue;
            try {
                Poo.cout(this.process(line));
            } catch (e) {
                Poo.cout("" + e);
            }
        }
    }
}


let c: Controller = new Controller();
c.main();
