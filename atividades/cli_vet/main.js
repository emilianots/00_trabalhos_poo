"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const poo_1 = require("./poo");
const reposytory_1 = require("./reposytory");
let HELP = `
newCli _nomeCompleto;
allCLi;
addAni _donoId _aniNome _especie;
aniCLi _donoId;
allAni;
`;
class Animal {
    constructor(idAni, nome, especie, dono) {
        this.idAni = idAni;
        this.nome = nome;
        this.especie = especie;
        this.dono = dono;
    }
    toString() {
        return "";
    }
}
class Cliente {
    constructor(idCli, nome) {
        this._idCli = idCli;
        this._nome = nome;
        this._animais = new reposytory_1.Repository("Animal");
    }
    get idCli() {
        return this._idCli;
    }
    get nome() {
        return this._nome;
    }
    addAni(ani) {
        this._animais.add(ani.idAni, ani);
    }
    toString() {
        return "" + this._nome;
    }
}
class ServicoClinica {
    //private _rVenda: Repository<Venda>;
    constructor() {
        this._rCli = new reposytory_1.Repository("Cliente");
        this._rAni = new reposytory_1.Repository("Animal");
    }
    addCli(idCli, nome) {
        let cli = new Cliente(idCli, nome);
        this._rCli.add(cli.idCli, cli);
    }
    addAni(idCli, nomeAni, especie) {
        let ani = new Animal(ServicoClinica._nextAniId.toString(), nomeAni, especie, this._rCli.get(idCli));
        let cli = this._rCli.get(idCli);
        cli.addAni(ani);
        this._rAni.add(ani.idAni, ani);
    }
    getAllCli() {
        return this._rCli.getAll();
    }
    getAllAni() {
        return this._rAni.getAll();
    }
    getCliente(idCli) {
        return this._rCli.get(idCli);
    }
    getAnimal(idAni) {
        return this._rAni.get(idAni);
    }
}
ServicoClinica._nextAniId = 0;
class Controller {
    constructor() {
        this.cliVet = new ServicoClinica();
    }
    process(line) {
        let ui = line.split(" ");
        let cmd = ui[0];
        if (cmd == "help") {
            return HELP;
        }
        else if (cmd == "addCLi") {
            this.cliVet.addCli(ui[1], ui.slice(2).join(" "));
        }
        else if (cmd == "allCLi") {
            return poo_1.Poo.vet2str("Clientes;\n", this.cliVet.getAllCli(), "\n") + "\n";
        }
        else if (cmd == "bug") {
            return "" + this.cliVet.getAllCli();
        }
        return "done\n";
    }
    main() {
        let c = new Controller();
        let line = "";
        while (line != "fim") {
            line = poo_1.Poo.cin(">>>");
            if ((line == "") || (line.substr(0, 2) == "  ") || (line[0] == "#"))
                continue;
            try {
                poo_1.Poo.cout(this.process(line));
            }
            catch (e) {
                poo_1.Poo.cout("" + e);
            }
        }
    }
}
let c = new Controller();
c.main();
