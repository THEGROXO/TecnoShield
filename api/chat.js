
import https from "node:https";

const SYSTEM_PROMPT = `
Eres TecnoShield AI, asesor técnico y comercial de TecnoShield en Perú.

PERSONALIDAD:
Profesional, especializado, cordial, honesto y claro.

OBJETIVO:
Atender clientes, identificar necesidades y convertir consultas en oportunidades comerciales.

SERVICIOS:
- Reparación de celulares.
- Computadoras y laptops.
- Cámaras CCTV e IP.
- Redes y conectividad.
- Soporte informático.
- Seguridad informática.

REGLAS:
1. Comprende primero la necesidad del cliente.
2. Haz una pregunta concreta cuando falten datos.
3. No inventes precios, garantías ni tiempos.
4. Para CCTV pregunta cantidad, ubicación, cableado y grabación.
5. Para reparaciones pregunta marca, modelo y falla.
6. Nunca solicites contraseñas, PIN ni datos bancarios.
7. Ofrece contacto por WhatsApp: +51 978 944 240.
8. No afirmes que una solicitud fue registrada sin confirmación.
9. Responde en español natural, normalmente en 2 a 5 frases.
`;

function requestOpenAI(payload, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);

    const request = https.request({
      hostname: "api.openai.com",
      port: 443,
      path: "/v1/responses",
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      },
      timeout: 60000
    }, (response) => {
      let result = "";

      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        result += chunk;
      });

      response.on("end", () => {
        let data;

        try {
          data = JSON.parse(result);
        } catch {
          console.error("OPENAI RESPONSE STATUS:", response.statusCode);
          console.error(
            "OPENAI RESPONSE CONTENT TYPE:",
            response.headers["content-type"] || "no informado"
          );
          console.error(
            "OPENAI RESPONSE BODY:",
            result.slice(0, 1000)
          );

          return reject(
            new Error("OpenAI devolvió una respuesta que no es JSON")
          );
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          const error = new Error(
            data?.error?.message || `OpenAI HTTP ${response.statusCode}`
          );

          error.statusCode = response.statusCode;
          return reject(error);
        }

        resolve(data);
      });
    });

    request.on("error", reject);

    request.on("timeout", () => {
      request.destroy(
        new Error("Tiempo de espera agotado al conectar con OpenAI")
      );
    });

    request.end(body);
  });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: "OPENAI_API_KEY no está configurada"
    });
  }

  try {
    const messages = Array.isArray(req.body?.messages)
      ? req.body.messages.slice(-12)
      : [];

    const safeMessages = messages
      .filter((message) =>
        ["user", "assistant"].includes(message?.role) &&
        typeof message?.content === "string"
      )
      .map((message) => ({
        role: message.role,
        content: message.content.slice(0, 1200)
      }));

    if (
      !safeMessages.length ||
      safeMessages[safeMessages.length - 1].role !== "user"
    ) {
      return res.status(400).json({
        error: "Escribe una consulta para continuar"
      });
    }

    const data = await requestOpenAI({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: SYSTEM_PROMPT,
      input: safeMessages,
      max_output_tokens: 450,
      store: false
    }, apiKey);

    const reply = (data.output || [])
      .filter((item) => item.type === "message")
      .flatMap((item) => item.content || [])
      .filter((item) => item.type === "output_text")
      .map((item) => item.text)
      .join("\n")
      .trim();

    return res.status(200).json({
      reply: reply || "Cuéntame un poco más sobre lo que necesitas."
    });

  } catch (error) {
    console.error("TECNOShield ERROR MESSAGE:", error.message);
    console.error("TECNOShield ERROR STACK:", error.stack);

    return res.status(
      error.statusCode === 429 ? 429 : 502
    ).json({
      error: error.message || "Error de conexión con OpenAI"
    });
  }
}
