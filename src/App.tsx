import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ArrowUp, Sparkles, X, Github, Globe2, ChevronRight } from "lucide-react";
import ProjectShowcase from "./ProjectShowcase";

type Section = "Me" | "Projects" | "Skills" | "Fun" | "Contact";
type Message = { question: string; answer: string };

function AnswerBody({ text }: { text: string }) {
  const paragraphs = text.split(/\\n{2,}/).filter(Boolean);
  return <div className="answer-copy">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph.split(/(https?:\\/\\/[^\\s)]+)/g).map((part, partIndex) => /^https?:\\/\\//.test(part) ? <a key={partIndex} href={part} target="_blank" rel="noreferrer">{part.replace(/^https?:\\/\\//, "").replace(/\\/$/, "")} <ArrowUpRight size={11}/></a> : part)}</p>)}</div>;
}
const sections: Section[] = ["Me", "Projects", "Skills", "Fun", "Contact"];
const profile = { name: "Nzabana Merci", github: "https://github.com/nmcosta5", website: "https://nzabana.vercel.app/" };
const content: Record<Section, { prompt: string; intro: string; suggestions: string[] }> = {
  Me: { prompt: "Ask me anything about Merci…", intro: "I'm Merci — a student developer from Rwanda, currently studying at Giheke TSS. I enjoy turning ideas into useful digital experiences, learning how things work, and improving with every project. I'm hardworking, curious and disciplined, with a growing focus on full-stack web development.", suggestions: ["Tell me about yourself", "Where are you from?", "What are you studying?"] },
  Projects: { prompt: "Ask about my projects…", intro: "I learn by building. My projects explore practical web experiences, from entertainment and personal finance to business websites and management tools.", suggestions: ["Tell me about Agasobanuye Free", "What have you built?", "Which technologies do you use?"] },
  Skills: { prompt: "Ask about my technical skills…", intro: "My current toolkit includes JavaScript, TypeScript, React, HTML, CSS, Node.js, REST APIs, Supabase, MySQL, MongoDB, Git and GitHub. I keep strengthening these skills through coursework and hands-on projects.", suggestions: ["What are your strongest skills?", "Do you know React?", "What are you learning now?"] },
  Fun: { prompt: "Ask me something fun…", intro: "Outside the code, I'm a curious learner who enjoys gaming, exploring technology, experimenting with ideas and finding better ways to build things.", suggestions: ["What do you do for fun?", "Are you a gamer?", "What inspires you?"] },
  Contact: { prompt: "Ask how to get in touch…", intro: "Want to connect, collaborate or talk about a project? The best way to reach me online is through GitHub. You can also explore my personal website.", suggestions: ["How can I contact you?", "Can we collaborate?", "Show me your GitHub"] }
};
const projects = [
  { name: "Agasobanuye Free", desc: "Discover movies, series and entertainment.", url: "https://agasobanuyefree.vercel.app", type: "ENTERTAINMENT", stack: "React · TypeScript · Supabase", shot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://agasobanuyefree.vercel.app" },
  { name: "Sonora Lemon", desc: "A music experience built around sound and discovery.", url: "https://sonoralemon.vercel.app", type: "MUSIC EXPERIENCE", stack: "React · TypeScript", shot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://sonoralemon.vercel.app" },
  { name: "VocalPiano", desc: "An interactive space for voice and piano.", url: "https://vocalpiano.vercel.app", type: "MUSIC TOOL", stack: "Web · Audio", shot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://vocalpiano.vercel.app" },
  { name: "AskVolt", desc: "An AI-powered assistant experience.", url: "https://askvolt.vercel.app", type: "AI APPLICATION", stack: "React · AI", shot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://askvolt.vercel.app" },
  { name: "MerciHub", desc: "A personal hub for digital tools and experiences.", url: "https://mercihub.vercel.app", type: "DIGITAL HUB", stack: "React · Web", shot: "https://image.thum.io/get/width/1200/crop/760/noanimate/https://mercihub.vercel.app" }
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
  const [modelStatus, setModelStatus] = useState("ONLINE AI · CONNECTING TO GROQ");
  const [githubAvatar, setGithubAvatar] = useState("https://github.com/nmcosta5.png");
  useEffect(() => {
    let active = true;
    fetch("https://api.github.com/users/nmcosta5", { headers: { Accept: "application/vnd.github+json" } })
      .then(response => { if (!response.ok) throw new Error("GitHub profile unavailable"); return response.json(); })
      .then(user => { if (active && typeof user.avatar_url === "string") setGithubAvatar(user.avatar_url); })
      .catch(() => { if (active) setGithubAvatar("https://github.com/nmcosta5.png"); });
    return () => { active = false; };
  }, []);
  const current = content[active];
  const displayed = useMemo(() => messages.length ? messages[messages.length - 1] : null, [messages]);
  const selectSection = (section: Section) => { setActive(section); setQuestion(""); setMessages([]); setLoading(false); };
  const ask = async (value = question) => {
    const clean = value.trim(); if (!clean || loading) return;
    setQuestion(clean); setLoading(true); setStreamingAnswer(""); setModelStatus("CONNECTING TO ONLINE AI…");
    try {
      const history = messages.slice(-6).flatMap(item => [
        { role: "user", content: item.question },
        { role: "assistant", content: item.answer }
      ]);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: clean }] })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The online AI service is temporarily unavailable.");
      const answer = typeof data.answer === "string" ? data.answer.trim() : "";
      if (!answer) throw new Error("The AI returned an empty response. Please try again.");
      setStreamingAnswer(answer);
      setMessages(prev => [...prev, { question: clean, answer }]);
      setStreamingAnswer("");
      setModelStatus("ONLINE AI READY · POWERED BY GROQ");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The online AI could not respond.";
      setMessages(prev => [...prev, { question: clean, answer: "I couldn't get a response from the online AI. " + message }]);
      setStreamingAnswer("");
      setModelStatus("ONLINE AI UNAVAILABLE · PLEASE TRY AGAIN");
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
        <div className="portrait-wrap"><div className="portrait-halo"/><img className="portrait" src={githubAvatar} alt="Nzabana Merci GitHub profile photo" loading="eager" referrerPolicy="no-referrer"/></div>
        <p className="hero-caption">A curious developer from Rwanda, building thoughtful things for the web.</p>
      </div>
      <div className="conversation" aria-live="polite">
        <div className="conversation-heading"><span className="sparkle"><Sparkles size={14}/></span><span>{active === "Me" ? "A LITTLE INTRODUCTION" : "LET'S TALK " + active.toUpperCase()}</span><i/></div>
        {active === "Projects" && <section className="showcase-intro">
          <span className="showcase-kicker">SELECTED WORK <span>✳</span> 2024 — 2026</span>
          <h2>Things I've <em>built.</em></h2>
          <p>A collection of projects I've brought to life — each one a chance to learn, experiment and build something useful.</p>
        </section>}
        {active === "Projects" ? <ProjectShowcase projects={projects} /> : null}

        {displayed ? <div className="answer-card"><div className="user-question">{displayed.question}</div><div className="answer-meta"><img src={githubAvatar} alt="" /><span>MERCI’S AI ASSISTANT</span><i>·</i><span>JUST NOW</span></div><AnswerBody text={displayed.answer}/>
          
          {active === "Skills" && <div className="skill-cloud">{["JavaScript","TypeScript","React","Node.js","HTML","CSS","Supabase","MySQL","MongoDB","Git"].map(s => <span key={s}>{s}</span>)}</div>}
          {active === "Contact" && <div className="contact-links"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={15}/> GitHub <ArrowUpRight size={13}/></a><a href={profile.website} target="_blank" rel="noreferrer"><Globe2 size={15}/> Portfolio <ArrowUpRight size={13}/></a></div>}
        </div> : active !== "Projects" ? <div className="intro-answer"><span className="answer-dot"/><p>{current.intro}</p></div> : null}
        <div className="suggestions">{current.suggestions.map(s => <button key={s} onClick={() => ask(s)}>{s}<ChevronRight size={12}/></button>)}</div>
        <form className="ask-form" onSubmit={e => { e.preventDefault(); ask(); }}><input value={question} onChange={e => setQuestion(e.target.value)} placeholder={current.prompt} aria-label={current.prompt} maxLength={240}/><button type="submit" disabled={!question.trim() || loading} aria-label="Send question">{loading ? <span className="loader"/> : <ArrowUp size={17}/>}</button></form>
        {loading && streamingAnswer && <div className="answer-card live-answer"><div className="answer-meta"><img src={githubAvatar} alt="" /><span>MERCI’S AI ASSISTANT</span><i>·</i><span>WRITING</span></div><AnswerBody text={streamingAnswer}/><span className="typing-caret">▍</span></div>}
        <div className="input-note">{modelStatus} <span>·</span> ONLINE MODEL · CHAT HISTORY IS SESSION-ONLY</div>
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
