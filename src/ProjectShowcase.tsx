import { ArrowUpRight } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";

type Project = { name: string; desc: string; url: string; type: string; stack: string; shot: string };
function roundedTexture(source: THREE.Texture) {
  const image = source.image as HTMLImageElement;
  const canvas = document.createElement("canvas");
  const width = 1200, height = 760, radius = 54;
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  const scale = Math.max(width / image.width, height / image.height);
  const sw = width / scale, sh = height / scale;
  const sx = (image.width - sw) / 2, sy = (image.height - sh) / 2;
  ctx.beginPath(); ctx.roundRect(0, 0, width, height, radius); ctx.clip();
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
function ProjectCard({ project, index, count, selected, onSelect }: { project: Project; index: number; count: number; selected: boolean; onSelect: () => void }) {
  const source = useTexture(project.shot);
  const texture = useMemo(() => roundedTexture(source), [source]);
  const group = useRef<THREE.Group>(null);
  const angle = (index - (count - 1) / 2) * 0.34;
  const radius = 3.5;
  const target = new THREE.Vector3(Math.sin(angle) * radius, 0, Math.cos(angle) * radius - radius);
  useFrame((state, delta) => {
    if (!group.current) return;
    const focus = selected ? 1 : 0;
    group.current.position.lerp(new THREE.Vector3(target.x, target.y + Math.sin(state.clock.elapsedTime * 1.15 + index) * 0.045, target.z + focus * 0.22), 1 - Math.exp(delta * 5));
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -angle * 0.72, 5, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, selected ? -0.025 : 0.015, 5, delta);
    const scale = selected ? 1.045 : 1;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 1 - Math.exp(delta * 5));
  });
  return <group ref={group} onClick={onSelect}>
    <RoundedBox args={[2.65, 1.68, 0.09]} radius={0.13} smoothness={8}>
      <meshStandardMaterial color={selected ? "#ffffff" : "#e9eee9"} roughness={0.32} metalness={0.08} />
    </RoundedBox>
    <mesh position={[0, 0, 0.052]}>
      <planeGeometry args={[2.53, 1.56]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
    <mesh position={[0, -0.91, 0.025]}>
      <planeGeometry args={[2.65, 0.34]} />
      <meshBasicMaterial color="#f8faf7" />
    </mesh>
  </group>;
}
function Scene({ projects, active, setActive }: { projects: Project[]; active: number; setActive: (index: number) => void }) {
  const rig = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (rig.current) {
      const x = (state.pointer.x * 0.08);
      rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, x, 2.4, delta);
      rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, -state.pointer.y * 0.025, 2.4, delta);
    }
  });
  return <>
    <ambientLight intensity={1.7} />
    <directionalLight position={[3, 5, 5]} intensity={2.2} />
    <group ref={rig} position={[0, 0, 0]}>
      {projects.map((project, index) => <ProjectCard key={project.name} project={project} index={index} count={projects.length} selected={active === index} onSelect={() => setActive(index)} />)}
    </group>
  </>;
}
export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => setIsMobile(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const dragStart = useRef<number | null>(null);
  const project = projects[active];
  const change = (direction: number) => setActive(current => (current + direction + projects.length) % projects.length);
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => { dragStart.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); };
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    if (Math.abs(distance) > 34) change(distance < 0 ? 1 : -1);
    dragStart.current = null;
  };
  if (isMobile) return <section className="r3f-showcase mobile-projects" aria-label="Project showcase">
    <div className="mobile-project-track">{filteredProjects.map((item, index) => <article className={index === active ? "mobile-project-card selected" : "mobile-project-card"} key={item.name} onClick={() => setActive(index)}>
      <a href={item.url} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()} aria-label={"Open " + item.name}><img src={item.shot} alt={item.name + " website preview"} loading="lazy"/><span className="mobile-project-open"><ArrowUpRight size={14}/></span></a>
      <div className="mobile-project-info"><span>{item.type}</span><h3>{item.name}</h3><p>{item.desc}</p><small>{item.stack}</small></div>
    </article>)}</div>
    <div className="mobile-project-footer"><span>SWIPE TO EXPLORE · {filteredProjects.length} PROJECTS</span><div><button type="button" onClick={() => change(-1)} aria-label="Previous project">←</button><button type="button" onClick={() => change(1)} aria-label="Next project">→</button></div></div>
  </section>;
  return <section className="r3f-showcase" aria-label="Interactive 3D project showcase">
    <div className="r3f-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { dragStart.current = null; }}>
      <Canvas dpr={[1, 1.7]} camera={{ position: [0, 0.1, 7.2], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}><Scene projects={filteredProjects} active={active} setActive={setActive} /></Suspense>
      </Canvas>
      <span className="r3f-hint">DRAG TO BROWSE · SELECT A CARD</span>
    </div>
    <div className="r3f-details" aria-live="polite">
      <div className="r3f-project-copy">
        <span className="r3f-project-type">{project.type} <i/> 0{active + 1} / 0{projects.length}</span>
        <h3>{project.name}</h3><p>{project.desc}</p>
        <span className="r3f-stack">{project.stack}</span>
      </div>
      <div className="r3f-actions">
        <div className="r3f-arrows"><button type="button" onClick={() => change(-1)} aria-label="Previous project">←</button><button type="button" onClick={() => change(1)} aria-label="Next project">→</button></div>
        <a href={project.url} target="_blank" rel="noreferrer">EXPLORE PROJECT ↗</a>
      </div>
    </div>
    <div className="r3f-pagination">{projects.map((item, index) => <button type="button" key={item.name} onClick={() => setActive(index)} className={index === active ? "active" : ""} aria-label={"Show " + item.name}/>)}</div>
  </section>;
}
