import { useEffect, useMemo, useRef, useState } from "react";
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { ArrowUpRight, ArrowUp, Sparkles, X, Github, Globe2, ChevronRight } from "lucide-react";

type Section = "Me" | "Projects" | "Skills" | "Fun" | "Contact";
type Message = { question: string; answer: string };
const sections: Section[] = ["Me", "Projects", "Skills", "Fun", "Contact"];
const MODEL_ID = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
const profile = { name: "Nzabana Merci", github: "https://github.com/nmcosta5", website: "https://nzabana.vercel.app/" };
const content: Record<Section, { prompt: string; intro: string; suggestions: string[] }> = {
  Me: { prompt: "Ask me anything about Merci…", intro: "I'm Merci — a student developer from Rwanda, currently studying at Giheke TSS. I enjoy turning ideas into useful digital experiences, learning how things work, and improving with every project. I'm hardworking, curious and disciplined, with a growing focus on full-stack web development.", suggestions: ["Tell me about yourself", "Where are you from?", "What are you studying?"] },
  Projects: { prompt: "Ask about my projects…", intro: "I learn by building. My projects explore practical web experiences, from entertainment and personal finance to business websites and management tools.", suggestions: ["Tell me about Agasobanuye Free", "What have you built?", "Which technologies do you use?"] },
  Skills: { prompt: "Ask about my technical skills…", intro: "My current toolkit includes JavaScript, TypeScript, React, HTML, CSS, Node.js, REST APIs, Supabase, MySQL, MongoDB, Git and GitHub. I keep strengthening these skills through coursework and hands-on projects.", suggestions: ["What are your strongest skills?", "Do you know React?", "What are you learning now?"] },
  Fun: { prompt: "Ask me something fun…", intro: "Outside the code, I'm a curious learner who enjoys gaming, exploring technology, experimenting with ideas and finding better ways to build things.", suggestions: ["What do you do for fun?", "Are you a gamer?", "What inspires you?"] },
  Contact: { prompt: "Ask how to get in touch…", intro: "Want to connect, collaborate or talk about a project? The best way to reach me online is through GitHub. You can also explore my personal website.", suggestions: ["How can I contact you?", "Can we collaborate?", "Show me your GitHub"] }
};
const projects = [
  { name: "Agasobanuye Free", desc: "A movie and entertainment discovery platform.", tags: "React · TypeScript · Supabase", url: "https://github.com/nmcosta5/Agsobanuye-New" },
  { name: "Expense Tracker", desc: "A simple way to record expenses and understand spending.", tags: "React · TypeScript", url: "https://github.com/nmcosta5?tab=repositories" },
  { name: "XM Bakery", desc: "A clean storefront concept for a bakery business.", tags: "React · TypeScript", url: "https://github.com/nmcosta5?tab=repositories" },
  { name: "Cooperative", desc: "A web app concept for useful cooperative workflows.", tags: "React · TypeScript", url: "https://github.com/nmcosta5?tab=repositories" }
];

function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext("2d"); if (!canvas || !ctx) return;
    let raf = 0, width = 0, height = 0, tick = 0;
    const pointer = { x: -1000, y: -1000 };
    const blobs = Array.from({ length: 7 }, (_, i) => ({ x: Math.random(), y: Math.random(), r: 90 + Math.random() * 150, vx: (Math.random() - .5) * .00045, vy: (Math.random() - .5) * .0004, phase: i * 1.7 }));
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 1.6); width = window.innerWidth; height = window.innerHeight; canvas.width = width * dpr; canvas.height = height * dpr; canvas.style.width = width + "px"; canvas.style.height = height + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const move = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; };
    const leave = () => { pointer.x = -1000; pointer.y = -1000; };
    const draw = () => {
      tick += .006; ctx.clearRect(0, 0, width, height); ctx.globalCompositeOperation = "screen";
      blobs.forEach((b, i) => {
        b.x += b.vx; b.y += b.vy; if (b.x < -.1 || b.x > 1.1) b.vx *= -1; if (b.y < -.1 || b.y > 1.1) b.vy *= -1;
        const x = b.x * width + Math.sin(tick * .7 + b.phase) * 24, y = b.y * height + Math.cos(tick * .8 + b.phase) * 22;
        const dx = x - pointer.x, dy = y - pointer.y, dist = Math.hypot(dx, dy), push = dist < 220 ? (220 - dist) / 220 : 0;
        const px = x + (dist ? dx / dist * push * 35 : 0), py = y + (dist ? dy / dist * push * 35 : 0), radius = b.r + Math.sin(tick + b.phase) * 22;
        const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
        g.addColorStop(0, i % 2 ? "rgba(205,213,221,.16)" : "rgba(190,205,196,.17)"); g.addColorStop(.48, "rgba(210,216,220,.065)"); g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, radius, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over"; raf = requestAnimationFrame(draw);
    };
    resize(); draw(); window.addEventListener("resize", resize); window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); window.removeEventListener("pointerleave", leave); };
  }, []);
  return <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" />;
}
function App() {
  const [active, setActive] = useState<Section>("Me");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [promoOpen, setPromoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamingAnswer, setStreamingAnswer] = useState("");
  const [modelStatus, setModelStatus] = useState("LOCAL AI · FIRST MESSAGE DOWNLOADS THE MODEL");
  const engineRef = useRef<Awaited<ReturnType<typeof CreateMLCEngine>> | null>(null);
  const current = content[active];
  const displayed = useMemo(() => messages.length ? messages[messages.length - 1] : null, [messages]);
  const selectSection = (section: Section) => { setActive(section); setQuestion(""); setMessages([]); setLoading(false); };
  const ask = async (value = question) => {
    const clean = value.trim(); if (!clean || loading) return;
    setQuestion(clean); setLoading(true); setStreamingAnswer(""); setModelStatus("Checking browser GPU support…");
    try {
      if (!(navigator as Navigator & { gpu?: unknown }).gpu) {
        throw new Error("This browser does not expose WebGPU. Please try the latest Google Chrome or Microsoft Edge on a device with WebGPU support.");
      }
      if (!engineRef.current) {
        setModelStatus("Downloading and preparing the local AI model…");
        engineRef.current = await CreateMLCEngine(MODEL_ID, {
          initProgressCallback: (report) => setModelStatus(report.text || "Preparing local AI model…")
        });
      }
      setModelStatus("AI is ready · generating locally");
      const history = messages.slice(-6).flatMap(item => [
        { role: "user" as const, content: item.question },
        { role: "assistant" as const, content: item.answer }
      ]);
      const systemPrompt = "You are Merci's portfolio assistant. Be friendly, clear, useful and concise. Answer general questions when appropriate, but never invent personal facts about Merci. Verified details: Name Nzabana Merci; from Rwanda; Advanced Level student at Giheke TSS, expected to graduate in 2027; interested in full-stack software development. Skills: JavaScript, TypeScript, React, Node.js, HTML, CSS, REST APIs, Supabase, MySQL, MongoDB, Git and GitHub. Projects: Agasobanuye Free (entertainment discovery platform), Expense Tracker, XM Bakery, and a Cooperative management concept. GitHub: https://github.com/nmcosta5. Portfolio: https://nzabana.vercel.app/. If asked for private information or facts not listed here, say you don't have that information. Do not claim to have performed actions or accessed live websites.";
      const chunks = await engineRef.current.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: clean }],
        stream: true,
        temperature: 0.7,
        max_tokens: 420
      });
      let answer = "";
      for await (const chunk of chunks as AsyncIterable<{ choices?: Array<{ delta?: { content?: string } }> }>) {
        const token = chunk.choices?.[0]?.delta?.content || "";
        if (token) { answer += token; setStreamingAnswer(answer); }
      }
      const finalAnswer = answer.trim() || "I couldn't generate a response. Please try asking in a different way.";
      setMessages(prev => [...prev, { question: clean, answer: finalAnswer }]);
      setStreamingAnswer("");
      setModelStatus("LOCAL AI READY · RUNNING ON THIS DEVICE");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The local AI could not start on this device.";
      setMessages(prev => [...prev, { question: clean, answer: "I couldn't start the local AI. " + message }]);
      setStreamingAnswer("");
      setModelStatus("LOCAL AI UNAVAILABLE · CHECK WEBGPU SUPPORT");
    } finally {
      setLoading(false);
    }
  };
  return <main className="app-shell">
    <FluidCanvas />
    <header className="topbar">
      <a className="about-mark" href={profile.github} target="_blank" rel="noreferrer" aria-label="Open GitHub profile"><Github size={17}/></a>
    </header>
    <section className="main-stage">
      <div className="hero">
        <div className="availability"><span className="availability-dot"/> AVAILABLE FOR COLLABORATION</div>
        <h1>Hey, I'm Merci <span className="wave">👋</span></h1>
        <p className="role-title">Software Developer</p>
        <div className="portrait-wrap"><div className="portrait-halo"/><img className="portrait" src="https://www.aaabadcode.com/_next/image?q=75&url=%2Flanding-memojis.png&w=3840" alt="3D Memoji-style portrait"/></div>
        <p className="hero-caption">A curious developer from Rwanda, building thoughtful things for the web.</p>
      </div>
      <div className="conversation" aria-live="polite">
        <div className="conversation-heading"><span className="sparkle"><Sparkles size={14}/></span><span>{active === "Me" ? "A LITTLE INTRODUCTION" : "LET'S TALK " + active.toUpperCase()}</span><i/></div>
        {displayed ? <div className="answer-card"><div className="user-question">{displayed.question}</div><p>{displayed.answer}</p>
          {active === "Projects" && <div className="mini-projects">{projects.map(p => <a href={p.url} key={p.name} target="_blank" rel="noreferrer"><span><b>{p.name}</b><small>{p.desc}</small></span><ArrowUpRight size={15}/></a>)}</div>}
          {active === "Skills" && <div className="skill-cloud">{["JavaScript","TypeScript","React","Node.js","HTML","CSS","Supabase","MySQL","MongoDB","Git"].map(s => <span key={s}>{s}</span>)}</div>}
          {active === "Contact" && <div className="contact-links"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={15}/> GitHub <ArrowUpRight size={13}/></a><a href={profile.website} target="_blank" rel="noreferrer"><Globe2 size={15}/> Portfolio <ArrowUpRight size={13}/></a></div>}
        </div> : <div className="intro-answer"><span className="answer-dot"/><p>{current.intro}</p></div>}
        <div className="suggestions">{current.suggestions.map(s => <button key={s} onClick={() => ask(s)}>{s}<ChevronRight size={12}/></button>)}</div>
        <form className="ask-form" onSubmit={e => { e.preventDefault(); ask(); }}><input value={question} onChange={e => setQuestion(e.target.value)} placeholder={current.prompt} aria-label={current.prompt} maxLength={240}/><button type="submit" disabled={!question.trim() || loading} aria-label="Send question">{loading ? <span className="loader"/> : <ArrowUp size={17}/>}</button></form>
        {loading && streamingAnswer && <div className="answer-card live-answer"><p>{streamingAnswer}<span className="typing-caret">▍</span></p></div>}
        <div className="input-note">{modelStatus} <span>·</span> YOUR MESSAGES STAY IN THIS BROWSER</div>
      </div>
    </section>
    <nav className="section-nav" aria-label="Portfolio sections">{sections.map((section, i) => <button key={section} onClick={() => selectSection(section)} className={active === section ? "nav-item active" : "nav-item"} aria-current={active === section ? "page" : undefined}><span className="nav-number">0{i + 1}</span>{section}</button>)}</nav>
    <footer className="bottom-footer"><span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span><span>MADE WITH CURIOSITY IN RWANDA</span><button onClick={() => setPromoOpen(true)}>BUILT WITH <b>FASTFOLIO</b> <ArrowUpRight size={11}/></button></footer>
    {promoOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setPromoOpen(false); }}>
      <section className="promo-modal" role="dialog" aria-modal="true" aria-labelledby="promo-title"><button className="modal-close" onClick={() => setPromoOpen(false)} aria-label="Close promotion"><X size={17}/></button>
        <div className="modal-logo"><img src="https://www.aaabadcode.com/_next/image?q=75&url=%2Ffastfolio-logo.png&w=48" alt="Fastfolio logo"/></div>
        <span className="modal-eyebrow">YOUR STORY, POWERED BY AI</span><h2 id="promo-title">Build your AI<br/><em>portfolio.</em></h2>
        <p>Turn your experience, projects and personality into a portfolio that feels like you. Start with Fastfolio and bring your work to life.</p>
        <a className="modal-cta" href="https://www.aaabadcode.com/" target="_blank" rel="noreferrer">Explore Fastfolio <ArrowUpRight size={15}/></a>
        <span className="modal-footnote">A PORTFOLIO BUILDER FOR THE NEXT GENERATION</span>
      </section>
    </div>}
  </main>;
}
export default App;
