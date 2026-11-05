export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: "El registro de solicitudes aún no está configurado." });
  }

  const { name, phone, email = "", need = "", consent, source = "" } = req.body || {};
  if (!consent) return res.status(400).json({ error: "Necesitamos tu autorización para contactarte." });
  if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) return res.status(400).json({ error: "Revisa el nombre." });
  if (typeof phone !== "string" || phone.replace(/\D/g, "").length < 7 || phone.length > 30) return res.status(400).json({ error: "Revisa el teléfono." });
  if (typeof email !== "string" || email.length > 120 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({ error: "Revisa el correo." });
  if (typeof need !== "string" || need.length > 1000) return res.status(400).json({ error: "La descripción es demasiado larga." });

  try {
    const endpoint = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/leads`;
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        need: need.trim() || null,
        source: typeof source === "string" ? source.slice(0, 500) : null,
        status: "nuevo",
        consent: true
      })
    });
    if (!result.ok) {
      console.error("Supabase lead error:", await result.text());
      return res.status(502).json({ error: "No se pudo guardar la solicitud." });
    }
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return res.status(500).json({ error: "Error al registrar la solicitud." });
  }
}