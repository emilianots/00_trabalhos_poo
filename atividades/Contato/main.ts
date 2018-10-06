import {cin,cout} from "./readline";

class Controller {
    public contato: Contato;
    constructor(name: string = "") {
        this.contato = new Contato(name);
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
            this.contato.push(ui[1]);
            return ""
        }
        else if(cmd == "setNome") {
            if(ui[1] == this.contato.name) {
                this.contato.name = ui[2];
                return ""
            }
            return "";
        }
        else if(cmd == "setMail") {
            this.contato.email = ui[1];
            return "";
        }
        else if(cmd == "addFone") {
            this.contato.addFone(new Telefone(ui[1], ui[2]))
            return "";
        }
        else if(cmd == "rmFone") {
            this.contato.rmFone(ui[1])
            return "";
        }
        else if(cmd == "mostrar") {
            
            return "" + this.contato;
        } else {
            return "comando nao reconhecido"
        }
        //return "done";
    }
    static main() {
        let c: Controller = new Controller();
        let line = "";
        while(line != "fim") {
            line = cin(">>>");
            if(line == "")
                continue;
            cout(c.process(line));
        }
    }
}
Controller.main();