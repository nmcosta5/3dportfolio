import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ArrowUp, Sparkles, Github, Globe2, MessageCircle, ChevronRight, Sun, Moon, Download, RotateCcw, Copy, Check } from "lucide-react";

type Section = "Me" | "Projects" | "Skills" | "Fun" | "Contact";
type Message = { question: string; answer: string };

function AnswerBody({ text }: { text: string }) {
  const cleanText = text.replace(/\\\*/g, "");
  const renderInline = (value: string, prefix: string) => {
    const pattern = /(!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\))|(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*\n]+)\*)|(https?:\/\/[^\s)]+)/g;
    const nodes: React.ReactNode[] = [];
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(value))) {
      if (match.index > last) nodes.push(value.slice(last, match.index));
      if (match[1]) {
        nodes.push(<figure className="answer-image" key={prefix + match.index}><a href={match[3]} target="_blank" rel="noreferrer"><img src={match[3]} alt={match[2] || "Project image"} loading="lazy" referrerPolicy="no-referrer"/></a>{match[2] && <figcaption>{match[2]}</figcaption>}</figure>);
      } else if (match[7]) {
        nodes.push(<strong className="answer-strong" key={prefix + match.index}>{match[8]}</strong>);
      } else if (match[9]) {
        nodes.push(<em className="answer-em" key={prefix + match.index}>{match[10]}</em>);
      } else {
        const url = match[6] || match[11];
        const label = match[5] || url.replace(/^https?:\/\//, "").replace(/\/$/, "");
        nodes.push(<a className="answer-link-button" key={prefix + match.index} href={url} target="_blank" rel="noreferrer"><span>{label}</span><ArrowUpRight size={14}/></a>);
      }
      last = pattern.lastIndex;
    }
    if (last < value.length) nodes.push(value.slice(last));
    return nodes;
  };
  const blocks = cleanText.trim().split(/\n{2,}/).filter(Boolean);
  return <div className="answer-copy">{blocks.map((block, index) => {
    const lines = block.split("\n").filter(Boolean);
    if (lines.every(line => /^\s*[-•]\s+/.test(line))) return <ul className="answer-list" key={index}>{lines.map((line, i) => <li key={i}>{renderInline(line.replace(/^\s*[-•]\s+/, ""), index + "-" + i)}</li>)}</ul>;
    if (lines.length === 1 && /^#{1,3}\s/.test(lines[0])) return <h3 className="answer-heading" key={index}>{lines[0].replace(/^#{1,3}\s/, "")}</h3>;
    return <p key={index}>{lines.map((line, i) => <span key={i}>{renderInline(line, index + "-" + i)}{i < lines.length - 1 && <br/>}</span>)}</p>;
  })}</div>;
}

function isPersonalQuestion(question: string) {
  return /(?:about yourself|about you|about merci|about nzabana|who are you|who is merci|who is nzabana|introduce yourself|your (?:bio|biography|profile|background|story|education|interests)|tell me about (?:yourself|you|merci|nzabana)|where are you from|show (?:me )?(?:your )?(?:photo|picture)|your photo)/i.test(question);
}

function ProfileAnswer({ text }: { text: string }) {
  const imageStart = text.indexOf("![");
  const imageEnd = imageStart >= 0 ? text.indexOf(")", imageStart) : -1;
  const cleanProfile = imageStart < 0
    ? text.trim()
    : imageEnd < 0
      ? text.slice(0, imageStart).trim()
      : (text.slice(0, imageStart) + text.slice(imageEnd + 1)).trim();
  return <div className="profile-answer">
    <div className="profile-photo-frame">
      <img src="/IMG-20250726-WA0034.jpg" alt="Nzabana Merci" loading="eager" />
      <span className="profile-photo-caption">THE PERSON BEHIND THE CODE</span>
    </div>
    <div className="profile-copy">
      <div className="profile-eyebrow"><span/> ABOUT ME</div>
      <h2>Nzabana Merci</h2>
      <p className="profile-meta">Software Development Graduate <i/> Rwanda</p>
      <div className="profile-description"><AnswerBody text={cleanProfile}/></div>
      <div className="profile-tags">
        <span>Full-stack development</span>
        <span>React &amp; TypeScript</span>
        <span>Curious learner</span>
        <span>Gaming</span>
      </div>
    </div>
  </div>;
}

const sections: Section[] = ["Me", "Projects", "Skills", "Fun", "Contact"];
const profile = { name: "Nzabana Merci", github: "https://github.com/nmcosta5", website: "https://nzabana.vercel.app/", whatsapp: "250794041759", whatsappLink: "https://wa.me/250794041759?text=Hello%20Merci%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect." };
const content: Record<Section, { prompt: string; intro: string; suggestions: string[] }> = {
  Me: { prompt: "Ask me anything about Merci…", intro: "I'm Merci — a software developer from Rwanda and a 2026 Giheke TSS graduate. I enjoy turning ideas into useful digital experiences, learning how things work, and improving with every project. I'm hardworking, curious and disciplined, with a growing focus on full-stack web development.", suggestions: ["Tell me about yourself", "Where are you from?", "What are you studying?"] },
  Projects: { prompt: "Ask about my projects…", intro: "I build practical web experiences while learning full-stack development. Ask me about Agasobanuye Free, Sonora Lemon, Spend Wise, and other projects to explore the goals, technologies, and decisions behind them.", suggestions: ["Show me your best projects", "What did you build with React?", "Tell me about Agasobanuye Free"] },
  Skills: { prompt: "Ask about my technical skills…", intro: "My current toolkit includes JavaScript, TypeScript, React, HTML, CSS, Node.js, REST APIs, Supabase, MySQL, MongoDB, Git and GitHub. I keep strengthening these skills through coursework and hands-on projects.", suggestions: ["What are your strongest skills?", "Do you know React?", "What are you learning now?"] },
  Fun: { prompt: "Ask me something fun…", intro: "Outside the code, I'm a curious learner who enjoys gaming, exploring technology, experimenting with ideas and finding better ways to build things.", suggestions: ["What do you do for fun?", "Are you a gamer?", "What inspires you?"] },
  Contact: { prompt: "Ask how to get in touch…", intro: "Have a project in mind, want to collaborate, or just want to say hello? Send me a message on WhatsApp for a direct conversation, or connect through GitHub.", suggestions: ["Message me on WhatsApp", "Can we collaborate?", "Show me your GitHub"] }
};


function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    const pointer = { x: -1000, y: -1000, lastX: -1000, lastY: -1000, active: false };
    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; life: number; maxLife: number; hue: number }> = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = [138, 154, 168, 188];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (event: PointerEvent) => {
      // Pointer Events cover mouse, pen, and touch. Touch now paints the same
      // fluid layer instead of being ignored on phones and tablets.
      const isTouch = event.pointerType === "touch";
      pointer.lastX = pointer.x;
      pointer.lastY = pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      const distance = pointer.lastX < 0 ? 0 : Math.hypot(pointer.x - pointer.lastX, pointer.y - pointer.lastY);
      const step = isTouch ? 20 : 13;
      const count = pointer.lastX < 0 ? (isTouch ? 5 : 2) : Math.min(isTouch ? 7 : 5, Math.max(1, Math.floor(distance / step)));
      for (let i = 0; i < count; i++) {
        const t = (i + 1) / count;
        const x = pointer.lastX < 0 ? pointer.x : pointer.lastX + (pointer.x - pointer.lastX) * t;
        const y = pointer.lastY < 0 ? pointer.y : pointer.lastY + (pointer.y - pointer.lastY) * t;
        particles.push({
          x: x + (Math.random() - .5) * (isTouch ? 18 : 10),
          y: y + (Math.random() - .5) * (isTouch ? 18 : 10),
          vx: (Math.random() - .5) * (isTouch ? .48 : .65),
          vy: (Math.random() - .5) * (isTouch ? .48 : .65),
          radius: (isTouch ? 66 : 48) + Math.random() * (isTouch ? 88 : 62),
          life: 1,
          maxLife: isTouch ? 1.6 + Math.random() * .9 : 1.35 + Math.random() * .8,
          hue: palette[Math.floor(Math.random() * palette.length)]
        });
      }
      if (particles.length > (isTouch ? 72 : 110)) {
        particles.splice(0, particles.length - (isTouch ? 72 : 110));
      }
      // Restart the render loop after pointer input when reduced-motion mode
      // allowed the idle loop to pause.
      if (reducedMotion && !frame) frame = requestAnimationFrame(draw);
    };
    const leave = () => {
      pointer.active = false;
      pointer.lastX = -1000;
      pointer.lastY = -1000;
    };
    const draw = (time: number) => {
      const delta = Math.min((time - (lastTime || time)) / 16.67, 2);
      lastTime = time;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= .0065 * delta / p.maxLife;
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.vx *= .986;
        p.vy *= .986;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const alpha = Math.max(0, p.life) * (window.matchMedia("(pointer: coarse)").matches ? .62 : .5);
        const radius = p.radius * (1 + (1 - p.life) * .65);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, `hsla(${p.hue}, 30%, 34%, ${alpha})`);
        gradient.addColorStop(.42, `hsla(${p.hue}, 26%, 43%, ${alpha * .82})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 24%, 62%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      if (!reducedMotion || particles.length) frame = requestAnimationFrame(draw);
      else frame = 0;
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", leave, { passive: true });
    window.addEventListener("pointercancel", leave, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", leave);
      window.removeEventListener("pointercancel", leave);
      window.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" />;
}
function App() {
  const [active, setActive] = useState<Section>("Me");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [avatarReady, setAvatarReady] = useState(false);
  const [streamingAnswer, setStreamingAnswer] = useState("");
  const [activeQuestion, setActiveQuestion] = useState("");
  const [modelStatus, setModelStatus] = useState("ONLINE AI · CONNECTING TO GROQ");
  const githubAvatar = "/Stylized%20Beanie-Wearing%20Memoji%20Portrait%20(1).png";
  const [githubStats, setGithubStats] = useState<{ repos: number; followers: number } | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("merci-theme") === "dark" ? "dark" : "light"));
  const [challenge, setChallenge] = useState("Build a tiny app that helps someone in your community solve a daily problem.");
  const [copied, setCopied] = useState(false);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("merci-theme", theme); }, [theme]);
  useEffect(() => {
    let active = true;
    fetch("https://api.github.com/users/nmcosta5", { headers: { Accept: "application/vnd.github+json" } })
      .then(response => { if (!response.ok) throw new Error("GitHub profile unavailable"); return response.json(); })
      .then(user => { if (active) { setGithubStats({ repos: Number(user.public_repos || 0), followers: Number(user.followers || 0) }); } })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  const current = content[active];
  const displayed = useMemo(() => messages.length ? messages[messages.length - 1] : null, [messages]);
  const showPersonalProfile = isPersonalQuestion(loading ? activeQuestion : (displayed?.question || ""));
  const responseStartRef = useRef<HTMLDivElement>(null);
  const lastAutoScrollRef = useRef("");
  useEffect(() => {
    const responseReady = (loading && streamingAnswer.length > 0) || (!loading && Boolean(displayed));
    if (!responseReady) return;
    const responseKey = activeQuestion || displayed?.question || "";
    if (!responseKey || lastAutoScrollRef.current === responseKey) return;
    lastAutoScrollRef.current = responseKey;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      responseStartRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  }, [loading, streamingAnswer, displayed?.question, activeQuestion]);
  const copyGithub = async () => { try { await navigator.clipboard.writeText(profile.github); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { window.open(profile.github, "_blank", "noopener,noreferrer"); } };
  const nextChallenge = () => { const prompts = ["Create a simple tool that makes studying more organized.", "Design a useful digital service for a small Rwandan business.", "Build a mini game using only HTML, CSS and JavaScript.", "Create a dashboard that turns confusing data into clear insights.", "Make a lightweight app that works well on slow internet."]; setChallenge(current => { const options = prompts.filter(item => item !== current); return options[Math.floor(Math.random() * options.length)]; }); };
  const ask = async (value = question, freshConversation = false) => {
    const clean = value.trim();
    if (!clean || loading) return;
    setQuestion("");
    setActiveQuestion(clean);
    setLoading(true);
    setStreamingAnswer("");
    setModelStatus("CONNECTING TO ONLINE AI…");
    let answerSoFar = "";
    try {
      const history = freshConversation ? [] : messages.slice(-6).flatMap(item => [
        { role: "user", content: item.question },
        { role: "assistant", content: item.answer }
      ]);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: clean }] })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "The online AI service is temporarily unavailable.");
      }
      if (!response.body) throw new Error("Your browser could not open the live response stream.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const consumeEvent = (block: string) => {
        let eventName = "message";
        const dataLines: string[] = [];
        for (const line of block.split(/\r?\n/)) {
          if (line.startsWith("event:")) eventName = line.slice(6).trim();
          if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
        }
        if (!dataLines.length) return;
        const payload = JSON.parse(dataLines.join("\n"));
        if (eventName === "delta" && typeof payload.text === "string") {
          answerSoFar += payload.text;
          setStreamingAnswer(answerSoFar);
        } else if (eventName === "replace" && typeof payload.text === "string") {
          answerSoFar = payload.text;
          setStreamingAnswer(answerSoFar);
        } else if (eventName === "error") {
          throw new Error(payload.message || "The online AI stream was interrupted.");
        }
      };
      let finished = false;
      while (!finished) {
        const chunk = await reader.read();
        finished = chunk.done;
        if (chunk.value) buffer += decoder.decode(chunk.value, { stream: !finished });
        const blocks = buffer.split(/\r?\n\r?\n/);
        buffer = blocks.pop() || "";
        for (const block of blocks) consumeEvent(block);
        if (finished && buffer.trim()) consumeEvent(buffer);
      }
      const answer = answerSoFar.trim();
      if (!answer) throw new Error("The AI returned an empty response. Please try again.");
      setMessages(prev => [...(freshConversation ? [] : prev), { question: clean, answer }]);
      setStreamingAnswer("");
      setModelStatus("ONLINE AI READY · POWERED BY GROQ");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The online AI could not respond.";
      setMessages(prev => [...(freshConversation ? [] : prev), { question: clean, answer: "I couldn't get a response from the online AI. " + message }]);
      setStreamingAnswer("");
      setModelStatus("ONLINE AI UNAVAILABLE · PLEASE TRY AGAIN");
    } finally {
      setLoading(false);
    }
  };
  return <main className={avatarReady ? "app-shell app-ready" : "app-shell"}>
    <FluidCanvas />
    <header className="topbar">
      <div className="topbar-actions"><button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>{theme === "light" ? <Moon size={16}/> : <Sun size={16}/>}</button><a className="about-mark" href={profile.github} target="_blank" rel="noreferrer" aria-label="Open GitHub profile"><Github size={19} strokeWidth={1.8}/></a></div>
    </header>
    <section className="main-stage">
      <div className="hero">
        <div className="availability"><span className="availability-dot"/> AVAILABLE FOR COLLABORATION</div>
        <h1 className="hero-title"><img className="hero-brand-mark" src="/Monochrome%20Geometric%20NM%20Crest%20(1).png" alt="" loading="eager"/>Hey, I'm Merci <span className="wave">👋</span></h1>
        <p className="role-title">Full Stack Developer</p>
        <div className="portrait-wrap"><div className="portrait-halo"/><img className="portrait" src={githubAvatar} alt="Nzabana Merci wearing his beanie Memoji avatar" loading="eager" fetchPriority="high" decoding="async" onLoad={() => setAvatarReady(true)} onError={() => setAvatarReady(true)}/></div>
        <p className="hero-caption">A curious developer from Rwanda, building thoughtful things for the web.</p>
        <a className="cv-download" href="/Nzabana-Merci-CV.pdf" download="Nzabana-Merci-CV.pdf"><Download size={14}/> Download CV <span>PDF</span></a>
        {githubStats && <div className="profile-stats"><span><b>{githubStats.repos}</b> PUBLIC REPOSITORIES</span><i/> <span><b>{githubStats.followers}</b> FOLLOWERS</span></div>}
      </div>
      <div className="conversation" aria-live="polite">
        <div className="conversation-heading"><span className="sparkle"><Sparkles size={14}/></span><span>{active === "Me" ? "A LITTLE INTRODUCTION" : "LET'S TALK " + active.toUpperCase()}</span><i/></div>
        {active === "Skills" && <section className="interactive-skills">
          <div className="skills-showcase-heading">
            <span>MY TOOLKIT</span>
            <h2>Skills &amp; Expertise</h2>
            <p>The technologies and tools I use to turn ideas into working products.</p>
          </div>
          <div className="skill-groups">
            {[
              {name:"Frontend Development",items:["React","TypeScript","JavaScript","HTML","CSS","Tailwind CSS"]},
              {name:"Backend & APIs",items:["Node.js","REST APIs","Supabase"]},
              {name:"Databases",items:["MySQL","MongoDB","Supabase"]},
              {name:"Tools & Workflow",items:["Git","GitHub","Vite"]}
            ].map(group => <section className="skill-group" key={group.name}>
              <h3>{group.name}</h3>
              <div>{group.items.map(item => <button key={item} onClick={() => ask("How do I use " + item + " in my projects?")}>{item}</button>)}</div>
            </section>)}
          </div>
          <p className="skills-footnote">I keep building on these skills through hands-on projects and continuous learning.</p>
        </section>}
        {active === "Fun" && <div className="challenge-card"><span className="challenge-label">A SMALL DEVELOPER CHALLENGE</span><p>{challenge}</p><button onClick={nextChallenge}><RotateCcw size={13}/> Give me another</button></div>}
        {active === "Contact" && <div className="contact-quick"><a className="contact-whatsapp" href={profile.whatsappLink} target="_blank" rel="noreferrer" aria-label="Chat with Merci on WhatsApp"><MessageCircle size={17}/> <span><strong>Chat on WhatsApp</strong><small>+250 794 041 759</small></span><ArrowUpRight size={14}/></a><button onClick={copyGithub}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? "GitHub link copied" : "Copy GitHub link"}</button><a href={profile.github} target="_blank" rel="noreferrer"><Github size={14}/> Open GitHub <ArrowUpRight size={12}/></a><a href={profile.website} target="_blank" rel="noreferrer"><Globe2 size={14}/> Visit website <ArrowUpRight size={12}/></a></div>}

        <div ref={responseStartRef} className="response-start-anchor" aria-hidden="true"/>
        {displayed ? (
          showPersonalProfile ? (
            <div className="answer-card answer-card-profile"><ProfileAnswer text={displayed.answer}/></div>
          ) : (
            <div className="answer-card">
              <div className="user-question">{displayed.question}</div>
              <div className="answer-meta"><img src={githubAvatar} alt="" /><span>MERCI’S AI ASSISTANT</span><i>·</i><span>JUST NOW</span></div>
              <AnswerBody text={displayed.answer}/>
              {active === "Contact" && <div className="contact-links"><a className="contact-whatsapp" href={profile.whatsappLink} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp <ArrowUpRight size={13}/></a><a href={profile.github} target="_blank" rel="noreferrer"><Github size={15}/> GitHub <ArrowUpRight size={13}/></a><a href={profile.website} target="_blank" rel="noreferrer"><Globe2 size={15}/> Portfolio <ArrowUpRight size={13}/></a></div>}
            </div>
          )
        ) : <div className="intro-answer"><span className="answer-dot"/><p>{current.intro}</p></div>}
        <div className="suggestions">{current.suggestions.map(s => <button key={s} onClick={() => ask(s)}>{s}<ChevronRight size={12}/></button>)}</div>
        <form className="ask-form" onSubmit={e => { e.preventDefault(); ask(); }}><input value={question} onChange={e => setQuestion(e.target.value)} placeholder={current.prompt} aria-label={current.prompt} maxLength={240}/><button type="submit" disabled={!question.trim() || loading} aria-label="Send question">{loading ? <span className="loader"/> : <ArrowUp size={17}/>}</button></form>
        {loading && !streamingAnswer && <div className="thinking-card" role="status"><span className="thinking-dots"><i/><i/><i/></span><span>Merci is thinking…</span></div>}
        {loading && streamingAnswer && <div className={showPersonalProfile ? "answer-card live-answer answer-card-profile" : "answer-card live-answer"}>
          {showPersonalProfile ? <ProfileAnswer text={streamingAnswer}/> : <><div className="answer-meta"><img src={githubAvatar} alt="" /><span>MERCI’S AI ASSISTANT</span><i>·</i><span>WRITING</span></div><AnswerBody text={streamingAnswer}/></>}
          <span className="typing-caret">▍</span>
        </div>}
        <div className="chat-tools">{messages.length > 0 && <button onClick={() => { setMessages([]); setQuestion(""); }}><RotateCcw size={12}/> Clear conversation</button>}</div>
        <div className="input-note">{modelStatus} <span>·</span> ONLINE MODEL · CHAT HISTORY IS SESSION-ONLY</div>
      </div>
    </section>
    <nav className="section-nav" aria-label="Portfolio sections">
      {sections.map((section, i) => {
        const questions: Record<Section, string> = {
          Me: "Tell me about yourself.",
          Projects: "Tell me about your projects.",
          Skills: "What are your software development skills?",
          Fun: "What do you enjoy outside software development?",
          Contact: "How can people contact you or collaborate with you?"
        };;
        return (
          <button
            key={section}
            onClick={() => {
              setActive(section);
              setMessages([]);
              setQuestion("");
              ask(questions[section], true);
            }}
            className={active === section ? "nav-item active" : "nav-item"}
            aria-current={active === section ? "page" : undefined}
          >
            <span className="nav-number">0{i + 1}</span>
            {section}
          </button>
        );
      })}
    </nav>
    <footer className="bottom-footer"><span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span><span>MADE WITH CURIOSITY IN RWANDA</span></footer>
  </main>;
}
export default App;
