//include do readline-sync
/* export declare function require(name:string);
var readline = require('readline-sync');

function cin(text : string = ""): string{
    return readline.question(text);
}

function cout(text : string){
    console.log(text)
} */

//######################################################################//

import {WhatsappService} from "./wppService";
import {Grupo} from "./grupo";
import {User} from "./user";
import {Poo} from "./poo";

class Controller{
    wpp : WhatsappService;

    constructor(){
        this.wpp = new WhatsappService();
    }

    process(line : string): string{
        let eh = line.split(" ");
        let cmd = eh[0];

        if(cmd == "help"){
            return "addUser _username" + "\n" +
                   "allUsers" + "\n" +
                   "newGrupo _userDono _nomeGrupo" + "\n" +
                   "grupos _user" + "\n" +
                   "invite _userDono _amigo _Grupo" + "\n" +
                   "users _Grupo" + "\n" +
                   "sairDoGrupo _user _Grupo" + "\n" +
                   "zap _user _Grupo _mensagem" + "\n" +
                   "notificacoes _user" + "\n" +
                   "ler _user _Grupo" + "\n" +
                   "fim";
        }
        try {
            if(cmd == "addUser"){
                this.wpp.addUser(eh[1]);
            }
    
            else if(cmd == "allUsers"){
                return Poo.vet2str("Usuarios: \n[ ", this.wpp.allUsers(), " ") + "]\n";
            }

            else if(cmd == "newGrupo"){
                //this.wpp.addGrupo(eh[1], eh[2]);
                /* let user = this.wpp.getUser(eh[1]);
                let grupo = new Grupo(eh[2]);
                user.addGrupo(grupo); */
                this.wpp.addGrupo(eh[1], eh[2]);
            }
    
            else if(cmd == "invite"){
                this.wpp.addByInvite(eh[1], eh[2], eh[3]);
            }
    
            else if(cmd == "grupos"){
                return this.wpp.getUser(eh[1]).showGrupos() + "]\n";
            }
            else if (cmd == "users") {
                return this.wpp.getGrupoWpp(eh[1]).getUsers()+ "\n";
            }   
            /*
            else if(cmd == "addNota"){
                return "" + (this.anotacao.getLogado().addNote(eh[1], eh.slice(2, eh.length).join(' ')));
            }
    
            else if(cmd == "rmNota"){
                return "" + this.anotacao.getLogado().rmNote(eh[1]);
            }
    
            else if(cmd == "showNotas"){
                return "" + this.anotacao.getLogado().showNotas();
            }
            */
            else if(cmd == "fim"){
                return ""
            }
            return "done";
        } catch(e) {
            console.log(e.message);
            return "error";
        }
        
    }

    main(){
        let c : Controller = new Controller();
        let line = ""
        while(line != "fim"){
            line = Poo.cin("Digite comando ou help: ");
            if(line == "" || line == "fim")
                continue;
            Poo.cout(c.process(line));
        }
    }
}
let c: Controller = new Controller();

c.main();
