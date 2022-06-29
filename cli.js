#!/usr/bin/env node

const mdLinks = require('./index.js')
const argv = process.argv;
var clc = require('cli-color');
const {
    totalAndUnique,
    broken,
} = require("./functions.js");

//Opciones API
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

//Opciones CLI
mdLinks.mdLinks(argv[2], readOptions())
    .then((res) => {
        if (argv.includes('--stats') || argv.includes('--s')) {
            totalAndUnique(res);
            if ((argv.includes('--validate') || argv.includes('--v'))) {
                broken(res);
            }
        } else if (argv.includes('--validate') || argv.includes('--v')) {
            res.forEach(arr => {
                arr.forEach(e => {
                    console.log((`\n${e.file} ${e.href} ${e.message} ${e.status} ${e.text}`));
                })
            })
        } else {
            res.forEach(arr => {
                arr.forEach(e => {
                    console.log((`\n${e.file} ${e.href} ${e.text}`));
                })
            })
        }
    })
    .catch((error) => {
        console.log(clc.red('Ruta no valida', error));
    });