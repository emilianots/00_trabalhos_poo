class Passageiro {
    constructor(nome, id) {
        this.nome = nome;
        this.id = id;
    }
    toString() {
        return this.nome;
    }
}
class Vagao {
    constructor(id, capacidade) {
        this.passageiros = [];
        for (let i = 0; i < capacidade; i++) {
            this.passageiros.push(null);
        }
    }
    embarcar(pass) {
        for (let i = 0; i < this.passageiros.length; i++) {
            if (this.passageiros[i] == null && this.passageiros[i].id != pass.id) {
                this.passageiros[i] = pass;
                return true;
            }
            return false;
        }
    }
    desembarcar(id) {
        for (let i = 0; i < this.passageiros.length; i++) {
            if (this.passageiros[i].id == id) {
                this.passageiros[i] = null;
                return true;
            }
            return false;
        }
    }
    searchPass(id) {
        for (let i = 0; i < this.passageiros.length; i++) {
            if (this.passageiros[i].id == id) {
                return this.passageiros[i];
            }
            return null;
        }
    }
    toString() {
        let st = "[ ";
        for (let pessoa of this.passageiros) {
            if (pessoa) {
                st + pessoa + " ";
            }
            else {
                st + "- ";
            }
            st + "]";
            return st;
        }
    }
}
let vagao = new Vagao(1, 3);
vagao.embarcar(new Passageiro("ze", "01"));
console.log(vagao);
vagao.embarcar(new Passageiro("Fi", "02"));
console.log(vagao);
vagao.embarcar(new Passageiro("xa", "03"));
console.log(vagao);
vagao.desembarcar("01");
console.log(vagao);
