export const db = new Dexie('OpenCifrasDB');

db.version(1).stores({
	musicas: '++id, titulo, conteudo'
});