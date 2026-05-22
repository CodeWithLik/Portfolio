import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

// ── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(words, speed = 100, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx((c) => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx((w) => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx((c) => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ── Intersection Observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["About", "Skills", "Projects", "Experience", "Contact"];

const SKILLS = {
  Frontend: [
    { name: "HTML5", icon: "🌐" }, { name: "CSS3", icon: "🎨" },
    { name: "JavaScript", icon: "⚡" }, { name: "React", icon: "⚛️" },
    { name: "Tailwind CSS", icon: "💨" }, { name: "Bootstrap", icon: "🅱️" },
  ],
  Tools: [
    { name: "Git & GitHub", icon: "🐙" }, { name: "Figma", icon: "🖌️" },
    { name: "VS Code", icon: "💻" }, { name: "npm", icon: "📦" },
  ],
  Other: [
    { name: "Responsive Design", icon: "📱" }, { name: "API Integration", icon: "🔗" },
    { name: "UI/UX Design", icon: "✨" }, { name: "REST APIs", icon: "🛠️" },
  ],
};

const PROJECTS = [
  {
    title: "AI Resume Analyzer",
    desc: "An intelligent resume matching system that analyzes skill gaps between a candidate's resume and job descriptions. Features keyword extraction and match scoring.",
    tech: ["Python", "React", "NLP", "REST API"],
    emoji: "🤖",
    color: "#00d4ff",
    github: "https://github.com/Mahred1/JobSeek.AI",
  },
  {
    title: "Flower Shop Website",
    desc: "A responsive e-commerce style UI for a flower shop. Features product gallery, cart, and smooth animations with a clean, modern aesthetic.",
    tech: ["HTML", "CSS", "JavaScript"],
    emoji: "🌸",
    color: "#ff6b9d",
    github: "https://github.com/CodeWithLik/E-Commerce_FlowerShop_Website",
  },
  {
    title: "Listing App",
    desc: "A full-featured listing application for browsing, searching, and filtering items. Includes category filters, search functionality, and a clean card-based layout.",
    tech: ["React", "CSS", "JavaScript"],
    emoji: "📋",
    color: "#06d6a0",
    github: "https://github.com/CodeWithLik/alx-listing-app",
  },
];

const EXPERIENCES = [
  {
    type: "Education",
    title: "BSc Computer Science & Engineering",
    place: "Adama Science & Technology University (ASTU)",
    period: "2022 – 2027 (Expected)",
    desc: "4th year student specializing in software engineering with focus on frontend development and web technologies.",
    icon: "🎓",
  },
  {
    type: "Experience",
    title: "Frontend Developer",
    place: "Freelance / Personal Projects",
    period: "2023 – Present",
    desc: "Designed and developed multiple web applications for clients and personal use, focusing on responsive UI and clean user experience.",
    icon: "💼",
  },
  {
    type: "Experience",
    title: "Team Project Lead",
    place: "ASTU — Integrated Engineering Team Project",
    period: "2026",
    desc: "Led a team of 10 developers in building the AI Resume Analyzer system. Managed frontend architecture and API integration.",
    icon: "👨‍💻",
  },
];

// ── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Dark theme (default) ── */
  :root {
    --bg: #080b12;
    --bg2: #0d1117;
    --bg3: #111827;
    --surface: #161d2b;
    --border: rgba(255,255,255,0.07);
    --text: #e8edf5;
    --text2: #8892a4;
    --accent: #00d4ff;
    --accent2: #a855f7;
    --accent3: #ff6b9d;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --shadow: rgba(0,0,0,0.3);
    --hero-grid-opacity: 0.03;
  }

  /* ── Light theme ── */
  :root.light {
    --bg: #f0f4f8;
    --bg2: #e8edf5;
    --bg3: #dde3ee;
    --surface: #ffffff;
    --border: rgba(0,0,0,0.08);
    --text: #0d1117;
    --text2: #4a5568;
    --accent: #0099bb;
    --accent2: #7c3aed;
    --accent3: #e91e8c;
    --shadow: rgba(0,0,0,0.1);
    --hero-grid-opacity: 0.04;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-mono);
    overflow-x: hidden;
    transition: background 0.3s, color 0.3s;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  /* Scroll progress bar */
  #scroll-progress {
    position: fixed; top: 0; left: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    z-index: 9999; transition: width 0.1s;
  }

  /* Nav */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 6%;
    background: rgba(8, 11, 18, 0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    transition: all 0.3s;
  }
  :root.light nav {
    background: rgba(240, 244, 248, 0.88);
  }
  .nav-logo {
    font-family: var(--font-display); font-size: 1.3rem; font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.03em;
  }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    color: var(--text2); text-decoration: none; font-size: 0.82rem;
    letter-spacing: 0.08em; text-transform: uppercase;
    transition: color 0.2s; position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1px; background: var(--accent); transform: scaleX(0);
    transition: transform 0.2s; transform-origin: left;
  }
  .nav-links a:hover { color: var(--accent); }
  .nav-links a:hover::after { transform: scaleX(1); }
  .nav-mobile-btn { display: none; background: none; border: none; color: var(--text); cursor: pointer; font-size: 1.4rem; }

  /* Theme toggle button */
  .theme-toggle {
    width: 40px; height: 40px; border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text2);
    cursor: pointer; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .theme-toggle:hover {
    border-color: var(--accent); color: var(--accent);
    background: rgba(0,212,255,0.05);
    transform: rotate(20deg);
  }
  .nav-right { display: flex; align-items: center; gap: 1.5rem; }

  /* Hero */
  #hero {
    min-height: 100vh; display: flex; align-items: center;
    padding: 6rem 6% 4rem; position: relative; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0; opacity: var(--hero-grid-opacity);
    background-image: linear-gradient(var(--accent) 1px, transparent 1px),
      linear-gradient(90deg, var(--accent) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .hero-glow {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%);
    top: 10%; right: -10%; pointer-events: none;
  }
  .hero-glow2 {
    position: absolute; width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%);
    bottom: 15%; left: -5%; pointer-events: none;
  }

  /* Two-column split */
  .hero-split {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: center; width: 100%; position: relative; z-index: 1;
  }
  .hero-left { display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
  .hero-right { display: flex; align-items: center; justify-content: center; }

  .hero-tag {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent); border: 1px solid rgba(0,212,255,0.2);
    padding: 0.4rem 1rem; border-radius: 20px; margin-bottom: 1.5rem;
    width: fit-content;
  }
  .hero-tag span { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 1.5s infinite; }
  .hero-name {
    font-family: var(--font-display); font-size: clamp(2.6rem, 5vw, 5rem);
    font-weight: 800; line-height: 1.2; letter-spacing: -0.04em;
    margin-bottom: 0.3rem;
  }
  .hero-name .first { color: var(--text); display: block; }
  .hero-name .last {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; display: block;
    padding-bottom: 0.25em; margin-bottom: -0.1em;
  }
  .hero-role {
    font-family: var(--font-mono); font-size: clamp(0.9rem, 2vw, 1.2rem);
    color: var(--text2); margin: 1rem 0 0.5rem;
  }
  .hero-cursor {
    display: inline-block; width: 2px; height: 1.2em;
    background: var(--accent); margin-left: 3px;
    animation: blink 1s steps(1) infinite; vertical-align: text-bottom;
  }
  .hero-desc {
    color: var(--text2); line-height: 1.8;
    font-size: 0.92rem; margin: 1.5rem 0 2.5rem; max-width: 440px;
  }
  .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.85rem 2rem; border-radius: 6px; font-family: var(--font-mono);
    font-size: 0.85rem; letter-spacing: 0.05em; cursor: pointer;
    text-decoration: none; transition: all 0.25s; font-weight: 500;
  }
  .btn-primary {
    background: var(--accent); color: #fff;
    border: 1px solid var(--accent);
  }
  .btn-primary:hover { background: transparent; color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,212,255,0.2); }
  .btn-secondary {
    background: transparent; color: var(--text);
    border: 1px solid var(--border);
  }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }
  .btn-ghost {
    background: transparent; color: var(--text2);
    border: 1px solid var(--border); font-size: 0.8rem; padding: 0.7rem 1.4rem;
  }
  .btn-ghost:hover { color: var(--text); border-color: var(--text2); }
  .hero-social { display: flex; gap: 1rem; margin-top: 2.5rem; }
  .social-icon {
    width: 38px; height: 38px; border-radius: 8px; border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--text2); text-decoration: none; font-size: 0.9rem;
    transition: all 0.2s;
  }
  .social-icon:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,212,255,0.05); }
  .hero-scroll {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    color: var(--text2); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    animation: float 2s ease-in-out infinite;
  }
  .hero-scroll::after {
    content: ''; width: 1px; height: 40px;
    background: linear-gradient(to bottom, var(--accent), transparent);
  }

  /* Hero image / photo frame */
  .hero-photo-wrap { position: relative; width: 340px; height: 400px; }
  .hero-photo-wrap::before {
    content: ''; position: absolute; inset: -12px;
    border-radius: 24px; border: 1px solid rgba(0,212,255,0.15);
    animation: spin-slow 25s linear infinite;
  }
  .hero-photo-wrap::after {
    content: ''; position: absolute; top: 16px; left: 16px; right: -16px; bottom: -16px;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(168,85,247,0.08));
    z-index: 0;
  }
  .hero-photo-frame {
    position: relative; z-index: 1;
    width: 100%; height: 100%; border-radius: 20px; overflow: hidden;
    border: 1px solid var(--border);
    background: var(--surface);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 1rem;
  }
  .hero-photo-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hero-photo-placeholder {
    display: flex; flex-direction: column; align-items: center; gap: 0.8rem;
    padding: 2rem; text-align: center;
  }
  .hero-photo-placeholder .ph-icon { font-size: 4rem; opacity: 0.4; }
  .hero-photo-placeholder p { font-size: 0.78rem; color: var(--text2); line-height: 1.6; opacity: 0.7; }
  .hero-photo-placeholder code {
    display: block; margin-top: 0.4rem; font-size: 0.72rem;
    color: var(--accent); background: rgba(0,212,255,0.08);
    padding: 0.3rem 0.6rem; border-radius: 4px;
  }
  .hero-badge {
    position: absolute; bottom: -18px; right: -18px; z-index: 2;
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 12px; padding: 0.8rem 1.1rem;
    display: flex; align-items: center; gap: 0.6rem;
    box-shadow: 0 8px 30px var(--shadow);
  }
  .hero-badge-icon { font-size: 1.4rem; }
  .hero-badge-text { font-size: 0.72rem; }
  .hero-badge-text strong { display: block; color: var(--text); font-family: var(--font-display); }
  .hero-badge-text span { color: var(--text2); }
  .hero-badge2 {
    position: absolute; top: -18px; left: -18px; z-index: 2;
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 12px; padding: 0.7rem 1rem;
    display: flex; align-items: center; gap: 0.5rem;
    box-shadow: 0 8px 30px var(--shadow); font-size: 0.72rem;
  }
  .hero-badge2 span { color: var(--accent); font-weight: 600; }
  .hero-badge2 em { color: var(--text2); font-style: normal; }

  /* Sections */
  section { padding: 6rem 6%; }
  .section-label {
    font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 0.8rem; font-weight: 500;
    text-align: center;
  }
  .section-title {
    font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800; letter-spacing: -0.03em; line-height: 1.2;
    margin-bottom: 1rem; padding-bottom: 0.15em;
    text-align: center;
  }
  .section-line { width: 40px; height: 2px; background: var(--accent); margin-bottom: 3rem; margin-left: auto; margin-right: auto; }

  /* Fade in */
  .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }

  /* About */
  #about .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .about-text p { color: var(--text2); line-height: 1.9; font-size: 0.92rem; margin-bottom: 1.2rem; }
  .about-text p strong { color: var(--accent); font-weight: 500; }
  .about-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.2rem; text-align: center;
    box-shadow: 0 2px 12px var(--shadow);
  }
  .stat-num {
    font-family: var(--font-display); font-size: 2rem; font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; display: inline-block;
    line-height: 1.2; padding-bottom: 0.15em;
  }
  .stat-label { font-size: 0.72rem; color: var(--text2); margin-top: 0.3rem; letter-spacing: 0.05em; }
  .about-visual { display: flex; align-items: center; justify-content: center; }
  .avatar-ring {
    width: 280px; height: 280px; border-radius: 50%;
    border: 1px solid rgba(0,212,255,0.2);
    display: flex; align-items: center; justify-content: center;
    position: relative;
    background: radial-gradient(circle at 30% 30%, rgba(0,212,255,0.08), transparent 60%);
    animation: spin-slow 20s linear infinite;
  }
  .avatar-ring::before {
    content: ''; position: absolute; inset: -15px; border-radius: 50%;
    border: 1px dashed rgba(0,212,255,0.1);
    animation: spin-slow 15s linear infinite reverse;
  }
  .avatar-inner {
    width: 220px; height: 220px; border-radius: 50%;
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 5rem; animation: spin-slow 20s linear infinite reverse;
  }
  .orbit-dot { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); }
  .orbit-dot:nth-child(1) { top: -5px; left: 50%; transform: translateX(-50%); }
  .orbit-dot:nth-child(2) { bottom: -5px; left: 50%; transform: translateX(-50%); background: var(--accent2); box-shadow: 0 0 10px var(--accent2); }
  .orbit-dot:nth-child(3) { left: -5px; top: 50%; transform: translateY(-50%); background: var(--accent3); box-shadow: 0 0 10px var(--accent3); }

  /* Skills */
  #skills { background: var(--bg2); }
  .skills-tabs { display: flex; gap: 0.5rem; margin-bottom: 2.5rem; }
  .tab-btn {
    padding: 0.5rem 1.2rem; border-radius: 20px; border: 1px solid var(--border);
    background: none; color: var(--text2); font-family: var(--font-mono);
    font-size: 0.8rem; cursor: pointer; letter-spacing: 0.05em; transition: all 0.2s;
  }
  .tab-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 500; }
  .tab-btn:hover:not(.active) { border-color: var(--accent); color: var(--accent); }
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
  .skill-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.2rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
    transition: all 0.25s; cursor: default;
    box-shadow: 0 2px 8px var(--shadow);
  }
  .skill-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,212,255,0.1); }
  .skill-icon { font-size: 1.8rem; }
  .skill-name { font-size: 0.82rem; color: var(--text2); text-align: center; }

  /* Projects */
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
  .project-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; overflow: visible; transition: all 0.3s;
    position: relative; box-shadow: 0 2px 12px var(--shadow);
  }
  .project-card:hover { transform: translateY(-6px); border-color: rgba(0,212,255,0.2); box-shadow: 0 20px 50px var(--shadow); }
  .project-top {
    height: 130px; display: flex; align-items: center; justify-content: center;
    font-size: 3.5rem; position: relative; overflow: hidden;
    border-radius: 14px 14px 0 0;
  }
  .project-top::before { content: ''; position: absolute; inset: 0; background: var(--pcolor, var(--accent)); opacity: 0.06; }
  .project-top::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 40px;
    background: linear-gradient(to top, var(--surface), transparent);
  }
  .project-body { padding: 1.2rem 1.4rem 1.4rem; }
  .project-title { font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; line-height: 1.4; padding-bottom: 0.1em; margin-bottom: 0.5rem; overflow: visible; }
  .project-desc { font-size: 0.82rem; color: var(--text2); line-height: 1.7; margin-bottom: 1rem; }
  .project-tech { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.2rem; }
  .tech-badge {
    font-size: 0.7rem; padding: 0.25rem 0.7rem; border-radius: 20px;
    background: rgba(0,212,255,0.08); color: var(--accent);
    border: 1px solid rgba(0,212,255,0.15); letter-spacing: 0.03em;
  }
  .project-links { display: flex; gap: 0.7rem; }
  .project-link {
    flex: 1; text-align: center; padding: 0.55rem; border-radius: 6px;
    border: 1px solid var(--border); color: var(--text2);
    text-decoration: none; font-size: 0.78rem; transition: all 0.2s; letter-spacing: 0.04em;
  }
  .project-link:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,212,255,0.04); }
  .project-link.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
  .project-link.primary:hover { background: transparent; color: var(--accent); }

  /* Experience */
  #experience { background: var(--bg2); }
  .timeline { position: relative; padding-left: 2rem; }
  .timeline::before {
    content: ''; position: absolute; left: 0; top: 8px; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, var(--accent), transparent);
  }
  .timeline-item { position: relative; margin-bottom: 2.5rem; }
  .timeline-dot {
    position: absolute; left: -2.4rem; top: 6px;
    width: 12px; height: 12px; border-radius: 50%; background: var(--accent);
    box-shadow: 0 0 12px var(--accent); border: 2px solid var(--bg);
  }
  .timeline-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.4rem; transition: border-color 0.2s;
    box-shadow: 0 2px 12px var(--shadow);
  }
  .timeline-card:hover { border-color: rgba(0,212,255,0.2); }
  .timeline-type { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.5rem; }
  .timeline-title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; line-height: 1.3; padding-bottom: 0.1em; margin-bottom: 0.2rem; }
  .timeline-meta { font-size: 0.8rem; color: var(--text2); margin-bottom: 0.8rem; }
  .timeline-meta span { color: var(--accent3); }
  .timeline-desc { font-size: 0.85rem; color: var(--text2); line-height: 1.7; }

  /* Contact */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
  .contact-info h3 { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; line-height: 1.3; padding-bottom: 0.1em; margin-bottom: 1rem; }
  .contact-info p { color: var(--text2); font-size: 0.9rem; line-height: 1.8; margin-bottom: 2rem; }
  .contact-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; color: var(--text2); font-size: 0.88rem; }
  .contact-icon {
    width: 36px; height: 36px; border-radius: 8px; background: var(--surface);
    border: 1px solid var(--border); display: flex; align-items: center;
    justify-content: center; font-size: 1rem; flex-shrink: 0;
  }
  .contact-icon i { font-size: 0.95rem; color: var(--accent); }
  .contact-item a { color: var(--text2); text-decoration: none; transition: color 0.2s; }
  .contact-item a:hover { color: var(--accent); }
  .form-group { margin-bottom: 1.2rem; }
  .form-label { display: block; font-size: 0.78rem; letter-spacing: 0.08em; color: var(--text2); margin-bottom: 0.5rem; text-transform: uppercase; }
  .form-input, .form-textarea {
    width: 100%; background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 0.85rem 1rem; color: var(--text);
    font-family: var(--font-mono); font-size: 0.88rem; outline: none;
    transition: border-color 0.2s, background 0.3s; resize: none;
  }
  .form-input:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-textarea { height: 120px; }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--text2); opacity: 0.5; }
  .form-success { color: var(--accent); font-size: 0.85rem; margin-top: 0.8rem; text-align: center; }

  /* Footer */
  footer {
    border-top: 1px solid var(--border); padding: 2rem 6%;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--bg);
  }
  .footer-copy { font-size: 0.8rem; color: var(--text2); }
  .footer-copy strong { color: var(--accent); }

  /* Animations */
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes float { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-8px); } }
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* Responsive */
  @media (max-width: 768px) {
    nav { padding: 1rem 5%; }
    .nav-links { display: none; }
    .nav-links.open { display: flex; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--bg); padding: 1.5rem 5%; border-bottom: 1px solid var(--border); gap: 1.2rem; }
    .nav-mobile-btn { display: block; }
    section { padding: 4rem 5%; }
    #about .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .about-visual { order: -1; }
    .avatar-ring { width: 200px; height: 200px; }
    .avatar-inner { width: 160px; height: 160px; font-size: 3.5rem; }
    .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .about-stats { grid-template-columns: repeat(3, 1fr); }
    footer { flex-direction: column; gap: 1rem; text-align: center; }
    .hero-btns { flex-direction: column; }
    .btn { justify-content: center; }
    .hero-split { grid-template-columns: 1fr; gap: 3rem; }
    .hero-left { align-items: center; text-align: center; }
    .hero-desc { text-align: center; }
    .hero-right { order: -1; }
    .hero-photo-wrap { width: 240px; height: 280px; }
    .hero-badge2 { top: -12px; left: -12px; }
    .hero-badge { bottom: -12px; right: -12px; }
    .theme-toggle { width: 34px; height: 34px; font-size: 0.9rem; }
  }
`;

// ── Components ───────────────────────────────────────────────────────────────
function Nav({ menuOpen, setMenuOpen, dark, toggleTheme }) {
  return (
    <nav>
      <div className="nav-logo">LT.</div>
      <ul className={`nav-links${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{l}</a>
          </li>
        ))}
      </ul>
      <div className="nav-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? "☀️" : "🌙"}
        </button>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  const typed = useTypewriter([
    "Frontend Developer",
    "React Enthusiast",
    "UI/UX Designer",
    "CSE Student at ASTU",
  ]);

  const PHOTO_SRC = "https://i.postimg.cc/SKPcDVVG/Chat-GPT-Image-May-22-2026-11-21-26-AM.png";

  return (
    <section id="hero">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-glow2" />

      <div className="hero-split">
        <div className="hero-left">
          <div className="hero-tag">
            <span /> Available for opportunities
          </div>
          <div className="hero-name">
            <div className="first">LIKANOS</div>
            <div className="last">TEGENE</div>
          </div>
          <div className="hero-role">
            &lt; {typed}<span className="hero-cursor" /> /&gt;
          </div>
          <p className="hero-desc">
            I build modern, responsive, and interactive web applications.
            Passionate about clean UI, smooth UX, and turning ideas into digital experiences.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn btn-primary">View Projects →</a>
            <a href="#contact" className="btn btn-secondary">Contact Me</a>
            <a href="/Likanos_CV.pdf" download className="btn btn-ghost">Download CV ↓</a>
          </div>
          <div className="hero-social">
            <a href="https://github.com/CodeWithLik" target="_blank" rel="noreferrer" className="social-icon" title="GitHub"><i className="fab fa-github" /></a>
            <a href="https://www.linkedin.com/in/likanos-tegene/" target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn"><i className="fab fa-linkedin" /></a>
            <a href="mailto:likanostegene@gmail.com" className="social-icon" title="Email"><i className="fas fa-envelope" /></a>
            <a href="tel:+251934019806" className="social-icon" title="Phone"><i className="fas fa-phone" /></a>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-photo-wrap">
            <div className="hero-badge2">
              <span>⚛️</span>
              <em>React Developer</em>
            </div>
            <div className="hero-photo-frame">
              {PHOTO_SRC ? (
                <img src={PHOTO_SRC} alt="Likanos Tegene" />
              ) : (
                <div className="hero-photo-placeholder">
                  <div className="ph-icon">🧑‍💻</div>
                  <p>Add your photo here.<code>PHOTO_SRC = "/me.jpg"</code></p>
                </div>
              )}
            </div>
            <div className="hero-badge">
              <div className="hero-badge-icon">🎓</div>
              <div className="hero-badge-text">
                <strong>ASTU</strong>
                <span>4th Year CSE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll">Scroll</div>
    </section>
  );
}

function About() {
  const [ref, inView] = useInView();
  return (
    <section id="about" ref={ref}>
      <div className={`fade-up${inView ? " visible" : ""}`}>
        <div className="section-label">// who I am</div>
        <div className="section-title">ABOUT ME</div>
        <div className="section-line" />
      </div>
      <div className="about-grid">
        <div className={`about-text fade-up${inView ? " visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
          <p>Hey! I'm <strong>Likanos Tegene</strong>, a 4th year Computer Science &amp; Engineering student at <strong>ASTU</strong> and a passionate frontend developer.</p>
          <p>I love crafting <strong>beautiful, responsive web interfaces</strong> that don't just look great — they feel great to use. My focus is on writing clean, efficient code and creating seamless user experiences.</p>
          <p>Currently diving deep into <strong>React, Tailwind CSS</strong>, and modern web animation. I've worked on projects ranging from AI-powered tools to e-commerce UIs, and I'm always looking to build something new.</p>
          <div className="about-stats">
            {[["3+", "Projects Built"], ["2+", "Years Coding"], ["4th", "Year Student"]].map(([n, l]) => (
              <div key={l} className="stat-card">
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`about-visual fade-up${inView ? " visible" : ""}`} style={{ transitionDelay: "0.3s" }}>
          <div className="avatar-ring">
            <div className="orbit-dot" />
            <div className="orbit-dot" />
            <div className="orbit-dot" />
            <div className="avatar-inner">👨‍💻</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [ref, inView] = useInView();
  const [activeTab, setActiveTab] = useState("Frontend");
  return (
    <section id="skills" ref={ref}>
      <div className={`fade-up${inView ? " visible" : ""}`}>
        <div className="section-label">// what I use</div>
        <div className="section-title">SKILLS</div>
        <div className="section-line" />
      </div>
      <div className={`skills-tabs fade-up${inView ? " visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
        {Object.keys(SKILLS).map((tab) => (
          <button key={tab} className={`tab-btn${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>
      <div className={`skills-grid fade-up${inView ? " visible" : ""}`} style={{ transitionDelay: "0.2s" }}>
        {SKILLS[activeTab].map((s) => (
          <div key={s.name} className="skill-card">
            <div className="skill-icon">{s.icon}</div>
            <div className="skill-name">{s.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const [ref, inView] = useInView();
  return (
    <section id="projects" ref={ref}>
      <div className={`fade-up${inView ? " visible" : ""}`}>
        <div className="section-label">// what I've built</div>
        <div className="section-title">PROJECTS</div>
        <div className="section-line" />
      </div>
      <div className={`projects-grid fade-up${inView ? " visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
        {PROJECTS.map((p) => (
          <div key={p.title} className="project-card">
            <div className="project-top" style={{ "--pcolor": p.color }}>{p.emoji}</div>
            <div className="project-body">
              <div className="project-title">{p.title}</div>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tech">
                {p.tech.map((t) => <span key={t} className="tech-badge">{t}</span>)}
              </div>
              <div className="project-links">
                <a href={p.github} target="_blank" rel="noreferrer" className="project-link primary" style={{ flex: "unset", width: "100%" }}>
                  <i className="fab fa-github" style={{ marginRight: "0.4rem" }} />View on GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  const [ref, inView] = useInView();
  return (
    <section id="experience" ref={ref}>
      <div className={`fade-up${inView ? " visible" : ""}`}>
        <div className="section-label">// my journey</div>
        <div className="section-title">EXPERIENCE</div>
        <div className="section-line" />
      </div>
      <div className={`timeline fade-up${inView ? " visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
        {EXPERIENCES.map((e) => (
          <div key={e.title} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-card">
              <div className="timeline-type">{e.icon} {e.type}</div>
              <div className="timeline-title">{e.title}</div>
              <div className="timeline-meta">{e.place} &nbsp;·&nbsp; <span>{e.period}</span></div>
              <div className="timeline-desc">{e.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [ref, inView] = useInView();
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const formRef = useRef(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");
    emailjs
      .sendForm(
        "service_6u61sxu",
        "template_lppngq8",
        formRef.current,
        "5B30nasbq9JNw2cX7"
      )
      .then(
        () => {
          setStatus("success");
          formRef.current.reset();
          setTimeout(() => setStatus("idle"), 5000);
        },
        (error) => {
          setStatus("error");
          console.error(error.text);
          setTimeout(() => setStatus("idle"), 5000);
        }
      );
  };

  return (
    <section id="contact" ref={ref}>
      <div className={`fade-up${inView ? " visible" : ""}`}>
        <div className="section-label">// let's talk</div>
        <div className="section-title">CONTACT</div>
        <div className="section-line" />
      </div>
      <div className={`contact-grid fade-up${inView ? " visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
        <div className="contact-info">
          <h3>Let us build an awesome creation with our united effort.</h3>
          <p>I'm currently open to internships, freelance projects, and full-time opportunities. Feel free to reach out!</p>
          <div className="contact-item">
            <div className="contact-icon"><i className="fas fa-envelope" /></div>
            <a href="mailto:likanostegene@gmail.com">likanostegene@gmail.com</a>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><i className="fas fa-phone" /></div>
            <a href="tel:+251934019806">+251 934 019 806</a>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><i className="fab fa-github" /></div>
            <a href="https://github.com/CodeWithLik" target="_blank" rel="noreferrer">github.com/CodeWithLik</a>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><i className="fab fa-linkedin" /></div>
            <a href="https://www.linkedin.com/in/likanos-tegene/" target="_blank" rel="noreferrer">linkedin.com/in/likanos-tegene</a>
          </div>
        </div>
        <form ref={formRef} onSubmit={sendEmail}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" name="user_name" placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="user_email" type="email" placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-textarea" name="message" placeholder="Your message..." required />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send Message →"}
          </button>
          {status === "success" && (
            <div className="form-success">✓ Message sent! I'll get back to you soon.</div>
          )}
          {status === "error" && (
            <div className="form-success" style={{ color: "var(--accent3)" }}>
              ✕ Failed to send. Please try again or email me directly.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Footer({ dark, toggleTheme }) {
  return (
    <footer>
      <div className="footer-copy">© 2026 <strong>Likanos Tegene</strong>. All Rights Reserved.</div>
      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
        <a href="https://github.com/CodeWithLik" target="_blank" rel="noreferrer" className="social-icon" title="GitHub" style={{ width: 32, height: 32 }}>
          <i className="fab fa-github" />
        </a>
        <a href="https://www.linkedin.com/in/likanos-tegene/" target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn" style={{ width: 32, height: 32 }}>
          <i className="fab fa-linkedin" />
        </a>
        <a href="tel:+251934019806" className="social-icon" title="Phone" style={{ width: 32, height: 32 }}>
          <i className="fas fa-phone" />
        </a>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          style={{ width: 32, height: 32, fontSize: "0.85rem" }}
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </footer>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [dark, setDark] = useState(true);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
  }, [dark]);

  // Persist preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setDark(false);
  }, []);

  const toggleTheme = () => {
    setDark((d) => {
      localStorage.setItem("theme", d ? "light" : "dark");
      return !d;
    });
  };

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setScrollPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{css}</style>
      <div id="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} dark={dark} toggleTheme={toggleTheme} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer dark={dark} toggleTheme={toggleTheme} />
    </>
  );
}