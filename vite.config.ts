import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode, command }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const server =
		command === "serve"
			? {
					port: requiredPort(env.PORT, "PORT"),
					proxy: {
						"/api": `http://localhost:${requiredPort(env.WORKER_PORT, "WORKER_PORT")}`,
					},
				}
			: undefined;

	return {
		plugins: [react()],
		server,
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
