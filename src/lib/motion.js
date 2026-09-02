// Entrada del hero: las filas del registro aparecen en secuencia, como un
// resultado de consulta.
export const recordStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const recordRow = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// Scroll reveals para el resto de las secciones (grillas y listas de
// contenido): entran una sola vez, con un leve fade + rise escalonado.
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export const viewportOnce = { once: true, margin: "-60px" };
