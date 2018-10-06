import { Poo } from "./poo";
import { Repository } from "./reposytory";

let HELP = `
newCli _nomeCompleto;
allCLi;
addAni _donoId _aniNome _especie;
aniCLi _donoId;
allAni;
`

class Animal{
    public idAni: string;
    public nome: string;
    public especie: string;
    public dono: Cliente;

    constructor(idAni: string, nome: string, especie: string, dono: Cliente) {
        this.idAni = idAni;
        this.nome = nome;
        this.especie = especie;
        this.dono = dono;
    }

    toString(): string{
        return "";
    }
}

class Cliente{
    private _idCli: string;
    private _nome: string;
    private _animais: Repository<Animal>;

    constructor(idCli: string, nome: string) {
        this._idCli = idCli;
        this._nome = nome;
        this._animais = new Repository<Animal>("Animal");

    }

	public get idCli(): string {
		return this._idCli;
	}

	public get nome(): string {
		return this._nome;
	}
    

    addAni(ani: Animal) {
        this._animais.add(ani.idAni, ani);        
    }

    toString(): string{
        return "" + this._nome;
    }

}

class ServicoClinica{
    static _nextAniId = 0;
    //private rSer: Repository<Servico>
    private _rCli: Repository<Cliente>;
    private _rAni: Repository<Animal>;
    //private _rVenda: Repository<Venda>;

    constructor() {
        this._rCli = new Repository<Cliente>("Cliente");
        this._rAni = new Repository<Animal>("Animal");
    }

    addCli(idCli: string, nome: string) {
        let cli = new Cliente(idCli, nome);
        this._rCli.add(cli.idCli, cli);
    }
    addAni(idCli: string, nomeAni: string, especie: string) {
        let ani = new Animal(ServicoClinica._nextAniId.toString(), nomeAni, especie, this._rCli.get(idCli));
        let cli = this._rCli.get(idCli);
        cli.addAni(ani);
        this._rAni.add(ani.idAni, ani);
    }

    getAllCli(): Array<Cliente>{
        return this._rCli.getAll();
    }

    getAllAni(): Array<Animal>{
        return this._rAni.getAll();
    }

    getCliente(idCli: string): Cliente{
        return this._rCli.get(idCli);
    }

    getAnimal(idAni: string): Animal{
        return this._rAni.get(idAni);
    }

}


class Controller {
    public cliVet: ServicoClinica;

    constructor() {
        this.cliVet = new ServicoClinica();
    }

    public process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];

        if (cmd == "help") {
            return HELP;

        } else if (cmd == "addCLi") {
            this.cliVet.addCli(ui[1], ui.slice(2).join(" "));

        } else if (cmd == "allCLi") {
            return Poo.vet2str("Clientes;\n", this.cliVet.getAllCli(), "\n") + "\n";

        } else if (cmd == "bug") {
            return  "" + this.cliVet.getAllCli();
        }

        return "done\n";
    }

    public main() {
        let c: Controller = new Controller();
        let line: string = "";
        while (line != "fim") {
            line = Poo.cin(">>>");
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
