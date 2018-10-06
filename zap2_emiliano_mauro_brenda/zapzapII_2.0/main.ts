

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

class Notify {
    public chatId: string;
    public qtd: number;
    constructor(chatId = "", qtd = 0) {
        this.chatId = chatId;
        this.qtd = qtd;
    }

    toString(): string {
        let saida = this.chatId;
        if (this.qtd > 0)
            saida += "(" + this.qtd + ")";
        return saida;
    }
}

class User {
    private _id: string;
    private _rGrupos: Repository<Grupo>;
    private _rTalk: Repository<Talk>;

    constructor(id: string) {
        this._id = id;
        this._rGrupos = new Repository<Grupo>("Grupo");
        this._rTalk = new Repository<Talk>("Talk");
    }

    public get id(): string {
        return this._id;
    }

    public get rGrupos(): Repository<Grupo> {
        return this._rGrupos;
    }

	public get rTalk(): Repository<Talk> {
		return this._rTalk;
	}
    

    sendMsg(grupoId: string, msg: string) {
        if (this._rTalk.has(grupoId) == true) {
            let talk = this._rTalk.get(grupoId);
            talk.deliverZap(this._id, msg);

        } else if (this._rGrupos.has(grupoId) == true) {
            let grupo = this._rGrupos.get(grupoId);
            grupo.deliverZap(this._id, msg);
        }
    }

    getNotify(): Array<Notify> {
        let lista = [];
        for (let grupo of this._rGrupos.getAll())
            lista.push(grupo.getNotify(this._id));
        
        for (let talk of this._rTalk.getAll())
            lista.push(talk.getNotify(this._id));
        
        return lista;
    }

    getGrupo(id: string): Grupo {
        return this._rGrupos.get(id);
    }

    getTalk(id: string): Talk{
        return this._rTalk.get(id);
    }

    getGrupos(): Array<string> {
        let lista = [];

        for (let grupo of this._rGrupos.getAll()) {
            lista.push(grupo.toString());
        }
        
        for (let talk of this._rTalk.getAll()) {
            lista.push(talk.toString());
        }
                
        return lista;
    }

    toString(): string {
        return this._id;
    }
}

class Grupo {
    private _grupoId: string;
    protected _mUserInbox: Map<string, UserInbox>;

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

    getMembers(): Array<string> {
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

    getNotify(id: string): Notify {
        let inbox = this._mUserInbox.get(id);
        if (!inbox)
            throw new Error("Usuario " + id + " nao estah no grupo\n");
        return new Notify(this.grupoId, inbox._inbox.length);
    }

    getMsgs(id: string): Array<Zap> {
        let inbox = this._mUserInbox.get(id);
        if (!inbox)
            throw new Error("Usuario " + id + " nao estah no grupo\n");
        let aux = inbox.getZaps();
        inbox._inbox = new Array<Zap>();
        return aux;
    }

    toString(): string {
        return "" + this._grupoId;
    }
}

class Talk extends Grupo {
    private _talkId: string;

    constructor(user1: User, user2: User) {
        super();
        this._talkId = this.setPair(user1, user2);
        this._mUserInbox.set(user1.id, new UserInbox(user1));
        this._mUserInbox.set(user2.id, new UserInbox(user2));
    }

	public get talkId(): string {
		return this._talkId;
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
    public newUsers(user1: User, user2: User) {
        this._mUserInbox.set(user1.id, new UserInbox(user1));
        this._mUserInbox.set(user2.id, new UserInbox(user2));
    }

    public addUserTalk() {
        throw new Error("fail: operação de adicionar usuários não suportada\n")
    }

    public rmUserTalk() {
        throw new Error("fail: operação de remover usuários não suportada\n")
    }
    getNotify(id: string): Notify {
        let inbox = this._mUserInbox.get(id);
        if (!inbox)
            throw new Error("Usuario " + id + " nao estah no grupo\n");
        return new Notify(this._talkId, inbox._inbox.length);
    }

    public toString(): string{
        return "" + this._talkId;
    }
}


class WhatsappService {
    private _rUsers: Repository<User>;
    private _rGrupos: Repository<Grupo>;
    private _rTalk: Repository<Talk>;

    constructor() {
        this._rUsers = new Repository<User>("User");
        this._rGrupos = new Repository<Grupo>("Chat");
        this._rTalk = new Repository<Talk>("talk");
    }

    newUser(userId: string) {
        this._rUsers.add(userId, new User(userId));
    }

    getUser(userId: string): User {
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
        if (this._rTalk.has(grupoId) == true) {
            let talk = this._rTalk.get(grupoId);
            talk.addUserTalk();
            
        } else {
            let grupoDef = user.rGrupos.get(grupoId);
            grupoDef.newUser(user2);
        }
    }

    getMsgs(userId: string, grupoId: string): Array<string> {
        let lista = [];
        let user = this._rUsers.get(userId);

        if (this._rTalk.has(grupoId) == true) {
            let talk = this._rTalk.get(grupoId);
            for (let msg of talk.getMsgs(user.id)) {
                lista.unshift("" + msg);
            }

        } else if (this._rGrupos.has(grupoId)) {
            let grupo = this._rGrupos.get(grupoId);
            for (let msg of grupo.getMsgs(user.id)) {
                lista.unshift("" + msg);
            }
        }
        return lista;
    }
    newTalk(user1: string, user2: string, ) {
        let usr1 = this._rUsers.get(user1);
        let usr2 = this._rUsers.get(user2);
        let talk = new Talk(usr1, usr2);
        this._rTalk.add(talk.talkId, talk);
        usr1.rGrupos.add(talk.talkId, talk);
        usr2.rTalk.add(talk.talkId, talk);
    }

    rmUser(userId: string, grupoId: string) {
        let user = this._rUsers.get(userId);
        if (this._rTalk.has(grupoId)) {
            let talk = this._rTalk.get(grupoId);
            talk.rmUserTalk();

        } else if (this._rTalk.has(grupoId)) {
            let grupo = this._rGrupos.get(grupoId);
            grupo.rmUser(user);
        }
    }

    usersGrupo(grupoId: string): Array<string> {
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

    getAllUsers(): Array<User> {
        return this._rUsers.getAll();

    }
    getTalk(id: string) {
        return this._rTalk.get(id);
    }

    getAllGrupos(): Array<Grupo> {
        return this._rGrupos.getAll();
    }
}

class Controller {
    wpp: WhatsappService;

    constructor() {
        this.wpp = new WhatsappService;
    }

    public process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];

        if (cmd == "help") {
            return "addUser _username" + "\n" +
                "allUsers" + "\n" +
                "newGrupo _userDono _nomeGrupo" + "\n" +
                "grupos _user" + "\n" +
                "invite _userDono _amigo _grupo" + "\n" +
                "users _grupo" + "\n" +
                "sairDoGrupo _user _Grupo" + "\n" +
                "zap _user _grupo _mensagem" + "\n" +
                "talk _user1 _user2" + "\n" +
                "notificacoes _user" + "\n" +
                "ler _user _grupo" + "\n" +
                "fim";

        } else if (cmd == "addUser") {
            this.wpp.newUser(ui[1]);

        } else if (cmd == "allUsers") {
            return Poo.vet2str("Usuarios:\n[ ", this.wpp.getAllUsers(), " ") + "]\n";

        } else if (cmd == "newGrupo") {
            this.wpp.newGrupo(ui[1], ui[2]);

        } else if (cmd == "grupos") {
            return Poo.vet2str("Grupos| " + ui[1] + ":\n[ ", this.wpp.getUser(ui[1]).getGrupos(), " ") + "]\n";

        } else if (cmd == "invite") {
            this.wpp.addByIvite(ui[1], ui[2], ui[3]);

        } else if (cmd == "users") {
            return Poo.vet2str("Usuarios| " + ui[1] + ":\n[ ", this.wpp.usersGrupo(ui[1]), " ") + "]\n";

        } else if (cmd == "leave") {
            this.wpp.rmUser(ui[1], ui[2]);

        } else if (cmd == "zap") {
            this.wpp.sendZap(ui[1], ui[2], ui.slice(3).join(" "));

        } else if (cmd == "notify") {
            return Poo.vet2str("Notificacoes| " + ui[1] + ":\n[ ", this.wpp.getNotify(ui[1]), " ") + "]\n";

        } else if (cmd == "talk") {
            this.wpp.newTalk(ui[1], ui[2]);

        }else if (cmd == "ler") {
            return Poo.vet2str(ui[2] + ":\n", this.wpp.getMsgs(ui[1], ui[2]), "\n") + "\n";

        } else if (cmd == "t") {
            return "" + this.wpp.getTalk(ui[1]);
        }else {
            return "comando invalido\n";
        }

        return "done\n";
    }

    public main() {
        let c: Controller = new Controller();
        let line: string = "";
        while (line != "fim") {
            line = Poo.cin("Digite comanto ou help: ");
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
