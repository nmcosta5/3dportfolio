import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowDownRight, ArrowUpRight, Github,
  Menu, X, Code2, Layers3, Globe2, Sparkles,
  Terminal, ExternalLink, MapPin, GraduationCap
} from "lucide-react";

const projects = [
  {
    number: "01",
    name: "Agasobanuye Free",
    type: "Entertainment platform",
    description: "A platform experience designed to make discovering movies, series and local entertainment easier.",
    stack: ["React", "TypeScript", "Supabase"],
    link: "https://github.com/nmcosta5/Agsobanuye-New",
    tone: "project-amber",
    mark: "A."
  },
  {
    number: "02",
    name: "Expense Tracker",
    type: "Personal finance",
    description: "A clean financial dashboard for tracking spending, understanding habits and staying in control of a budget.",
    stack: ["React", "TypeScript"],
    link: "https://github.com/nmcosta5",
    tone: "project-green",
    mark: "₣"
  },
  {
    number: "03",
    name: "XM Bakery",
    type: "Business website",
    description: "A modern digital storefront concept focused on clear product presentation and a smooth browsing experience.",
    stack: ["React", "TypeScript"],
    link: "https://github.com/nmcosta5",
    tone: "project-rose",
    mark: "XM"
  },
  {
    number: "04",
    name: "Cooperative",
    type: "Management platform",
    description: "A web application concept that brings useful cooperative workflows and information into one place.",
    stack: ["React", "TypeScript"],
    link: "https://github.com/nmcosta5",
    tone: "project-blue",
    mark: "CO"
  }
];

const skills = [
  { label: "Frontend", items: ["React", "TypeScript", "JavaScript", "HTML & CSS", "Responsive UI"], icon: Code2 },
  { label: "Backend", items: ["Node.js", "REST APIs", "Supabase", "Database design"], icon: Terminal },
  { label: "Tools & workflow", items: ["Git & GitHub", "Vite", "VS Code", "Figma"], icon: Layers3 }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "about", "work", "skills", "contact"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const navItems = ["about", "work", "skills", "contact"];

  return (
    <main>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Nzabana Merci home">
          <span className="brand-mark">N<span>.</span></span>
          <span className="brand-name">NZABANA MERCI</span>
        </a>
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={menuOpen ? "navigation navigation-open" : "navigation"}>
          {navItems.map((item) => (
            <a key={item} className={activeSection === item ? "nav-link active" : "nav-link"} href={`#${item}`} onClick={closeMenu}>
              {item}
            </a>
          ))}
          <a className="nav-cta" href="https://github.com/nmcosta5" target="_blank" rel="noreferrer">Let's talk <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <section className="hero section-shell" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> AVAILABLE FOR OPPORTUNITIES <span className="eyebrow-line" /></div>
          <h1>Building digital<br />things with <span className="serif-accent">purpose.</span></h1>
          <p className="hero-description">I'm <strong>Nzabana Merci</strong> — a full-stack software developer passionate about turning thoughtful ideas into useful, beautifully crafted experiences.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore my work <ArrowDownRight size={17} /></a>
            <a className="text-link" href="#about">More about me <ArrowDown size={15} /></a>
          </div>
          <div className="hero-meta">
            <span><MapPin size={14} /> Rwanda</span>
            <span className="meta-divider" />
            <span><GraduationCap size={15} /> Student developer · Class of 2027</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Abstract 3D portfolio artwork">
          <div className="visual-grid" />
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="orbit orbit-c" />
          <div className="core-object"><span>N</span><i /></div>
          <div className="float-card float-card-top"><Sparkles size={15} /><span>Curiosity → creation</span></div>
          <div className="float-card float-card-bottom"><span className="mini-code">{"</>"}</span><span>Design. Develop. Deliver.</span></div>
          <span className="visual-index">FIG. 001 / CREATIVE ENGINEERING</span>
        </div>
        <a className="scroll-cue" href="#about"><span /> SCROLL TO EXPLORE</a>
      </section>

      <section className="intro-strip">
        <div className="section-shell strip-inner">
          <span className="strip-label">A LITTLE ABOUT MY APPROACH</span>
          <p>Good software should feel <em>simple</em> to use, even when the thinking behind it is complex.</p>
          <span className="strip-symbol">✳</span>
        </div>
      </section>

      <section className="section-shell about-section" id="about">
        <div className="section-kicker"><span>01</span> / THE PERSON BEHIND THE PIXELS</div>
        <div className="about-grid">
          <div>
            <h2>Curious by nature.<br /><span className="serif-accent">Builder</span> by choice.</h2>
          </div>
          <div className="about-copy">
            <p className="large-copy">I enjoy the process of taking an idea from a rough sketch to a working product — solving problems, learning new tools and sweating the details that make an experience feel right.</p>
            <p>I'm currently studying at Giheke TSS in Rwanda, where I'm developing my foundation in software development. My focus is on modern web technologies, practical problem-solving and building projects that have a real purpose.</p>
            <div className="trait-list"><span>Hardworking</span><span>Curious</span><span>Disciplined</span></div>
            <a className="inline-link" href="https://github.com/nmcosta5" target="_blank" rel="noreferrer">Explore my GitHub <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-shell">
          <div className="section-heading">
            <div><div className="section-kicker"><span>02</span> / SELECTED WORK</div><h2>Ideas made <span className="serif-accent">tangible.</span></h2></div>
            <p>A selection of projects and experiments that reflect what I enjoy building.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article className={`project-card ${project.tone}`} key={project.number}>
                <div className="project-top"><span>PROJECT / {project.number}</span><a href={project.link} target="_blank" rel="noreferrer" aria-label={`View ${project.name} on GitHub`}><ArrowUpRight size={18} /></a></div>
                <div className="project-art"><div className="art-orbit" /><div className="art-mark">{project.mark}</div><span className="art-caption">DIGITAL / EXPERIENCE</span></div>
                <div className="project-info"><span className="project-type">{project.type}</span><h3>{project.name}</h3><p>{project.description}</p><div className="tag-row">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
              </article>
            ))}
          </div>
          <div className="work-footer"><span>MORE EXPERIMENTS & CODE</span><a href="https://github.com/nmcosta5?tab=repositories" target="_blank" rel="noreferrer">View GitHub repositories <ArrowUpRight size={16} /></a></div>
        </div>
      </section>

      <section className="section-shell skills-section" id="skills">
        <div className="section-kicker"><span>03</span> / THE TOOLKIT</div>
        <div className="section-heading skills-heading"><h2>Tools for turning<br /><span className="serif-accent">ideas into impact.</span></h2><p>My toolkit keeps evolving. These are the technologies I currently work with and continue to deepen my understanding of.</p></div>
        <div className="skills-grid">
          {skills.map(({ label, items, icon: Icon }, index) => (
            <div className="skill-card" key={label}><div className="skill-card-top"><span>0{index + 1}</span><Icon size={21} /></div><h3>{label}</h3><div className="skill-items">{items.map((item) => <span key={item}>{item}</span>)}</div></div>
          ))}
        </div>
        <div className="principle"><Globe2 size={19} /><p>Always learning. Always building. Always looking for a better way.</p></div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-inner">
          <div className="section-kicker"><span>04</span> / YOUR NEXT IDEA STARTS HERE</div>
          <p className="contact-overline">HAVE A PROJECT IN MIND?</p>
          <h2>Let's make<br /><span className="serif-accent">something matter.</span></h2>
          <a className="contact-email" href="https://github.com/nmcosta5" target="_blank" rel="noreferrer">github.com/nmcosta5 <ArrowUpRight size={22} /></a>
          <div className="contact-actions"><a className="button button-primary" href="https://github.com/nmcosta5" target="_blank" rel="noreferrer"><Github size={16} /> Connect on GitHub <ExternalLink size={13} /></a></div>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <a className="brand" href="#home"><span className="brand-mark">N<span>.</span></span><span className="brand-name">NZABANA MERCI</span></a>
        <span className="footer-note">DESIGNED WITH INTENTION · BUILT WITH CURIOSITY</span>
        <div className="social-links"><a href="https://github.com/nmcosta5" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a><a href="https://nzabana.vercel.app/" target="_blank" rel="noreferrer" aria-label="Portfolio website"><Globe2 size={17} /></a></div>
        <span className="copyright">© {new Date().getFullYear()} NZABANA MERCI</span>
      </footer>
    </main>
  );
}

export default App;