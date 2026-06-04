import Sidebar from "@/components/sidebar";
import Constellation from "@/components/constellation";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative">
      <Sidebar />

      {/* === SECCIÓN 1: HERO === */}
      <section
        id="inicio"
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-6"
      >
        <div className="absolute inset-0 bg-gradient-radial from-[#0a0a15] via-[#050507] to-[#050507] opacity-80" />

        <Constellation
          variant="medium"
          className="absolute top-20 left-16 text-[var(--color-accent)] opacity-40"
        />
        <Constellation
          className="absolute bottom-32 right-32 text-[var(--color-accent)] opacity-30"
        />

        <div className="relative z-10 text-center max-w-3xl fade-in-up">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-accent)] mb-8">
            Sistema inteligente · Visión por computadora
          </p>
          <h1 className="text-7xl md:text-8xl font-serif italic mb-12">
            Caelestis
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-[var(--color-fg-muted)] leading-relaxed max-w-2xl mx-auto">
            &ldquo;Toma esta vida que no existe, para jugar a las escondidas en el
            desierto, en tus ojos, en el universo.&rdquo;
          </p>
          <div className="mt-16 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[var(--color-accent)] opacity-50" />
            <span className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
              Desplaza para descubrir
            </span>
            <span className="h-px w-12 bg-[var(--color-accent)] opacity-50" />
          </div>
        </div>
      </section>

      {/* === SECCIÓN 2: QUÉ ES === */}
      <section
        id="que-es"
        className="min-h-screen flex items-center px-6 py-24 relative"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
            ¿Qué es?
          </p>
          <h2 className="text-5xl md:text-6xl font-serif mb-12">
            Una mirada inteligente al cosmos.
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-[var(--color-fg-muted)] max-w-2xl">
            <p>
              Caelestis es un sistema de inteligencia artificial que detecta,
              clasifica y describe objetos celestes en imágenes astronómicas.
            </p>
            <p>
              Combina un modelo de visión por computadora entrenado sobre
              imágenes reales del cosmos con un agente inteligente que interpreta
              los resultados y genera descripciones verificadas contra fuentes
              oficiales de NASA.
            </p>
            <p>
              Está pensado para estudiantes, aficionados y curiosos del universo
              que no necesitan ser astrónomos para descubrir lo que contiene una
              imagen del cielo.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="text-[var(--color-accent)] text-3xl font-serif mb-3">01</div>
              <h3 className="text-xl mb-2">Detección visual</h3>
              <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                YOLOv8 entrenado sobre el dataset COSMICA con cuatro clases
                astronómicas.
              </p>
            </div>
            <div>
              <div className="text-[var(--color-accent)] text-3xl font-serif mb-3">02</div>
              <h3 className="text-xl mb-2">Agente inteligente</h3>
              <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                Sistema reactivo que interpreta cada detección y selecciona la
                respuesta adecuada.
              </p>
            </div>
            <div>
              <div className="text-[var(--color-accent)] text-3xl font-serif mb-3">03</div>
              <h3 className="text-xl mb-2">Información verificada</h3>
              <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                Base de conocimiento curada manualmente contra fuentes oficiales
                de la NASA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === SECCIÓN 3: PROBLEMA === */}
      <section
        id="problema"
        className="min-h-screen flex items-center px-6 py-24 relative bg-[var(--color-bg-soft)]"
      >
        <Constellation
          variant="medium"
          className="absolute top-20 right-20 text-[var(--color-accent)] opacity-20"
        />

        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
            El problema
          </p>
          <h2 className="text-5xl md:text-6xl font-serif mb-12 italic">
            Si el universo es tan inmenso, <br />
            ¿por qué no lo hemos visto?
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-[var(--color-fg-muted)] max-w-2xl">
            <p>
              Es la Paradoja de Fermi. Y una de las respuestas más aceptadas no
              es romántica: no es que el cosmos esté vacío, es que no lo hemos
              mirado lo suficiente.
            </p>
            <p>
              Los telescopios modernos generan más datos de los que la humanidad
              puede analizar. El proyecto Galaxy Zoo reunió a más de cuatrocientos
              mil voluntarios para clasificar galaxias manualmente. En diecisiete
              años, lograron clasificar apenas el seis por ciento.
            </p>
            <p>
              El problema no son los datos. Son las herramientas para mirarlos.
            </p>
          </div>
        </div>
      </section>

      {/* === SECCIÓN 4: RESULTADOS === */}
      <section
        id="resultados"
        className="min-h-screen flex items-center px-6 py-24 relative"
      >
        <div className="max-w-4xl mx-auto w-full">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
            Resultados
          </p>
          <h2 className="text-5xl md:text-6xl font-serif mb-16">
            Métricas del modelo.
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div>
              <div className="text-4xl font-serif text-[var(--color-accent)] mb-2">
                74.6%
              </div>
              <p className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                mAP50
              </p>
            </div>
            <div>
              <div className="text-4xl font-serif text-[var(--color-accent)] mb-2">
                79.7%
              </div>
              <p className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                Precisión
              </p>
            </div>
            <div>
              <div className="text-4xl font-serif text-[var(--color-accent)] mb-2">
                67.8%
              </div>
              <p className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                Recall
              </p>
            </div>
            <div>
              <div className="text-4xl font-serif text-[var(--color-accent)] mb-2">
                43.8%
              </div>
              <p className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                mAP50-95
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] mb-6">
              Desempeño por clase (mAP50)
            </p>
            <div className="space-y-4">
              {[
                { name: "Cúmulo globular", value: 93.1 },
                { name: "Nebulosa", value: 79.1 },
                { name: "Cometa", value: 69.8 },
                { name: "Galaxia", value: 56.4 },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-serif italic">{item.name}</span>
                    <span className="text-[var(--color-accent)]">
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-px bg-[var(--color-border)] relative">
                    <div
                      className="absolute top-0 left-0 h-px bg-[var(--color-accent)]"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === SECCIÓN 5: ANTECEDENTES === */}
      <section
        id="antecedentes"
        className="min-h-screen flex items-center px-6 py-24 relative bg-[var(--color-bg-soft)]"
      >
        <Constellation
          className="absolute top-32 left-20 text-[var(--color-accent)] opacity-25"
        />

        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
            Antecedentes
          </p>
          <h2 className="text-5xl md:text-6xl font-serif mb-12">
            Sobre los hombros <br /> de quienes miraron antes.
          </h2>
          <div className="space-y-8 max-w-2xl">
            {[
              {
                title: "AstroCV (González et al., 2018)",
                desc: "Detección automática de galaxias con YOLO y CNN sobre datasets SDSS y Galaxy Zoo.",
              },
              {
                title: "DeepSpaceYoloDataset (D'Addona et al., 2024)",
                desc: "Imágenes astronómicas anotadas para entrenamiento de modelos YOLO en condiciones reales.",
              },
              {
                title: "Ramos & Rivas-Echeverría (2025)",
                desc: "Análisis comparativo de YOLOv8, v9 y v10 aplicados a la detección de objetos del cielo profundo.",
              },
              {
                title: "COSMICA (Piratinskii & Rabaev, 2025)",
                desc: "Dataset utilizado en este proyecto. Imágenes astronómicas capturadas por telescopios amateurs.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-l border-[var(--color-border)] pl-6"
              >
                <h3 className="text-lg font-serif italic mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SECCIÓN 6: PROBAR === */}
      <section
        id="probar"
        className="min-h-screen flex items-center justify-center px-6 py-24 relative"
      >
        <Constellation
          variant="medium"
          className="absolute top-32 left-1/4 text-[var(--color-accent)] opacity-30"
        />
        <Constellation
          className="absolute bottom-40 right-1/4 text-[var(--color-accent)] opacity-25"
        />

        <div className="text-center max-w-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-accent)] mb-8">
            Probar el sistema
          </p>
          <h2 className="text-5xl md:text-6xl font-serif mb-8 italic">
            Una imagen. <br /> Mil historias del cosmos.
          </h2>
          <p className="text-lg text-[var(--color-fg-muted)] mb-16 leading-relaxed">
            Sube una imagen astronómica y descubre lo que el modelo y el agente
            inteligente tienen para decir sobre ella.
          </p>

          <Link
            href="/detector"
            className="inline-flex items-center gap-3 border border-[var(--color-accent)] px-10 py-4 text-sm uppercase tracking-[0.3em] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all duration-500"
          >
            Probar Caelestis
            <span>→</span>
          </Link>

          <div className="mt-32 pt-12 border-t border-[var(--color-border)] text-xs uppercase tracking-widest text-[var(--color-fg-subtle)] space-y-3">
            <p>Yessica Gómez Salinas · UPAO · 2026</p>
            <p>
              Fuentes: NASA · COSMICA · Roboflow · Ultralytics
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}