// Divisor curvo entre secciones (hero/footer navy <-> zona de contenido),
// en vez de un corte recto. `fill` recibe una clase de color de Tailwind
// (ej. "fill-background") para pintar la curva del color de la sección
// hacia la que se entra.
export default function WaveDivider({ fill, flip = false }) {
  return (
    <div className={flip ? "rotate-180" : ""} aria-hidden="true">
      <svg viewBox="0 0 1440 80" className={`block h-14 w-full sm:h-20 ${fill}`} preserveAspectRatio="none">
        <path d="M0,32 C320,80 1120,-16 1440,32 L1440,80 L0,80 Z" />
      </svg>
    </div>
  );
}
