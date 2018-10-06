"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require('readline-sync');
function cout(value) {
    return console.log(value);
}
exports.cout = cout;
function cin(text) {
    return readline.question(text);
}
exports.cin = cin;
