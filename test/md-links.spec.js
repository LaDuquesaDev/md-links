const { mdLinks } = require('../index.js');
const process = require('process');

const options = { validate: false, stats: false };
const route = `${process.cwd()}\\test\\test-folder\\test-file.md`;
const invalidRoute = 'test\\test-folder\\test-file1.md';
const fileWithoutLinks = 'C:\\Users\\yduqu\\OneDrive\\Escritorio\\Laboratoria\\md-links\\test\\test-folder\\test-file.md';

const arrayLinksValidated = [{
    href: 'https://www.google.com.co/',
    text: 'Este es un link',
    file: 'test-file.md',
    status: 200,
    message: 'Ok'
}];


describe('mdLinks', () => {

    it('should be a function', () => {
        expect(typeof mdLinks).toBe('function');
    });
});

describe('mdLinks', () => {

    it('debe retornar promesa', () => {
        expect(mdLinks(route) instanceof Promise).toBeTruthy();
    });

    it("Debe retornar array de objetos de links validos", () =>
        mdLinks(route)
        .then((e) => {
            console.log('QUE ESPERO DE LA E', e)
            expect(e).toEqual(arrayLinksValidated)
        })
        .catch(errr => console.log('ACA PASA ALGO', errr))
    )

    it('debe ser un string de ruta no valida', () =>
        mdLinks(invalidRoute).then((e) =>
            expect(e).toBe(arrayLinksValidated)
        )
        .catch(errr => console.log('ACA PASA ALGO 2', errr))
    )

    it("Debe retornar mensaje de que el archivo no contiene links", () => {
        mdLinks(fileWithoutLinks).catch((e) => {
            expect(e).toMatch('El archivo no contiene Links')
        });
    });
});