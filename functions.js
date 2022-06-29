const path = require("path");
const fs = require("fs");
const { default: axios } = require("axios");

//Valida si la es ruta es absoluta
const absolutePath = (route) => path.isAbsolute(route);

//Convirte la ruta de relativa a absoluta
const convertPath = (route) =>
    absolutePath(route) ? route : path.resolve(route);

//Valida si la ruta es una carpeta
const folderPath = (route) => fs.statSync(route).isDirectory();

//Iterrar directorio
const readDirectory = (route) => fs.readdirSync(route, "utf-8");

//Valida si hay archivos con extensión .md
const extMdFile = (route) => path.extname(route) === ".md";


//Lectura de ruta
const getMdFiles = (currentRoute) => {
    let arrayMdFiles = [];
    if (folderPath(currentRoute)) { //Si es directorio entra aquí

        readDirectory(currentRoute).forEach(elem => {
            let joinRoute = path.join(currentRoute, elem);
            arrayMdFiles = arrayMdFiles.concat(getMdFiles(joinRoute)); // Aplica recursividad
        });
    } else { //Si no es directorio, es archivo y entra acá
        if (extMdFile(currentRoute)) {
            arrayMdFiles.push(currentRoute);
        }
    }
    return arrayMdFiles;
}

//Lectura de archivo .md
const readMdFiles = (MDfile) => {
    return new Promise((resolve, reject) => {
        fs.readFile(MDfile, "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    route: MDfile,
                    fileContent: data,
                });
            }
        });
    });
};

//Extrayendo URL´s del archivo .md
const getLinksMdFiles = (routeMDfile) =>
    new Promise((resolve, reject) => {
        const regExp = /\[(.*?)\]\(.*?\)/gm;
        const regUrl = /\(.*?\)/gm;
        const regText = /\[(.*?)\]/gm;
        let arrayLinksConvert = [];

        readMdFiles(routeMDfile)
            .then((fileContent) => {
                const arrayLinks = fileContent.fileContent.match(regExp);

                if (arrayLinks === null) {
                    resolve([]);
                }

                arrayLinks.forEach((objLinks) => {
                    const objhref = objLinks.match(regUrl).join().slice(1, -1);
                    const objtext = objLinks.match(regText).join().slice(1, -1);
                    arrayLinksConvert.push({
                        href: objhref, //URL encontrada
                        text: objtext.substring(0, 50), //Texto que aparecía dentro del link (<a>).
                        file: path.basename(routeMDfile), //Ruta del archivo donde se encontró el link.
                    });
                });
                resolve(arrayLinksConvert);
                return arrayLinksConvert;
            })
            .catch((err) => {
                reject(err);
            });
    });

//Extrayendo información de cada link encontrado en archivo .md
const getObjetsLinks = (routes) => {
    const promises = routes.map(elem => {
        return getLinksMdFiles(elem).then((arrayLinksConvert) => {
            return Promise.all(
                arrayLinksConvert.map((object) => {
                    return axios
                        .get(object.href)
                        .then((result) => {
                            return {
                                href: object.href,
                                text: object.text,
                                file: object.file,
                                status: result.status,
                                message: "Ok",
                            };
                        })
                        .catch((error) => {
                            return {
                                href: object.href,
                                text: object.text,
                                file: object.file,
                                status: 404,
                                message: "Fail",
                            };
                        });
                })
            );
        });
    })
    return Promise.all(promises)
}

//Función que retorna el total de links y links únicos
const totalAndUnique = (arraylinks) => {
    let totalLinks = 0;
    let uniqueLinks = [];
    arraylinks.forEach(arr => {
        totalLinks += arr.length;
        uniqueLinks = uniqueLinks.concat(arr)
    })
    uniqueLinks = new Set(uniqueLinks.map((element) => element.href)); // crear una colección de links únicos(no se repiten);
    const stats = `${('Total :')} ${(totalLinks)}\n${('Unique :')} ${(uniqueLinks.size)}`;
    console.log(stats);
}

//Función que verifica si hay algun link roto
const broken = (arraylinks) => {
    let broken = [];
    arraylinks.forEach(arr => {
        broken = broken.concat(arr.filter(elem => elem.message === 'Fail'));
    })
    const stats = `${('Broken :')} ${(broken.length)}`;
    console.log(stats);
}

// getObjetsLinks(route)
//     .then((response) => console.log("RESPONDE", response))
//     .catch((error) => console.log("NO RESPONDE", error));

module.exports = {
    getMdFiles,
    readMdFiles,
    getLinksMdFiles,
    getObjetsLinks,
    absolutePath,
    extMdFile,
    convertPath,
    totalAndUnique,
    broken,
};