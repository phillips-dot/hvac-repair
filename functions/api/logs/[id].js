export async function onRequestDelete({ params, env }) {
  try {
    await env.DB.prepare('DELETE FROM logs WHERE id = ?').bind(Number(params.id)).run();
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
