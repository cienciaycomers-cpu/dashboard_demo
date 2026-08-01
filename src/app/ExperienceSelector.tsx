export function ExperienceSelector() {
  return (
    <main className="experience-selector">
      <div className="selector-shell">
        <p className="selector-eyebrow">FM / Portfolio system</p>
        <h1>Dos formas de leer<br /><em>la misma señal.</em></h1>
        <p className="selector-intro">Elegí una experiencia para explorar el seguimiento de paid media.</p>
        <div className="selector-grid">
          <a className="experience-card experience-card-classic" href="/">
            <span className="experience-index">01</span>
            <div><strong>Classic Dashboard</strong><span>Lectura operativa</span></div>
            <span className="experience-arrow">↗</span>
          </a>
          <a className="experience-card experience-card-signal" href="/signal">
            <span className="experience-index">02</span>
            <div><strong>FM Signal</strong><span>Paid Media Intelligence</span></div>
            <span className="experience-arrow">↗</span>
          </a>
        </div>
      </div>
    </main>
  )
}
