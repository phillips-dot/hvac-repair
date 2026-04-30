async function ensureTable(db) {
  await db.prepare(
    'CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT)'
  ).run();
}

export async function onRequestGet({ env }) {
  try {
    await ensureTable(env.DB);
    const { results } = await env.DB.prepare('SELECT data FROM logs ORDER BY id DESC').all();
    return Response.json(results.map(r => JSON.parse(r.data)));
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    await ensureTable(env.DB);
    const log = await request.json();
    await env.DB.prepare(
      'INSERT OR REPLACE INTO logs (id, data, updated_at) VALUES (?, ?, ?)'
    ).bind(log.id, JSON.stringify(log), new Date().toISOString()).run();
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
