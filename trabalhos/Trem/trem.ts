declare function require(name : string);
var input = require('readline-sync');

function cin(text : string = ""): string{
    return input.question(text);
}//empacota o input


class Passageiro{
    private idPassageiro : number; 
    private nomePassageiro : string;

    constructor (idPassageiro : number, nomePassageiro : string){
        this.idPassageiro = idPassageiro;
        this.nomePassageiro = nomePassageiro;
    }
    get getId() : number{
        return this.idPassageiro;
    }
//o set é pra mudar o valor da variável
    set setId(idPassageiro : number){
        this.idPassageiro = idPassageiro;
    }
    get getNome() : string{
        return this.nomePassageiro;
    }
    set setNome(nomePassageiro : string){
        this.nomePassageiro = nomePassageiro;
    }

    toString() : string {
        return "Id: " + this.getId + "| Nome: " + this.getNome + ":\n";
    } // o metodo show funciona como o metodo toString
}


class Vagao{
    private idVagao : number;
    private qtdMaxPassageiros : number;
    private qtdPassageirosSentados : number;
    private listaPassageiros : Passageiro[];

    constructor(idVagao : number, qtdMax : number){
        //construtor com somente 2 parametros e nao 3 como antes
        this.idVagao = idVagao;
        this.qtdMaxPassageiros = qtdMax;
        this.qtdPassageirosSentados = 0;
        this.listaPassageiros = [];
    }

    get getQtdMax() : number{
        return this.qtdMaxPassageiros;
    }

    get getQtdPassageiros() : number{
        return this.qtdPassageirosSentados;        
    
    }

    get getIdVagao() : number{
        return this.idVagao;
    }
    embarcarPassageiro(passageiro: Passageiro) : boolean{
        if(this.listaPassageiros.length == 0){
            // verificar se a lista está vazia
            // se estiver nem precisa verificar se existe um objeto igual :3
            this.listaPassageiros.push(passageiro);
            this.qtdPassageirosSentados += 1;
            return true;
        }

        if (this.qtdPassageirosSentados < this.qtdMaxPassageiros){
            for(let elemento of this.listaPassageiros){
            //comparando o elemento da lista com o id da variável passageiro do tipo Passageiro
                if (elemento.getId == passageiro.getId){          
                    return false ;
                } else {
                        this.listaPassageiros.push(passageiro);
                        this.qtdPassageirosSentados += 1;
                        return true;
                }
            }
        }
    }

    desembarcarPassageiro(id : number) : boolean{
        for (let i = 0; i < this.listaPassageiros.length; i++){
            //decorar esse if
            if (this.listaPassageiros[i].getId == id){

                this.listaPassageiros.splice(Number(i), 1)
                // IMPORTATE! ^^essa é a maneira certa de deletar elementos de listas(anota aí)
                // a outra forma tava errada
                this.qtdPassageirosSentados -= 1;
                return true;
            }
        }
        return false;        
    }

    procurarPassageiro(id : number) : Passageiro{
        for (let elemento of this.listaPassageiros){
            if (elemento.getId == id){
                return elemento;
            }
        }
        return null;
    }
    toString() : string{
        return "IdVagao: " + this.idVagao +"| Capacidade: " + this.qtdMaxPassageiros + "| Passageiros: " + this.qtdPassageirosSentados + "\n";

    }
}


class Trem{
    private idTrem : number;
    private listaVagao : Vagao[];
    private qtdVagoes : number;
    private qtdVagoesAlocados : number = 0;

    constructor(id : number, qtdVagoes : number){
        //mas uma vez, somente 2 parametros
        this.idTrem = id;
        this.qtdVagoes = qtdVagoes;
        this.listaVagao = [];
    }

    toString(): string{
        return "IdTrem: " + this.idTrem + "| CapVagoes: " + this.qtdVagoes + "| VagoesAlocados " + this.qtdVagoesAlocados + "\n";
    }

    get getIdTrem() : number{
        return this.idTrem;
    }

    get getQtdVagoes() : number{
        return this.qtdVagoes;
    }

    get getQtdVagoesAlocados() : number {
        return this.qtdVagoesAlocados;
    }
    

    embarcar(passageiro: Passageiro) : boolean{
        for(let elemento of this.listaVagao){
            if( elemento.getQtdPassageiros < elemento.getQtdMax){
                let result : boolean = elemento.embarcarPassageiro(passageiro);
                if(result)
                    return true;
            } 
            
        }
        return false;
    }

    addVagao(vagao : Vagao) : boolean{
        if(this.qtdVagoes == this.qtdVagoesAlocados)
            return false;

        for (let elemento of this.listaVagao){
            if (elemento.getIdVagao == vagao.getIdVagao){
                return false;
            }
        }
        this.listaVagao.push(vagao);
        this.qtdVagoesAlocados += 1
        return true;
    }

    desembarcar(id : number) : boolean{
        for (let i = 0; i < this.listaVagao.length; i++){
            if (this.listaVagao[i].desembarcarPassageiro(id)){
                return true;
            }
        }

        return false;        
    }
    procurarPassageiro1(id : number) : Passageiro {
    //^^tive que adicionar esse 1 no nome pq tava confundindo com o metodo de procurar passageiro da classe Vagao :/
        for(let vagao of this.listaVagao){
            if(vagao.procurarPassageiro(id) == null)
                return null;
            else
                return vagao.procurarPassageiro(id);
        }

    }
    procurarVagao(id : number): Vagao {
        for(let vagao of this.listaVagao){
            if(vagao.getIdVagao == id)
                return vagao;
        }
        return null;
    }

    contarPassageiros() : number {
        let numPasageiros : number = 0;
        // ^^essa variável guarda a contagem dos n de passageiros
        for(let vagao of this.listaVagao){
            numPasageiros += vagao.getQtdPassageiros; 
        }
        return numPasageiros;
    }
    showVagoes() : void {
        for(let i = 0; i < this.listaVagao.length; i++) {
            console.log(this.listaVagao[i])
        }
    }
    
}

class Controle{  //<<< classe pra rodar o codigo

    trem : Trem;
    //^^criando o ojeto principal
    //olha o tamanho disso kkkkkkk

    constructor(){
        this.trem = new Trem(1, 2);
        this.trem.addVagao(new Vagao(1, 2,));
        this.trem.embarcar(new Passageiro(1, "dan"))
        this.trem.embarcar(new Passageiro(2, "rafa"))
        // ^^ essaparte pode iniciar como quiser

    }

    openConsole() : void {
        //abrir console igual a funcao main() fazia
        let op: string[] = [""];
        
        while (op[0] != "fim"){
            op = cin("digite comando ou help: ").split(" ");
            if(op[0] == "help"){
                console.log("iniciar $id $qtdVagoes");
                console.log("embarcar $id $nome");
                console.log("addVagao $id $nLugares");
                console.log("desenbarcar $id");
                console.log("getPassageiro $id")
                console.log("getVagao $id");
                console.log("getNumVagoes")
                console.log("getNumPassageiros\n")
            }

            if(op[0] == "iniciar"){
                this.trem = new Trem(Number(op[1]), Number(op[2]));
                console.log(this.trem);
            }

            if(op[0] == "addVagao"){
                let result : boolean = this.trem.addVagao(new Vagao(Number(op[1]), Number(op[2])));
                // ^ essa variavel recebe um valor booleano ao adicionar um vagao
                if(result)
                //esse if verifica se o vagao foi adicionado checando se a variavel é true ou false
                    console.log("Vagao " + this.trem.procurarVagao(Number(op[1])).getIdVagao + " adicionado\n");
                else
                    console.log("Erro ao adicionar vagao\n");
            }

            if(op[0] == "embarcar"){
                let result : boolean = this.trem.embarcar(new Passageiro(Number(op[1]), op[2]));
                // ^ o mesmo esqueminha do de cima
                if(result)
                    console.log("Passageiro embarcou\n")
                else
                    console.log("Erro ao adicionar passageiro\n");
            }

            if(op[0] == "desembarcar"){
                let result : boolean = this.trem.desembarcar(Number(op[1]));
                if(result)
                    console.log("Passageiro desembarcou\n")
                else
                    console.log("Erro ao procurar passageiro\n")
            }
            
            if(op[0] == "getPassageiro"){
                let result : any = this.trem.procurarPassageiro1(Number(op[1]));
                // ^por algum motivo essa variavel só deu certo no tipo any :/

                if(result == null){
                    console.log("Passageiro " + op[1] + " nao se encontra");
                } else {  // << é assim a estrutura do if e else juntos (é bom anotar) 
                      //se precisar escrever como o elif em python a forma correta é colocar o if entre o else e a chave>> } else if (){  
                    let passageiro : Passageiro = (this.trem.procurarPassageiro1(Number(op[1])));
                    console.log(passageiro);
                }
            }

            if(op[0] == "getVagao"){
                if(this.trem.procurarVagao(Number(op[1])) == null)
                    console.log("Vagao nao existe\n")
                else
                    console.log(this.trem.procurarVagao(Number(op[1])));
            }

            if(op[0] == "getNumVagoes"){
                console.log("Vagoes alocados: " + this.trem.getQtdVagoesAlocados + "| Capacidade: " + this.trem.getQtdVagoes);
            }

            if(op[0] == "getNumPassageiros"){
                console.log("O trem possui " + this.trem.contarPassageiros() + " passageiros\n");
            }

            if(op[0] == "status"){
                console.log(this.trem + "\n");  //<< pra printa o toString da clase Trem basta pedir pra printar ela mesma (é bom anotar)
            }

            if(op[0] == "stat"){
                this.trem.showVagoes(); 
            }

        }
    }
}

function main() {
    let controle : Controle = new Controle;
    controle.openConsole();
    //a funcao main() cria o objeto Controle que roda o código todo
}

main();
// acho que fica bem melhor de entender com essa classe Controle nao acha? hehe
