import {cin,cout} from "./readline";
import {Contato} from "./contato1";
import{Telefone} from "./telefone";

class Controller {
    public contato: Contato;
    constructor(name: string = "" , email: string = "") {
        this.contato = new Contato(name ,email);
    }
    public process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];
        if(cmd == "help") {
            return "iniciar _nome\n" +
                   "setNome _oldName _newName\n" +
                   "setMail _mail\n" +
                   "addFone _foneId _number\n" +
                   "rmFone _foneId\n" +
                   "mostrar\n";
        }
        else if(cmd == "iniciar"){
            if(ui[1] == "" || ui[2] == "")
                throw new Error("nome ou email invalido\n");
            this.contato = new Contato(ui[1],ui[2]);
            return "contato adicionado\n"
        }
        else if(cmd == "setNome") {
            if(ui[1] == this.contato.nome) {
                if(ui[2] != "")
                    this.contato.nome = ui[2];
                    return "nome modificado\n";
            }
            return "nome invalido\n";
        }
        else if(cmd == "setMail") {
            this.contato.email = ui[1];
            return "email modificado\n";
        }
        else if(cmd == "addFone") {
            if(this.contato.addFone(new Telefone(ui[1], ui[2])))    
                return "contato add com sucesso.";
        }
        else if(cmd == "rmFone") {
            if(this.contato.rmFone(ui[1]))
                return "contato removido\n";
            return "id nao cadastrado\n";
        }
        else if(cmd == "bug") {
            cout(this.contato);
        }
        else if(cmd == "mostrar") {
            return "" + this.contato;
        } else {
            return "comando nao reconhecido"
        }
        return "done";
    }
    static main() {
        let c: Controller = new Controller();
        let line = "";
        while(line != "fim") {
            line = cin(">>>");
            if(line == "")
                continue;
            try{
                cout(c.process(line));
            }catch(e){
                cout(""+e);
            }
        }
    }
}
Controller.main();
