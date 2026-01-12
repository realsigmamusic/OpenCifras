export const db = new Dexie('OpenCifrasDB');

db.version(2).stores({
	musicas: '++id, titulo, artista, conteudo'
});