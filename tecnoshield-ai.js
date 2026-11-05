(() => {
  "use strict";
  if (window.__TECNOSHIELD_AI_LOADED__) return;
  window.__TECNOSHIELD_AI_LOADED__ = true;

  const CONFIG = {
    name: "TecnoShield AI",
    subtitle: "Asesor técnico virtual",
    whatsapp: "51978944240",
    apiChat: "/api/chat",
    apiLead: "/api/leads",
    primary: "#0b72ce",
    accent: "#39c6f4"
  };

  const css = `
  #tsai-launcher{position:fixed;right:22px;bottom:22px;z-index:99998;border:0;border-radius:999px;background:linear-gradient(135deg,#0877d1,#0b2342);color:#fff;padding:13px 18px;display:flex;align-items:center;gap:10px;box-shadow:0 12px 34px #001a3350;cursor:pointer;font:600 14px system-ui,sans-serif}
  #tsai-launcher .tsai-orb{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#ffffff20;font-size:19px}
  #tsai-panel{position:fixed;right:22px;bottom:88px;width:min(390px,calc(100vw - 28px));height:min(610px,calc(100dvh - 115px));z-index:99999;background:#0b1422;color:#eaf3ff;border:1px solid #263c55;border-radius:20px;box-shadow:0 20px 70px #0008;display:none;overflow:hidden;font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif}
  #tsai-panel.tsai-open{display:flex;flex-direction:column}
  #tsai-panel *{box-sizing:border-box}
  .tsai-head{padding:15px 16px;background:linear-gradient(120deg,#0b2342,#0b72ce);display:flex;align-items:center;gap:11px}
  .tsai-logo{width:39px;height:39px;border:1px solid #ffffff65;border-radius:12px;display:grid;place-items:center;font-weight:800;color:#fff}
  .tsai-headtext{flex:1}.tsai-headtext strong{display:block;font-size:14px}.tsai-headtext small{color:#d2eaff}
  .tsai-close{border:0;background:#ffffff18;color:white;border-radius:9px;width:32px;height:32px;font-size:20px;cursor:pointer}
  .tsai-body{padding:15px;overflow:auto;flex:1;background:radial-gradient(circle at top right,#142b45 0,transparent 45%),#0b1422}
  .tsai-msg{max-width:88%;padding:11px 13px;border-radius:14px;margin:0 0 11px;white-space:pre-wrap;overflow-wrap:anywhere}
  .tsai-bot{background:#17283c;border:1px solid #29415b;border-top-left-radius:5px;color:#eaf3ff}
  .tsai-user{background:#0877d1;color:white;margin-left:auto;border-top-right-radius:5px}
  .tsai-quick{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0 14px}
  .tsai-quick button{background:#102943;color:#dceeff;border:1px solid #2a5277;border-radius:999px;padding:8px 10px;font-size:12px;cursor:pointer}
  .tsai-compose{padding:12px;background:#0d1b2b;border-top:1px solid #20364e}
  .tsai-form{display:flex;gap:8px}.tsai-form input{min-width:0;flex:1;background:#13253a;border:1px solid #29445f;border-radius:12px;padding:12px;color:white;outline:none;font:14px system-ui}.tsai-form input:focus{border-color:#39a9ed}
  .tsai-send{border:0;border-radius:12px;background:#0877d1;color:white;padding:0 15px;font-weight:700;cursor:pointer}
  .tsai-foot{font-size:10px;color:#8da8c2;margin-top:7px;text-align:center}
  .tsai-typing{color:#9bb9d4;font-size:12px;margin:3px 0 10px}
  .tsai-action{display:inline-block;margin-top:7px;color:#7ed6ff;text-decoration:underline;cursor:pointer;background:none;border:0;padding:0;font:inherit}
  .tsai-lead{display:grid;gap:8px;margin-top:8px}.tsai-lead input,.tsai-lead textarea{width:100%;padding:10px;border-radius:9px;border:1px solid #36516b;background:#102238;color:white;font:13px system-ui}.tsai-lead button{background:#0877d1;color:#fff;border:0;padding:10px;border-radius:9px;font-weight:700;cursor:pointer}.tsai-consent{font-size:11px;color:#a9bed2;display:flex;gap:7px;align-items:flex-start}
  @media(max-width:520px){#tsai-launcher{right:14px;bottom:14px}#tsai-panel{right:8px;bottom:76px;width:calc(100vw - 16px);height:min(650px,calc(100dvh - 90px))}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const panel = document.createElement("section");
  panel.id = "tsai-panel";
  panel.setAttribute("aria-label", "Chat de TecnoShield AI");
  panel.innerHTML = `
    <header class="tsai-head">
      <div class="tsai-logo">TS</div>
      <div class="tsai-headtext"><strong>${CONFIG.name}</strong><small>● En línea · ${CONFIG.subtitle}</small></div>
      <button class="tsai-close" type="button" aria-label="Cerrar chat">×</button>
    </header>
    <main class="tsai-body" aria-live="polite">
      <div class="tsai-msg tsai-bot">¡Hola! Soy el asistente técnico de TecnoShield. 👋\\n\\nPuedo orientarte sobre reparación de celulares y computadoras, videovigilancia, redes y seguridad informática. ¿Qué solución estás buscando?</div>
      <div class="tsai-quick">
        <button data-q="Necesito reparar un celular">Reparar celular</button>
        <button data-q="Quiero una cotización de cámaras de seguridad">Cámaras CCTV</button>
        <button data-q="Necesito soporte para computadora o laptop">Computadoras</button>
        <button data-q="Quiero hablar con un asesor">Hablar con asesor</button>
      </div>
    </main>
    <div class="tsai-compose">
      <form class="tsai-form"><input maxlength="1200" autocomplete="off" placeholder="Escribe tu consulta..." aria-label="Escribe tu consulta"><button class="tsai-send" type="submit">Enviar</button></form>
      <div class="tsai-foot">Asistente virtual · TecnoShield · Evita compartir contraseñas o datos bancarios.</div>
    </div>`;
  document.body.appendChild(panel);

  const launcher = document.createElement("button");
  launcher.id = "tsai-launcher";
  launcher.type = "button";
  launcher.innerHTML = '<span class="tsai-orb">✦</span><span>¿Necesitas ayuda?</span>';
  launcher.setAttribute("aria-label", "Abrir asistente TecnoShield AI");
  document.body.appendChild(launcher);

  const body = panel.querySelector(".tsai-body");
  const form = panel.querySelector("form");
  const input = form.querySelector("input");
  const history = [];

  function open() { panel.classList.add("tsai-open"); launcher.style.display = "none"; input.focus(); }
  function close() { panel.classList.remove("tsai-open"); launcher.style.display = "flex"; }
  function addMessage(text, who="bot") {
    const div = document.createElement("div");
    div.className = "tsai-msg " + (who === "user" ? "tsai-user" : "tsai-bot");
    div.textContent = text;
    body.appendChild(div); body.scrollTop = body.scrollHeight;
    return div;
  }
  function addQuick(text) {
    const wrap = document.createElement("div"); wrap.className = "tsai-quick";
    const b = document.createElement("button"); b.type = "button"; b.textContent = text;
    b.addEventListener("click", () => send(text));
    wrap.appendChild(b); body.appendChild(wrap); body.scrollTop = body.scrollHeight;
  }
  function showLeadForm() {
    const wrap = document.createElement("div");
    wrap.className = "tsai-msg tsai-bot";
    wrap.innerHTML = '<strong>Solicitar contacto comercial</strong><form class="tsai-lead"><input name="name" placeholder="Nombre y apellido" maxlength="100" required><input name="phone" placeholder="Teléfono / WhatsApp" maxlength="30" required><input name="email" type="email" placeholder="Correo (opcional)" maxlength="120"><textarea name="need" placeholder="¿Qué servicio necesitas?" rows="2" maxlength="1000"></textarea><label class="tsai-consent"><input name="consent" type="checkbox" required> Autorizo a TecnoShield a contactarme para atender esta solicitud.</label><button type="submit">Enviar solicitud</button></form>';
    body.appendChild(wrap); body.scrollTop = body.scrollHeight;
    wrap.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      const payload = {name:f.get("name"),phone:f.get("phone"),email:f.get("email"),need:f.get("need"),consent:f.get("consent")==="on",source:location.href};
      const btn = e.currentTarget.querySelector("button"); btn.disabled = true; btn.textContent = "Enviando...";
      try {
        const r = await fetch(CONFIG.apiLead,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
        const data = await r.json();
        if(!r.ok) throw new Error(data.error || "No se pudo registrar");
        addMessage("¡Gracias! Tu solicitud fue recibida. Un asesor de TecnoShield podrá contactarte. También puedes escribirnos directamente por WhatsApp.");
        addWhatsApp();
        e.currentTarget.remove();
      } catch(err) {
        addMessage("No pude registrar la solicitud automáticamente. Puedes continuar por WhatsApp para que un asesor te atienda.");
        addWhatsApp();
        btn.disabled = false; btn.textContent = "Reintentar";
      }
    });
  }
  function addWhatsApp() {
    const a = document.createElement("a");
    a.className = "tsai-action"; a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hola TecnoShield, vengo desde la web y necesito asesoría.")}`;
    a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "Abrir WhatsApp de TecnoShield";
    const d = document.createElement("div"); d.className = "tsai-msg tsai-bot"; d.appendChild(a); body.appendChild(d); body.scrollTop=body.scrollHeight;
  }
  async function send(text) {
    const message = String(text || "").trim(); if (!message) return;
    addMessage(message,"user"); history.push({role:"user",content:message});
    const typing = document.createElement("div"); typing.className="tsai-typing"; typing.textContent="TecnoShield AI está escribiendo…"; body.appendChild(typing); body.scrollTop=body.scrollHeight;
    try {
      const r = await fetch(CONFIG.apiChat,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:history.slice(-12)})});
      const data = await r.json(); if(!r.ok) throw new Error(data.error || "Error de conexión");
      typing.remove();
      const answer = data.reply || "No pude generar una respuesta. Intenta nuevamente.";
      addMessage(answer); history.push({role:"assistant",content:answer});
      if(/asesor|cotizaci[oó]n|presupuesto|contact(ar|o)|contratar/i.test(message)) addQuick("Dejar mis datos para que me contacten");
    } catch(err) {
      typing.remove(); addMessage("En este momento no puedo conectar con el servicio de IA. Puedes intentar nuevamente o comunicarte con un asesor por WhatsApp.");
      addWhatsApp();
    }
  }

  launcher.addEventListener("click",open);
  panel.querySelector(".tsai-close").addEventListener("click",close);
  form.addEventListener("submit",(e)=>{e.preventDefault();const v=input.value;input.value="";send(v);});
  panel.querySelectorAll("[data-q]").forEach(b=>b.addEventListener("click",()=>send(b.dataset.q)));
  body.addEventListener("click",(e)=>{if(e.target.matches("button") && e.target.textContent.includes("Dejar mis datos")) showLeadForm();});
  // Permite abrir el formulario de captación desde cualquier integración futura.
  window.TecnoShieldAI = {open, close, requestContact:showLeadForm, send};
})();