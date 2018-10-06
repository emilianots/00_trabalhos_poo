import {cin,cout} from "./readline";

class Twitter{
    private _idTw: number;
    private _userName: string;
    private _msg: string;
    private _likes: Array<User>;
    constructor(id: number = 0, userName: string = "", msg: string = "") {
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
	public set msg(value: string) {
		this._msg = value;
    }
    public addLike(user: User){
        this._likes.push(user);
    }
    public toString(): string {
        let saida = "" + this._idTw + "| " + this._userName + ": " + this._msg + " { ";
        for(let user of this._likes) {
            saida += user.userName;
            saida += " ";
        }
        saida += "}"
        return saida;
    }
}
class User{
    private _userName: string;
    private _seguidores: Map<string,User>;
    private _seguindo: Map<string,User>;
    private _myMsg: Array<Twitter>;
    private _timeline: Array<Twitter>;
    private _unreadCount: number;
    static _nextId: number = 0;

    constructor(userName: string = "") {
        this._userName = userName;
        this._seguidores = new Map<string,User>();
        this._seguindo = new Map<string, User>();
        this._myMsg = [];
        this._timeline = [];
        this._unreadCount = 0;
    }
	public get userName(): string {
		return this._userName;
	}
	public get seguidores(): Map<string, User> {
		return this._seguidores;
    }
	public get seguindo(): Map<string, User> {
		return this._seguindo;
	}
	public get timeline(): Array<Twitter>{
		return this._timeline;
	}
	public get myMsg(): Array<Twitter>{
		return this._myMsg;
    }
	public get unreadCount(): number {
		return this._unreadCount;
	}
	public set unreadCount(value: number) {
		this._unreadCount = value;
    }
    public getTwit(id: number): Twitter | undefined {
        for(let twit of this._myMsg) {
            if(twit.idTw == id)
                return twit;        
        }
        return undefined;
    }
    public seguir(seguido: User): boolean {
        if(!this._seguindo.has(seguido._userName)) {
            this._seguindo.set(seguido._userName, seguido);
            seguido._seguidores.set(this._userName, this);
            return true;
        }
        return false;
    }
    public twitar(id: number ,msg: string): boolean {
        let twit: Twitter = new Twitter(id, this._userName, msg);
        this._myMsg.unshift(twit);
        for(let usuario of this._seguidores.values()) {
            usuario._timeline.unshift(twit);
            usuario._unreadCount++;
        }
        return true;
    }
    public like(idTwit: number, user: string): boolean {
        let liker = this._seguindo.get(user);
        if(liker){
            let twite = liker.getTwit(idTwit)
            if(twite) {
                twite.addLike(liker);
                return true;
            }
        }
        return false;
    }
    public getSeguidores(): string {
        let saida: string = "[ ";
        for(let elem of this._seguidores.keys()){
            saida += elem + " ";
        }
        saida += " ]";
        if(saida.length <= 4)
            saida = "[ -- vazio -- ]"
        return saida;
    }
    public getSeguindo(): string {
        let saida: string = "[ ";
        for(let elem of this._seguindo.keys()){       
            saida += elem + " ";
        }
        saida += " ]";
        if(saida.length <= 4)
            saida = "[ -- vazio -- ]"
        return saida
    }
    public getTimeline(): string {
        let st: string = "---Timeline " + this.userName + "---\n";
        for(let twit of this._timeline) {
            st += twit.toString() + "\n";
        }
        this.unreadCount = 0;
        return st;
    }
    public getUnread(): string {
        let saida = "---unread " + this.userName + "---\n";
        for(let i = 0; i < this.unreadCount; i++) {
            saida += this._timeline[i].toString() + "\n";
        }
        this.unreadCount = 0;
        return saida;
    }
    public toString(): string {
        let st: string = "Nome: " + this._userName + "\n";
        for(let valor of this._myMsg) {
            st += valor.toString() + "\n";
        }
        return st;
    }
}
class Manager{
    private _usuarios: Map<string,User>;
    
    constructor(){
        this._usuarios = new Map<string, User>();
        
    }   
    public add(usuario: User): boolean {
        if(!this._usuarios.has(usuario.userName)) {
            this._usuarios.set(usuario.userName, usuario);
            return true;
        }
        return false;
    }
    public get(useName: string): User | undefined {
        return this._usuarios.get(useName);
    }
    public getUsers(): Array<User> {
        let lista: Array<User> = [];
        for(let elem of this._usuarios.values()) {
            lista.push(elem);
        }
        return lista;
    }
}
class Controller{
    manager: Manager;
    constructor() {
        this.manager = new Manager;
    }
    public process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];
        if(cmd == "help") {
            return "addUser" + "\n" +
                   "show" + "\n" + 
                   "seguir _seguidor _seguido" + "\n" + 
                   "seguindo _nome" + "\n" +
                   "seguidores _nome" + "\n" + 
                   "twitar _nome _msg" + "\n" +
                   "unread _nome" + "\n" +
                   "myMsg _nome" + "\n" +
                   "like _nome _idTwit\n"
        }
        else if(cmd == "show") {
            let listaUser = this.manager.getUsers();
            let saida: string = "[ ";
            for(let nome of listaUser){
                 saida += nome.userName + " ";
            }
            saida +="]\n";
            return saida;
        }
        else if(cmd =="addUser") {
            let nUser: User = new User(ui[1]);
            if(nUser) {
                if(this.manager.add(nUser)) 
                    return "usuario adicionado\n";
                else
                     return "|erro ao adicionar usuario|\n";
            } else {
                return "|erro ao adicionar usuario|\n";
            }
        }
        else if(cmd == "seguir") {
            let seguidor = this.manager.get(ui[1]);
            let seguido = this.manager.get(ui[2])
            if(seguidor && seguido) {
                if(seguidor.seguir(seguido)) 
                    return "sucesso\n";
                else
                    return "|erro|\n";
            } else {
               return "|erro|\n";
            }
        }
        else if(cmd == "seguindo") {
            let user = this.manager.get(ui[1]);
            if(user) 
                return user.getSeguindo();
            else
                return "|erro|\n";
        }
        else if(cmd == "seguidores") {
            let user = this.manager.get(ui[1]);
            if(user)
                return user.getSeguidores();
            else
                return "|erro|\n";
        }
        else if(cmd == "twitar") {
            let usuario = this.manager.get(ui[1]);
             if(usuario) {
                if(usuario.twitar(User._nextId ,ui.slice(2).join(" "))){
                    User._nextId ++;
                    return "twitou com sucesso\n";
                } else {
                    return "|erro no twit|\n";
                }
            } else {
                return "|usuario nao encontrado|\n";
            }
        }
        else if(cmd == "timeline"){
            let user = this.manager.get(ui[1]);
            if(user)
                return user.getTimeline();
            else
                return "|usuario nao encontrado|\n";
        }
        else if(cmd == "unread"){
            let user = this.manager.get(ui[1]);
            if(user) {
                return user.getUnread();
            } else {
                return "|erro\n|";
            }
        }
        else if(cmd == "myMsg") {
            let user = this.manager.get(ui[1]);
            if(user)
                return user.toString();
            else
                return "|erro|\n";
        }
        else if(cmd == "like") {
            let user = this.manager.get(ui[1]);
            if(user) {
                let usuarios = this.manager.getUsers();
                for(let elem of usuarios){
                    let twitte = elem.getTwit(Number(ui[2]))
                    if(twitte){
                        twitte.addLike(user);
                        return "Likou\n"
                    }
                }
            }
            return "|erro|\n"
        }
        else if(cmd == "bug") {
            let user = this.manager.get(ui[1]);
            if(user)
                cout(user);
        } else {
            return "|comando invalido|";
        }
        return "done";
        
    }
    static main() {
        let c: Controller = new Controller();
        let line = "";
        while(line != "fim") {
            line = cin(">>> ");
            if(line == "")
                continue;
            cout(c.process(line));
       }
   }
}

Controller.main();

