declare function require(name: string): any;
var readline = require('readline-sync');

function cin(texto: string): string{
    return readline.question(texto);
}

function cout(value: any) {
    return console.log(value);
}

class Nota{
    private _titulo: string;
    private _texto: string;
    constructor(titulo: string = "", texto: string = "") {
        this._titulo = titulo;
        this._texto = texto;
    }

	public get titulo(): string {
		return this._titulo;
	}

	public get texto(): string {
		return this._texto;
	}
    
    toString(): string {
        let st: string = "" + this._titulo + "| " + this._texto;
        return st;
    }
}
class Usuario{
    private _uName: string;
    private _password: string;
   // private _isAdm: boolean;
    private _notas: Array<Nota>;
    constructor(name: string = "", pass: string = "") {
        this._uName = name;
        this._password = pass;
        this._notas = [];
        //this._isAdm = false;
    }

	public get notas(): Array<Nota> {
		return this._notas;
	}
    

    public get uName(): string {
		return this._uName;
	}

	public set uName(value: string) {
		this._uName = value;
    }

	public set password(value: string) {
		this._password = value;
    }  

	/* public get isAdm(): boolean {
		return this._isAdm;
	}

	public set isAdm(value: boolean) {
		this._isAdm = value;
	} */
    

    addNote(nota: Nota): boolean {
        for(let note of this._notas){
            if(note.titulo == nota.titulo)
                return false
        }
        this._notas.push(nota);
        return true;
    }
    rmNota(titulo: string): boolean {
        for(let i = 0; i < this._notas.length; i++){
            if(this._notas[i].titulo == titulo){
                this._notas.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    matchPass(pass: string): boolean{
        return pass == this._password;
    }

    chagePass(oldPass: string, newPass: string): boolean {
        if(this.matchPass(oldPass)){
            this.password = newPass;
            return true;
        }
        return false;
    }
    toString(): string {
        let st: string = "Nome:" + this._uName;
        return st;
    }
    getNotes(): string[]{
        let notes: string[] = [];
        for(let nota of this._notas){
            notes.push(nota.toString());
        }
        return notes;
    }
}
class Sistema{
    private _usuarios: Array<Usuario>;
    private _user: Usuario | undefined;
    constructor() {
        this._usuarios = [];
        this._user = undefined;
        this._usuarios.push(new Usuario("admin", "admin"))
    }

	public get user(): Usuario | undefined {
		return this._user;
    }

	public set user(value: Usuario | undefined ) {
		this._user = value;
	}
    
    
    addUser(user: Usuario): boolean {
        for( let elem of this._usuarios){
            if(elem.uName == user.uName)
                return false;
        }
        this._usuarios.push(user);
        return true;
    }
    getUser(nome: string, pass: string): Usuario | undefined{
        for(let elem of this._usuarios){
            if(elem.uName == nome)
                if(elem.matchPass(pass))
                    return elem;
        }
        return undefined;
    }
    getUesrNames(): string[]{
        let users: string[] = [];
        for(let elem of this._usuarios){
            users.push(elem.uName + ",");
        }
        return users;
    }
    getUserNotes():string[]{
        let notes: string[] = [];
        for(let usuarios of this._usuarios){
            if(usuarios.notas.length == 0 ){
                notes.push("Sem anotações!");
                return notes;
            }else{
                notes.push("" + usuarios.uName + " ");
                for(let notas of usuarios.notas)
                notes.push(notas.toString() + "\n")
            }
        }
        return notes;
    }
}
class Controler{
    private _sistema: Sistema;
    //private _user: Usuario | undefined;

    constructor() {
        this._sistema = new Sistema();
        //this._user = undefined;
    }
    commnadLine(){
        let ui = [""];
        while(ui[0] != "fim"){
            ui = cin("Digite comando ou help: \n").split(" ");
            
            if(ui[0] == "help"){
                cout("---COMANDOS DESLOGADOS---")
                cout("initSis")
                cout("login $nome $senha");
                cout("addUser $nome $senha")
                cout("show")
                cout("\n---COMANDOS LOGADOS---")
                cout("show");
                cout("showUserNames");
                cout("logout");
                cout("chagePass $oldPass $newPass");
                cout("addNote $titulo $texto");
                cout("showNotes");
                cout("rmNote")
            }
            if(ui[0] == "initSis"){
                this._sistema = new Sistema;
            }
            if(ui[0] == "login"){
                this._sistema.user = this._sistema.getUser(ui[1], ui[2]);
                if(this._sistema.user)
                    cout("login efetuado!");
                else
                    cout("Erro no login!");
            } 
            if(ui[0] == "addUser"){
                if(this._sistema.addUser(new Usuario(ui[1], ui[2])))
                    cout("Usuario cadastrado!")
                else
                    cout("Erro ao adicionar!");
            }
            if(ui[0] == "show"){
                if(!this._sistema.user){
                    cout("Niguem logado!");
                }else {
                    cout("" + this._sistema.user)
                    cout(this._sistema.getUserNotes())
                }
            } 
            if(ui[0] == "showUserNames"){
                if(this._sistema.user){
                    let saida = "Usuarios: ";
                    let names = this._sistema.getUesrNames();
                    for(let nome of names){
                        saida += nome += " ";
                    }
                    cout(saida);
                } else {
                    cout("niguem logado!");
                }
            }
            if(ui[0] == "showNotes"){
                if(this._sistema.user){
                    cout(this._sistema.getUserNotes())
                }else {
                    cout("Ninguem logado!")
                }
            }
            if(ui[0] == "logout"){
                this._sistema.user = undefined;
                if(!this._sistema.user)
                    cout("Logout efetuado!");
                else
                    cout("Erro no sistema!")
            }
            if(ui[0] == "changePass"){
                if(this._sistema.user){
                    this._sistema.user.chagePass(ui[1], ui[2]);
                    cout("Senha alterada!")
                }else{
                    cout("Erro ao alterar senha!")
                }
            }
            if(ui[0] == "addNote"){
                if(!this._sistema.user){
                    cout("Niguem logado!")
                }else{
                    if(this._sistema.user.addNote(new Nota(ui[1], ui.slice(2).join(" ")))){
                        cout("Nota adicionada!");
                    }else{
                        cout("Erro ao adicionar nota")
                    }
                }
            }
            if(ui[0] == "rmNote"){
                if(this._sistema.user){
                    if(this._sistema.user.rmNota(ui[1]))
                        cout("Nota removida!");
                    else 
                        cout("Erro na opercao!");
                }
            }
        }
    }
}

let cont: Controler = new Controler;
cont.commnadLine();