export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });
  const expected = process.env.ADMIN_API_KEY;
  const supplied = req.headers["x-admin-key"];
  if (!expected || !supplied || supplied !== expected) return res.status(401).json({ error: "No autorizado" });

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({ error: "Base de datos no configurada" });

  try {
    const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/leads?select=id,created_at,name,phone,email,need,status&order=created_at.desc&limit=200`;
    const r = await fetch(url, { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: "No se pudieron consultar las solicitudes" });
    return res.status(200).json({ leads: data });
  } catch (e) {
    console.error("Admin leads error:", e);
    return res.status(500).json({ error: "Error interno" });
  }
}