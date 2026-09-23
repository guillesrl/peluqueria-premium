"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, Scissors } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const services = [
  { id: "corte", name: "Corte & estilo", detail: "Un corte pensado para tu pelo y tu forma de llevarlo." },
  { id: "color", name: "Color a medida", detail: "Matices y dimensión para un resultado que se sienta tuyo." },
  { id: "cuidado", name: "Cuidado capilar", detail: "Suavidad y brillo para que vuelvas a disfrutar tu cabello." },
  { id: "peinado", name: "Peinado", detail: "Un acabado especial para una ocasión o para hoy." },
];
const slots = ["10:00", "11:30", "13:00", "15:00", "16:30", "18:00"];
const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parse = (value: string) => { const [y, m, d] = value.split("-").map(Number); return new Date(y, m - 1, d); };
const pretty = (value: string) => new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(parse(value));

export default function Home() {
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [step, setStep] = useState(1);
  const [today, setToday] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const chosen = services.find((item) => item.id === service);
  const maxDate = today ? iso(new Date(parse(today).getFullYear(), parse(today).getMonth(), parse(today).getDate() + 30)) : "";

  useEffect(() => {
    const now = new Date();
    setToday(iso(now));
    setDays(Array.from({ length: 7 }, (_, i) => iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i))));
  }, []);

  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: object, options: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool || !today) return;
    const controller = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: "stage_demo_booking", title: "Preparar reserva de prueba",
        description: "Selecciona servicio, fecha y hora de demostración para mostrar el resumen antes de confirmar. No crea una cita real.",
        inputSchema: { type: "object", properties: { serviceId: { type: "string", enum: services.map((item) => item.id) }, date: { type: "string", description: "Fecha local YYYY-MM-DD" }, time: { type: "string", enum: slots } }, required: ["serviceId", "date", "time"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input: unknown) {
          const value = input as { serviceId?: string; date?: string; time?: string };
          const currentHour = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
          if (!services.some((item) => item.id === value.serviceId) || !value.date || !/^\d{4}-\d{2}-\d{2}$/.test(value.date) || iso(parse(value.date)) !== value.date || value.date < iso(new Date()) || value.date > maxDate || !slots.includes(value.time ?? "") || (value.date === iso(new Date()) && value.time! <= currentHour)) throw new Error("Elige un servicio, una fecha futura de los próximos 30 días y un horario válido.");
          setService(value.serviceId!); setDate(value.date); setHour(value.time!); setStep(3); setDone(false); setError("");
          document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" });
          return { status: "ready_for_review", service: services.find((item) => item.id === value.serviceId)?.name, date: value.date, time: value.time, realBooking: false };
        },
      }, { signal: controller.signal })).catch(() => {});
    } catch { /* La página también funciona sin WebMCP. */ }
    return () => controller.abort();
  }, [today, maxDate]);

  function pickService(id: string) {
    setService(id); setDate(""); setHour(""); setStep(2); setDone(false); setError("");
    document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" });
  }
  function next() {
    if (step === 1 && !service) return setError("Elige un servicio para continuar.");
    if (step === 2 && (!date || !hour)) return setError("Elige una fecha y un horario para continuar.");
    if (step === 2 && (date < iso(new Date()) || date > maxDate || !slots.includes(hour) || (date === iso(new Date()) && hour <= new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date())))) return setError("La fecha o el horario ya no están disponibles en la demostración. Elige otra opción.");
    setError(""); setStep(step + 1);
  }
  function confirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!chosen || !date || !hour || !name.trim() || !phone.trim()) return setError("Completa los datos de la simulación.");
    if (date < iso(new Date()) || date > maxDate || (date === iso(new Date()) && hour <= new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()))) return setError("Ese horario ya pasó. Selecciona otro para la simulación.");
    setError(""); setDone(true);
  }
  const currentHour = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
  const available = slots.filter((item) => date !== today || item > currentHour);

  return <main id="inicio">
    <header className="header">
      <a className="brand" href="#inicio" aria-label="Peluquería, volver al inicio"><span className="brand-icon"><Scissors size={19} strokeWidth={1.4} /></span><span>PELUQUERÍA<small>EL ARTE DE CUIDARTE</small></span></a>
      <nav aria-label="Navegación principal"><a href="#servicios">Servicios</a><a href="#galeria">Galería</a><a href="#reserva">Reserva</a></nav>
      <a className="header-cta" href="#reserva">Pide tu cita <ArrowUpRight size={17} /></a>
    </header>

    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-photo" role="img" aria-label="Clienta con bata negra en un salón de peluquería elegante" />
      <div className="hero-overlay" />
      <div className="wrap hero-content"><span className="eyebrow">UNA EXPERIENCIA PARA TI</span><h1 id="hero-title">Tu belleza,<br /><em>a tu manera.</em></h1><p>Un espacio para cambiar, cuidarte y volver a sentirte tú.</p><a className="button light" href="#reserva">Elegir mi cita <ArrowUpRight size={19} /></a></div>
      <div className="wrap hero-bottom"><span>ESTILO · CUIDADO · CALMA</span><span>DESLIZA PARA DESCUBRIR ↓</span></div>
    </section>

    <section className="services section" id="servicios" aria-labelledby="services-title"><div className="wrap">
      <div className="heading"><div><span className="eyebrow">NUESTROS SERVICIOS</span><h2 id="services-title">Tu momento empieza <em>aquí.</em></h2></div><p>Una selección de cuidados para darle forma a lo que tienes en mente.</p></div>
      <div className="service-grid">{services.map((item, index) => <button className="service-card" key={item.id} onClick={() => pickService(item.id)}><span className="card-index">0{index + 1} / SERVICIO</span><span className="card-main"><span><strong>{item.name}</strong><small>{item.detail}</small></span><span className="circle-arrow"><ArrowUpRight size={19} /></span></span></button>)}</div>
    </div></section>

    <section className="gallery section" id="galeria" aria-labelledby="gallery-title"><div className="wrap">
      <div className="heading"><div><span className="eyebrow">UN POCO DE NOSOTROS</span><h2 id="gallery-title">Belleza que se <em>siente.</em></h2></div><p>Un lugar donde cada detalle acompaña tu experiencia.</p></div>
      <div className="gallery-grid"><figure className="gallery-large"><img src="/peluqueria-premium/images/salon-portrait.webp" alt="Retrato de una clienta en el salón" loading="lazy" /><figcaption>01 <span>La experiencia</span></figcaption></figure><div className="gallery-side"><figure><img src="/peluqueria-premium/images/salon-experience.webp" alt="Sillas profesionales del salón" loading="lazy" /><figcaption>02 <span>El espacio</span></figcaption></figure><div className="gallery-quote"><span>“</span><p>El mejor estilo es el que te hace sentir bien.</p><small>UN MOMENTO SOLO PARA TI</small></div></div></div>
    </div></section>

    <section className="booking section" id="reserva" aria-labelledby="booking-title"><div className="wrap booking-grid">
      <div className="booking-copy"><span className="eyebrow">TU PRÓXIMO MOMENTO</span><h2 id="booking-title">Reserva tiempo <em>para ti.</em></h2><p>Elige servicio, día y hora. Este recorrido es una demostración: los horarios no representan disponibilidad real.</p><span className="watermark" aria-hidden="true">P</span></div>
      <div className="booking-card"><div className="booking-card-head"><div><span>RESERVA DE DEMOSTRACIÓN</span><h3>{done ? "Vista previa lista" : ["Elige tu servicio", "Busca tu momento", "Revisa los detalles"][step - 1]}</h3></div><small>{done ? "✓" : `0${step} / 03`}</small></div>
        {done ? <div className="success" role="status"><div className="success-icon"><Check size={26} /></div><h4>Así se vería tu cita</h4><p><strong>{chosen?.name}</strong><br />{pretty(date)} a las {hour}<br />A nombre de {name.trim()}</p><div className="notice">No se creó ninguna reserva ni se enviaron tus datos.</div><button onClick={() => { setDone(false); setStep(1); setService(""); setDate(""); setHour(""); setName(""); setPhone(""); }}>Probar otra cita <ArrowRight size={17} /></button></div> : <>
          <div className="progress"><span className={step >= 1 ? "active" : ""}>Servicio</span><span className={step >= 2 ? "active" : ""}>Fecha y hora</span><span className={step >= 3 ? "active" : ""}>Confirmación</span></div>
          {step === 1 && <RadioGroup className="choices" value={service} onValueChange={setService} aria-label="Servicio">{services.map((item) => <label className={`choice ${service === item.id ? "selected" : ""}`} key={item.id}><span><strong>{item.name}</strong><small>{item.detail}</small></span><RadioGroupItem value={item.id} aria-label={item.name} /></label>)}</RadioGroup>}
          {step === 2 && <div className="date-fields"><p className="field-label">Elige un día</p><div className="date-row">{days.map((value) => <button key={value} className={date === value ? "selected" : ""} onClick={() => { setDate(value); setHour(""); setError(""); }} aria-pressed={date === value}><span>{new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(parse(value)).replace(".", "")}</span><strong>{parse(value).getDate()}</strong></button>)}</div><label className="more-date">O elige otra fecha <input type="date" value={date} min={today} max={maxDate} onChange={(event) => { setDate(event.target.value); setHour(""); }} /></label><p className="field-label hour-label">Elige una hora</p>{date ? available.length ? <div className="hours">{available.map((value) => <button key={value} className={hour === value ? "selected" : ""} onClick={() => { setHour(value); setError(""); }} aria-pressed={hour === value}>{value}</button>)}</div> : <p className="empty">Ya pasaron los horarios de hoy. Elige otro día.</p> : <p className="empty">Selecciona primero un día.</p>}<p className="hint">Horarios ilustrativos para probar el recorrido.</p></div>}
          {step === 3 && <form id="demo-form" onSubmit={confirm}><div className="summary"><small>TU SELECCIÓN</small><strong>{chosen?.name}</strong><p>{date && pretty(date)} · {hour}</p><button type="button" onClick={() => setStep(2)}>Cambiar horario</button></div><div className="inputs"><label>Tu nombre<input required autoComplete="off" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre" /></label><label>Teléfono<input required type="tel" autoComplete="off" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Teléfono" /></label></div><p className="hint">Datos solo para visualizar la confirmación; no se envían ni se guardan.</p></form>}
          {error && <p className="error" role="alert">{error}</p>}
          <div className="actions">{step > 1 && <button className="back" onClick={() => { setStep(step - 1); setError(""); }}><ChevronLeft size={18} /> Volver</button>}{step < 3 ? <button className="button dark" onClick={next}>Continuar <ArrowRight size={18} /></button> : <button className="button dark" type="submit" form="demo-form">Confirmar simulación <ArrowRight size={18} /></button>}</div>
        </>}
      </div>
    </div></section>
    <footer><div className="wrap footer-inner"><a className="brand" href="#inicio"><span className="brand-icon"><Scissors size={18} /></span><span>PELUQUERÍA<small>EL ARTE DE CUIDARTE</small></span></a><span>Prototipo privado · Reservas de demostración</span><a href="#inicio">Volver arriba ↑</a></div></footer>
  </main>;
}
