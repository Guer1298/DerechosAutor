// Coalescer cambios mientras se genera el sitio; nunca ejecutar dos builds a la vez.
export function createBuildQueue(build, onError = console.error) {
  let requested = false;
  let running = null;
  const run = async () => {
    while (requested) {
      requested = false;
      try { await build(); } catch (error) { onError(error); }
    }
  };
  return function requestBuild() {
    requested = true;
    if (!running) {
      running = run().finally(() => { running = null; });
    }
    return running;
  };
}
