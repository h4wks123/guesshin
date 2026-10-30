import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const port = requiredPort(env.PORT, "PORT");
	const workerPort = requiredPort(env.WORKER_PORT, "WORKER_PORT");

	return {
		plugins: [react()],
		server: {
			port,
			proxy: {
				"/api": `http://localhost:${workerPort}`,
			},
		},
		build: {
			outDir: "dist",
			emptyOutDir: true,
		},
	};
});

function requiredPort(value: string | undefined, name: string): number {
	if (!value) {
		throw new Error(`${name} must be set in .env`);
	}

	const port = Number(value);
	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		throw new Error(`${name} must be a valid port number`);
	}

	return port;
}
