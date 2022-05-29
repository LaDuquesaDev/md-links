#!/usr/bin/env node

const mdLinks = require('./index.js')
const argv = process.argv;
var clc = require('cli-color');
const {
    totalAndUnique,
    broken,
} = require("./functions.js");

const readOptions = () => {
    let options = { validate: false };
    if (argv.length > 3) {
        if (argv.includes('--validate') || argv.includes('--v')) {
            options.validate = true
        } else {
            options = {};
        }
    }
    return options
}


mdLinks.mdLinks(argv[2], readOptions())
    .then((res) => {
        if (argv.includes('--stats') || argv.includes('--s')) {
            console.log(totalAndUnique(res));
            if ((argv.includes('--validate') || argv.includes('--v'))) {
                console.log(broken(res));
            }
        } else if (argv.includes('--validate') || argv.includes('--v')) {
            res.forEach(e => {
                console.log((`${e.file} ${e.href} ${e.message} ${e.status} ${e.text}\n`));
            })
        } else {
            res.forEach(e => {
                console.log((`${e.file} ${e.href} ${e.text}\n`));
            })
        }
    })
    .catch((error) => {
        console.log(clc.red('Ruta no valida', error));
    });