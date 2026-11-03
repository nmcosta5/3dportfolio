import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, Github, Menu, X, Code2, Layers3,
  Globe2, Sparkles, Terminal, ExternalLink, MapPin, GraduationCap,
  BriefcaseBusiness, Award, UserRound, Filter, Linkedin
} from "lucide-react";

const projects = [
  { number: "01", date: "2026", name: "Agasobanuye Free", type: "Entertainment platform", description: "A platform concept for discovering movies, series and local entertainment, with a focus on a clean browsing experience.", stack: ["React", "TypeScript", "Supabase"], link: "https://github.com/nmcosta5/Agsobanuye-New", tone: "project-amber", mark: "A." },
  { number: "02", date: "2026", name: "Expense Tracker", type: "Personal finance", description: "A simple finance experience for recording expenses, understanding spending habits and keeping a budget in view.", stack: ["React", "TypeScript"], link: "https://github.com/nmcosta5?tab=repositories", tone: "project-green", mark: "₣" },
  { number: "03", date: "2026", name: "XM Bakery", type: "Business website", description: "A modern storefront concept with thoughtful product presentation and a responsive browsing experience.", stack: ["React", "TypeScript"], link: "https://github.com/nmcosta5?tab=repositories", tone: "project-rose", mark: "XM" },
  { number: "04", date: "2026", name: "Cooperative", type: "Management platform", description: "A web application concept exploring how useful cooperative workflows and information can be brought together.", stack: ["React", "TypeScript"], link: "https://github.com/nmcosta5?tab=repositories", tone: "project-blue", mark: "CO" }
];

const skillGroups = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "HTML", "CSS"] },
  { category: "Frontend", items: ["React", "Responsive UI", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "REST APIs", "Supabase"] },
  { category: "Databases", items: ["MySQL", "MongoDB", "PostgreSQL"] },
  { category: "Tools", items: ["Git", "GitHub", "Vite", "VS Code"] }
];
const filters = ["All", ...skillGroups.map(group => group.category)];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [activeFilter, setActiveFilter] = useState("All");
  const visibleSkills = useMemo(() => activeFilter === "All" ? skillGroups : skillGroups.filter(group => group.category === activeFilter), [activeFilter]);

  useEffect(() => {
    const ids = ["home", "about", "experience", "projects", "skills", "learning", "profiles", "contact"];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setActiveSection(entry.target.id);
    }), { rootMargin: "-32% 0px -58% 0px" });
    ids.forEach(id => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const navItems = ["About", "Experience", "Projects", "Skills", "Learning", "Profiles", "Contact"];

  return (
    <main>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Nzabana Merci home"><span className="brand-mark">N<span>.</span></span><span className="brand-name">NZABANA MERCI</span></a>
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <nav className={menuOpen ? "navigation navigation-open" : "navigation"}>
          {navItems.map(item => <a key={item} className={activeSection === item.toLowerCase() ? "nav-link active" : "nav-link"} href={`#${item.toLowerCase()}`} onClick={closeMenu}>{item}</a>)}
          <a className="nav-cta" href="https://github.com/nmcosta5" target="_blank" rel="noreferrer">Let's connect <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <section className="hero section-shell" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> SOFTWARE DEVELOPER IN THE MAKING <span className="eyebrow-line" /></div>
          <h1>Turning ideas<br />into <span className="serif-accent">digital reality.</span></h1>
          <p className="hero-description">Hello, I'm <strong>Nzabana Merci</strong> — a student developer from Rwanda who enjoys building useful, intuitive web experiences with modern technologies.</p>
          <div className="hero-actions"><a className="button button-primary" href="#projects">Explore my work <ArrowDownRight size={17} /></a><a className="text-link" href="https://github.com/nmcosta5" target="_blank" rel="noreferrer">View GitHub <ArrowUpRight size={15} /></a></div>
          <div className="hero-meta"><span><MapPin size={14} /> Rwanda</span><span className="meta-divider" /><span><GraduationCap size={15} /> Giheke TSS · Class of 2027</span></div>
        </div>
        <div className="hero-visual" aria-label="Abstract 3D portfolio artwork"><div className="visual-grid" /><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" /><div className="core-object"><span>N</span><i /></div><div className="float-card float-card-top"><Sparkles size={15} /><span>Curiosity → creation</span></div><div className="float-card float-card-bottom"><span className="mini-code">{"</>"}</span><span>Learn. Build. Improve.</span></div><span className="visual-index">FIG. 001 / CREATIVE ENGINEERING</span></div>
        <a className="scroll-cue" href="#about"><span /> SCROLL TO EXPLORE</a>
      </section>

      <section className="intro-strip"><div className="section-shell strip-inner"><span className="strip-label">MY DEVELOPMENT PHILOSOPHY</span><p>Build with purpose. Keep it <em>simple, useful and human.</em></p><span className="strip-symbol">✳</span></div></section>

      <section className="section-shell about-section" id="about">
        <div className="section-kicker"><span>01</span> / ABOUT ME — BEHIND THE CODE</div>
        <div className="about-grid"><div><h2>Curious by nature.<br /><span className="serif-accent">Builder</span> by choice.</h2></div><div className="about-copy"><p className="large-copy">I enjoy taking an idea from a rough sketch to a working product — solving problems, learning new tools and refining the details that make an experience feel right.</p><p>I'm currently studying at Giheke TSS in Rwanda, building my foundation in software development. I’m especially interested in full-stack web development, practical problem-solving and creating digital products that solve real needs.</p><div className="trait-list"><span>Hardworking</span><span>Curious</span><span>Disciplined</span></div><a className="inline-link" href="https://github.com/nmcosta5" target="_blank" rel="noreferrer">Explore my GitHub <ArrowUpRight size={15} /></a></div></div>
      </section>

      <section className="experience-section" id="experience"><div className="section-shell">
        <div className="section-kicker"><span>02</span> / EXPERIENCE & EDUCATION</div><div className="section-heading"><div><h2>My learning <span className="serif-accent">journey.</span></h2></div><p>My path so far is built around education, hands-on practice and learning by making.</p></div>
        <div className="timeline">
          <article className="timeline-item"><div className="timeline-index">01</div><div className="timeline-date">CURRENT · 2027 GRADUATION</div><div className="timeline-content"><span className="timeline-kind"><GraduationCap size={14}/> EDUCATION</span><h3>Giheke TSS</h3><p>Advanced Level student developing practical skills in software development and strengthening foundations in web technologies.</p><div className="tag-row"><span>Software Development</span><span>TVET</span><span>Rwanda</span></div></div></article>
          <article className="timeline-item"><div className="timeline-index">02</div><div className="timeline-date">ONGOING</div><div className="timeline-content"><span className="timeline-kind"><BriefcaseBusiness size={14}/> INDEPENDENT DEVELOPMENT</span><h3>Personal projects & practice</h3><p>Building and iterating on web applications to apply what I learn, explore full-stack workflows and develop a stronger engineering mindset.</p><div className="tag-row"><span>React</span><span>TypeScript</span><span>Node.js</span></div></div></article>
        </div>
      </div></section>

      <section className="work-section" id="projects"><div className="section-shell">
        <div className="section-heading"><div><div className="section-kicker"><span>03</span> / PROJECTS SHOWCASE</div><h2>Ideas made <span className="serif-accent">tangible.</span></h2></div><p>A selection of projects and experiments that reflect what I enjoy building.</p></div>
        <div className="project-grid">{projects.map(project => <article className={`project-card ${project.tone}`} key={project.number}><div className="project-top"><span>{project.date} · PROJECT {project.number}</span><a href={project.link} target="_blank" rel="noreferrer" aria-label={`View ${project.name} on GitHub`}><ArrowUpRight size={18}/></a></div><div className="project-art"><div className="art-orbit"/><div className="art-mark">{project.mark}</div><span className="art-caption">DIGITAL / EXPERIENCE</span></div><div className="project-info"><span className="project-type">{project.type}</span><h3>{project.name}</h3><p>{project.description}</p><div className="tag-row">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}</div>
        <div className="work-footer"><span>MORE EXPERIMENTS & CODE</span><a href="https://github.com/nmcosta5?tab=repositories" target="_blank" rel="noreferrer">View all repositories <ArrowUpRight size={16}/></a></div>
      </div></section>

      <section className="section-shell skills-section" id="skills"><div className="section-kicker"><span>04</span> / TECHNICAL SKILLS — CORE EXPERTISE</div><div className="section-heading skills-heading"><h2>My developer <span className="serif-accent">toolkit.</span></h2><p>Technologies I use in projects and continue to develop through hands-on practice.</p></div>
        <div className="skill-filter"><span><Filter size={14}/> FILTER BY CATEGORY</span><div>{filters.map(filter => <button key={filter} className={activeFilter === filter ? "filter-chip selected" : "filter-chip"} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div></div>
        <div className="skills-grid skills-filter-grid">{visibleSkills.map((group,index) => <div className="skill-card" key={group.category}><div className="skill-card-top"><span>0{index+1}</span><Code2 size={21}/></div><h3>{group.category}</h3><div className="skill-items">{group.items.map(item => <span key={item}>{item}</span>)}</div></div>)}</div>
        <div className="principle"><Globe2 size={19}/><p>Always learning. Always building. Always looking for a better way.</p></div>
      </section>

      <section className="learning-section" id="learning"><div className="section-shell"><div className="section-kicker"><span>05</span> / LEARNING MILESTONES</div><div className="learning-card"><div className="learning-icon"><Award size={24}/></div><div><span className="project-type">A CONTINUOUS JOURNEY</span><h2>Learning never <span className="serif-accent">stops.</span></h2><p>I'm currently focused on strengthening my software development fundamentals through coursework, independent projects and consistent practice. This section will grow as I complete verifiable courses, certifications and milestones.</p></div><span className="learning-stamp">IN PROGRESS<br/>2026—2027</span></div></div></section>

      <section className="profiles-section" id="profiles"><div className="section-shell"><div className="section-kicker"><span>06</span> / WEB PRESENCE — DEVELOPER NETWORK</div><div className="section-heading"><h2>Find me <span className="serif-accent">online.</span></h2><p>Explore my code, projects and ongoing work across the web.</p></div><div className="profile-grid"><a className="profile-card" href="https://github.com/nmcosta5" target="_blank" rel="noreferrer"><span className="profile-icon"><Github size={23}/></span><span className="profile-label">CODE & OPEN SOURCE</span><h3>GitHub</h3><p>@nmcosta5</p><ArrowUpRight size={18} className="profile-arrow"/></a><a className="profile-card" href="https://nzabana.vercel.app/" target="_blank" rel="noreferrer"><span className="profile-icon"><Globe2 size={23}/></span><span className="profile-label">PERSONAL WEBSITE</span><h3>Portfolio</h3><p>nzabana.vercel.app</p><ArrowUpRight size={18} className="profile-arrow"/></a></div></div></section>

      <section className="contact-section" id="contact"><div className="section-shell contact-inner"><div className="section-kicker"><span>07</span> / GET IN TOUCH — LET'S CONNECT</div><p className="contact-overline">HAVE AN IDEA OR WANT TO COLLABORATE?</p><h2>Let's build<br/><span className="serif-accent">something meaningful.</span></h2><p className="contact-intro">I'm open to connecting with fellow developers, learning from others and exploring meaningful project opportunities.</p><a className="contact-email" href="https://github.com/nmcosta5" target="_blank" rel="noreferrer">Connect with me on GitHub <ArrowUpRight size={22}/></a><div className="contact-actions"><a className="button button-primary" href="https://github.com/nmcosta5" target="_blank" rel="noreferrer"><Github size={16}/> Send me a message <ExternalLink size={13}/></a></div></div></section>

      <footer className="site-footer section-shell"><a className="brand" href="#home"><span className="brand-mark">N<span>.</span></span><span className="brand-name">NZABANA MERCI</span></a><span className="footer-note">INNOVATION THROUGH CURIOSITY & CODE</span><div className="social-links"><a href="https://github.com/nmcosta5" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17}/></a><a href="https://nzabana.vercel.app/" target="_blank" rel="noreferrer" aria-label="Portfolio"><Globe2 size={17}/></a></div><span className="copyright">© {new Date().getFullYear()} NZABANA MERCI</span></footer>
    </main>
  );
}
export default App;
