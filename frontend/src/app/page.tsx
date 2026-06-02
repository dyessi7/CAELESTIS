export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-6 py-24">
        <h1 className="text-6xl tracking-tight">
          Caelestis
        </h1>
        <p className="mt-4 text-lg text-white/70 max-w-xl">
          Detección y análisis automatizado del cosmos mediante visión por computadora.
        </p>
        <div className="mt-12 flex items-center gap-3">
          <span className="h-px w-12 bg-[var(--accent)]"></span>
          <span className="text-sm uppercase tracking-widest text-[var(--accent)]">
            Sistema inteligente
          </span>
        </div>
      </div>
    </main>
  );
}