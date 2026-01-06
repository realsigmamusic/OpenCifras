/* import Dexie from 'https://unpkg.com/dexie@3/dist/dexie.js'; */

export const db = new Dexie('OpenCifrasDB');

db.version(1).stores({
    musicas: '++id, titulo, conteudo'
});