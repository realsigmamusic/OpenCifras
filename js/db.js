export const db = new Dexie('OpenCifrasDB');

db.version(3).stores({
	musicas: '++id, titulo, artista, conteudo, tom'
});