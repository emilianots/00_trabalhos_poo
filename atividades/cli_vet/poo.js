"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require('readline-sync');
class Poo {
    static cin(text) {
        //ret urn prompt(text);
        return readline.question(text);
    }
    static cout(value) {
        //return alert(text);
        return console.log(value);
    }
    static vet2str(prefix, vet, separador) {
        let saida = prefix;
        for (let elem of vet)
            saida + "" + elem + separador;
        return saida;
    }
    static map2vet(mapa) {
        let vet = new Array();
        for (let elem of mapa.values())
            vet.push(elem);
        return vet;
    }
}
exports.Poo = Poo;
