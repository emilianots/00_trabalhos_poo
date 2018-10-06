export class Telefone{
    public foneid: string;
    public numero: string;
    
    constructor(foneid: string, numero: string){
        this.foneid = foneid;
        this.numero = numero;
        this.validar(this.numero);
    }

    validar (str: string):boolean{
        let re: Array<string> = ['(',')','-','0','1','2','3','4','5','6','7','8','9']; 
        let numero: Array<string> = str.split("");
        
        for (let nome = numero.length; nome >= 0; nome --) {
            if (str.indexOf(numero[nome]) != -1) {
                numero.splice(str.indexOf(numero[nome]), 1);
            }
        }
        if (numero.length != 0){
            throw "Caractere inválido!"
        } 
        return true
    }
    
}

