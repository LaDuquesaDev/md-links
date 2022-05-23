const {
    getMdFiles,
    getLinksMdFiles,
    getObjetsLinks,
    convertPath,
} = require("./functions.js");

const mdLinks = (path, option) => {
    return new Promise((resolve, reject) => {
        //Función que convierte ruta en absoluta
        const convertedRoute = convertPath(path)
            //Función que evalua si la ruta es un archivo .md
        getMdFiles(convertedRoute)
            //Función que lee el archivo y valida opciones
        getObjetsLinks(convertedRoute)
            .then((res) => {
                if (option.validate !== true) {
                    resolve(getLinksMdFiles(convertedRoute)); //getLinksMdFiles devuelve href, text, file como objeto para cuando tenemos {validate: false}
                } else {
                    resolve(getObjetsLinks(convertedRoute)) //getLinksMdFiles devuelve href, text, file, status y message status como objeto para cuando tenemos {validate: true}
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

module.exports = {
    mdLinks,
};