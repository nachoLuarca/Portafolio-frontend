// Única animación con intención del sitio: la entrada del registro del
// hero, como filas de un resultado de consulta apareciendo en secuencia.
// El resto de las secciones no anima al hacer scroll — evita el efecto
// "fade-in repetido en cada card" que hacía sentir el sitio genérico.
export const recordStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const recordRow = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};
