declare function require(name : string);
var input = require('readline-sync');

function cin(text : string = ""): string{
    return input.question(text);
}
function cout(texto: string) {
    return console.log(texto);
}

class Nota {
    titulo : string;
    texto : string;

    constructor(titulo : string, texto : string){
        this.titulo = titulo;
        this.texto = texto;
    }
    toString() : string {
        return ("[ " + this.titulo +"| " +  this.texto + "]");
    }
}

class Usuario{
    private _name : string;
    private _password : string;
    listaNotas : Nota[];
    isOn: boolean = false;

    constructor(nome: string, password : string) {
        this._name = nome;
        this._password = password;
        this.listaNotas = [];
    }

	public get name(): string {
		return this._name;
    }
    
	public set password(value: string) {
		this._password = value;
	}

    addNote(nota : Nota) : boolean {
        if(this.listaNotas.length == 0){
            this.listaNotas.push(nota);
            return true;
        }

        for(let elemento of this.listaNotas){
            if(elemento.titulo != nota.titulo){
                this.listaNotas.push(nota);
                return true;
            }
        }
        return false;
    }

    reNote(title : string): boolean {
        for( let i = 0; i < this.listaNotas.length; i++){
            if(this.listaNotas[i].titulo == title){
                this.listaNotas.splice(Number(i), 1);
                return true;
            }
        }
        return false;
    }
    changePass(oldPass : string, newPass : string): number{
        //verificaçao por retorno de numeros (1 = oldPass n confere, 2 = erro senha inválida, 0 = senha alterada)
        if(this._password != oldPass){
            return 1;
        }
        if(newPass == undefined){
            return 2;
        }
        this.password = newPass;
        return 0;
    }
    public matchPass(value: string): boolean{
        return this._password == value;
    }

    toString() : string{
        return ("Nome : " + this._name + "| " + this.listaNotas);
    }

}

class Sistema{
    listaUsers: Usuario[];

    constructor(){
        this.listaUsers = [];
        this.listaUsers.push(new Usuario("admin", "admin"))
    }
    
    addUser(nUser : Usuario): boolean{
        if(this.listaUsers.length == 0){
            this.listaUsers.push(nUser);
        }
        for(let i = 0; i < this.listaUsers.length; i++){
            if (this.listaUsers[i].name == nUser.name) {
                return false;
            }
        }
        this.listaUsers.push(nUser);
        return true;
    }
    getUser(nome: string, pass: string): Usuario | undefined {
        for(let elemen of this.listaUsers){
            if(elemen.name == nome){
                if(elemen.matchPass(pass))
                    return elemen;
            }
        }
        return undefined;
    }
    getUsrName(): string[] {
        let names: string[] = [];
        for(let elemen of this.listaUsers){
            names.push(elemen.name)
        }
        return names;
    }
}
class Controler{
    private sistema: Sistema;
    private usuario: Usuario | undefined ;
    constructor() {
        this.sistema = new Sistema;
        this.usuario = undefined;
    }
    comandLine(){
        let op: string[] = [""];
        while(op[0] != "fim"){
            op = cin("Digite comando ou help;  ").split(" ");

            if (op[0] == "showUserNames"){
                let saida: string = "Nomes: ";
                let names = this.sistema.getUsrName();
                for(let nome of names){
                    saida += nome + " ";
                }
            }
        }

    }

}