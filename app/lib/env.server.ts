export async function loadServerEnv() {
  console.info(`Loading environment from '${process.cwd()}'...`);

  return {
    ...(await import("vite")).loadEnv(import.meta.env.MODE, process.cwd(), ""),
    ...process.env,
  };
}
