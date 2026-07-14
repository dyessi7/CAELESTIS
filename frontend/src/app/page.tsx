"use client";

import Sidebar from "@/components/Sidebar";
import Constellation from "@/components/Constellation";
import CosmicSwirl from "@/components/CosmicSwirl";
import Starfield from "@/components/Starfield";
import MetricsWheel from "@/components/MetricsWheel";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

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
        {/* Halos de color: violeta arriba-izquierda, azul abajo-derecha,
            dan profundidad de nebulosa sin competir con el texto. */}
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[var(--color-purple)] opacity-[0.08] blur-[120px]" />
        <div className="absolute -bottom-40 -right-20 w-[480px] h-[480px] rounded-full bg-[var(--color-blue)] opacity-[0.08] blur-[120px]" />

        <Starfield count={70} seed={11} />

        {/* Remolino de anillos girando lentamente detrás del título,
            eco del cielo en espiral de la referencia. */}
        <CosmicSwirl className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] opacity-70" />

        <Constellation
          variant="medium"
          className="absolute top-20 left-16 text-[var(--color-purple-soft)] opacity-40"
        />
        <Constellation
          className="absolute bottom-32 right-32 text-[var(--color-blue-soft)] opacity-30"
        />

        <div className="relative z-10 text-center max-w-3xl fade-in-up">
          <p className="text-eyebrow text-[var(--color-accent)] mb-8">
            Sistema inteligente · Visión por computadora
          </p>
          <h1 className="text-7xl md:text-9xl font-serif italic mb-12 heading-glow text-gradient-cosmic">
            Caelestis
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-[var(--color-fg-muted)] leading-relaxed max-w-2xl mx-auto">
            &ldquo;Toma esta vida que no existe, para jugar a las escondidas en el
            desierto, en tus ojos, en el universo.&rdquo;
          </p>
          <div className="mt-16 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[var(--color-accent)] opacity-50" />
            <span className="text-eyebrow text-[var(--color-fg-muted)]">
              Desplaza para descubrir
            </span>
            <span className="h-px w-12 bg-[var(--color-accent)] opacity-50" />
          </div>
        </div>
      </section>

      {/* === SECCIÓN 2: QUÉ ES === */}
      <section
        id="que-es"
        className="min-h-screen flex items-center px-6 py-24 relative overflow-hidden"
      >
        <Starfield count={25} seed={22} />
        <Constellation
          className="absolute top-16 right-24 text-[var(--color-accent)] opacity-20"
        />

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Columna de texto */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[var(--color-accent)] opacity-60" />
              <p className="text-eyebrow text-[var(--color-accent)]">
                ¿Qué es? &nbsp;·&nbsp; 01 — 03
              </p>
            </div>
            <h2 className="text-6xl md:text-7xl font-serif mb-10">
              Una mirada inteligente <br />
              <span className="italic text-gradient-cosmic">al cosmos.</span>
            </h2>
            <div className="space-y-5 text-body-cosmic text-[var(--color-fg-muted)] mb-14">
              <p>
                Caelestis es un sistema de inteligencia artificial que detecta,
                clasifica y describe objetos celestes en imágenes astronómicas.
              </p>
              <p>
                Combina un modelo de visión por computadora entrenado sobre
                imágenes reales del cosmos con un agente inteligente que
                interpreta los resultados y genera descripciones verificadas
                contra fuentes oficiales de NASA.
              </p>
            </div>

            <div className="rule-cosmic mb-10" />

            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  n: "01",
                  title: "Detección visual",
                  desc: "YOLOv8 sobre el dataset COSMICA con cuatro clases astronómicas.",
                },
                {
                  n: "02",
                  title: "Agente inteligente",
                  desc: "Interpreta cada detección y selecciona la respuesta adecuada.",
                },
                {
                  n: "03",
                  title: "Información verificada",
                  desc: "Curada manualmente contra fuentes oficiales de la NASA.",
                },
              ].map((item) => (
                <div key={item.n}>
                  <div className="text-[var(--color-accent)] text-2xl font-serif mb-3">
                    {item.n}
                  </div>
                  <h3 className="text-eyebrow mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs font-light text-[var(--color-fg-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen protagonista */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-[120%] h-[120%] rounded-full bg-[var(--color-accent)] opacity-[0.10] blur-[110px]" />
            <div className="absolute w-[90%] h-[90%] rounded-full bg-[var(--color-purple)] opacity-[0.12] blur-[100px] translate-x-8 -translate-y-4" />
            <div className="absolute w-[70%] h-[70%] rounded-full bg-[var(--color-blue)] opacity-[0.10] blur-[90px] -translate-x-10 translate-y-10" />
            <div className="relative w-full max-w-[560px] drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <Image
                src="/images/mars-cutout.png"
                alt="Marte"
                width={964}
                height={928}
                className="w-full h-auto"
                priority
              />
              {/* Sombra de terminador: oscurece el borde inferior-derecho del
                  planeta para que se funda con el fondo, como en la referencia.
                  El recorte (mars-cutout.png) trae ~5-8% de margen transparente
                  alrededor de la esfera, así que el óvalo se insetea esos
                  mismos porcentajes para calzar con el planeta real y no
                  dejar un borde visible fuera de su silueta. */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  top: "4.6%",
                  bottom: "5.2%",
                  left: "6.1%",
                  right: "7.7%",
                  background:
                    "radial-gradient(circle at 28% 24%, transparent 0%, transparent 20%, rgba(5,5,7,0.45) 38%, rgba(5,5,7,0.92) 58%, rgba(5,5,7,0.98) 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* === SECCIÓN 3: PROBLEMA === */}
      <section
        id="problema"
        className="min-h-screen flex items-center px-6 py-24 relative overflow-hidden bg-[var(--color-bg-soft)]"
      >
        <Starfield count={30} seed={33} />

        {/* El agujero negro, presente pero apenas perceptible: blend "screen"
            para que solo su brillo se asome sobre el fondo oscuro (el negro
            de la foto no aporta nada) y una capa de blur para que se sienta
            más que se vea, "como si estuviera entrando". */}
        <div className="absolute inset-0 opacity-45 mix-blend-screen">
          <Image
            src="/images/cc-2.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[8%_center]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-soft)] via-transparent to-[var(--color-bg-soft)]/50" />

        {/* Marca de esquina superior izquierda */}
        <div className="absolute top-8 left-8 flex items-center gap-3 text-[var(--color-fg-subtle)] z-10">
          <span className="text-[10px] tracking-[0.3em]">●</span>
          <span className="h-px w-6 bg-[var(--color-fg-subtle)] opacity-60" />
          <span className="text-[10px] tracking-[0.3em]">02 — 03</span>
        </div>

        {/* Etiqueta de esquina superior derecha */}
        <div className="absolute top-8 right-8 text-right z-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] leading-relaxed">
            Caelestis
            <br />
            Una historia
            <br />
            — del cosmos
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-[var(--color-accent)] opacity-80"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
                </svg>
                <p className="text-eyebrow text-[var(--color-accent)]">
                  El problema &nbsp;·&nbsp; 02 — 03
                </p>
              </div>

              <h2 className="text-5xl md:text-6xl font-serif uppercase leading-[1.08] mb-10 max-w-md">
                Si el universo
                <br />
                es tan inmenso
              </h2>

              {/* El texto se desplaza más a la derecha que el título,
                  como en la referencia: composición escalonada. */}
              <div className="md:ml-16 lg:ml-24 max-w-md">
                <p className="font-serif italic text-lg md:text-xl text-[var(--color-fg)] leading-relaxed mb-8">
                  Es la paradoja de Fermi. Una de los misterios más
                  comentados y normalizados en contexto astrológico. No es
                  que el cosmos esté vacío, es que no se ha mirado lo
                  suficiente. El problema no son los datos entonces, son las
                  herramientas para observar.
                </p>

                <p className="text-xs text-[var(--color-fg-subtle)] leading-relaxed max-w-sm">
                  Los telescopios modernos generan más datos de los que la
                  humanidad puede analizar. El proyecto Galaxy Zoo reunió a
                  más de cuatrocientos mil voluntarios para clasificar
                  galaxias manualmente. En diecisiete años, lograron
                  clasificar apenas el seis por ciento.
                </p>
              </div>
            </div>
          </div>
        {/* Firma de esquina inferior izquierda */}
        <div className="absolute bottom-8 left-8 text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] z-10 font-serif italic">
          Caelestis
        </div>

        {/* Botón flotante de esquina inferior derecha */}
        <div className="absolute bottom-8 right-8 flex gap-3 z-10">
          <a
            href="#resultados"
            className="w-10 h-10 rounded-full bg-white/5 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors duration-300"
            aria-label="Ir a la siguiente sección"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </section>

      {/* === SECCIÓN 4: RESULTADOS === */}
      <section
        id="resultados"
        className="min-h-screen flex items-center px-6 py-24 relative"
      >
        <Starfield count={20} seed={44} />
        <Constellation
          className="absolute bottom-24 right-16 text-[var(--color-blue)] opacity-20"
        />

        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[var(--color-accent)] opacity-60" />
            <p className="text-eyebrow text-[var(--color-accent)]">
              Resultados
            </p>
          </div>
          <h2 className="text-6xl md:text-7xl font-serif mb-6">
            Métricas del <span className="italic text-gradient-cosmic">modelo.</span>
          </h2>
          <p className="text-xs text-[var(--color-fg-subtle)] mb-16">
            Pasa el cursor sobre cada órbita para ver su valor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <MetricsWheel />

            <div>
              <p className="text-eyebrow text-[var(--color-fg-muted)] mb-6">
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
        </div>
      </section>

      {/* === SECCIÓN 5: ANTECEDENTES === */}
      <section
        id="antecedentes"
        className="min-h-screen flex items-center px-6 py-24 relative bg-[var(--color-bg-soft)]"
      >
        <Starfield count={30} seed={55} />
        <Constellation
          className="absolute top-32 left-20 text-[var(--color-blue)] opacity-25"
        />

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[var(--color-accent)] opacity-60" />
            <p className="text-eyebrow text-[var(--color-accent)]">
              Antecedentes
            </p>
          </div>
          <h2 className="text-6xl md:text-7xl font-serif mb-12">
            La literatura <br /> nos cuenta{" "}
            <span className="italic text-gradient-cosmic">lo que miraron antes.</span>
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
                <p className="text-sm font-light text-[var(--color-fg-muted)] leading-relaxed">
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
        <Starfield count={50} seed={66} />
        <CosmicSwirl className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] opacity-40" />
        <Constellation
          variant="medium"
          className="absolute top-32 left-1/4 text-[var(--color-purple-soft)] opacity-30"
        />
        <Constellation
          className="absolute bottom-40 right-1/4 text-[var(--color-blue-soft)] opacity-25"
        />

        <div className="text-center max-w-2xl">
          <p className="text-eyebrow text-[var(--color-accent)] mb-8">
            Probar el sistema
          </p>
          <h2 className="text-6xl md:text-7xl font-serif mb-8">
            Una imagen. <br />
            <span className="italic text-gradient-cosmic">
              Mil objetos encontrados.
            </span>
          </h2>
          <p className="text-body-cosmic text-[var(--color-fg-muted)] mb-16">
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
        </div>
      </section>

      <Footer />
    </main>
  );
}