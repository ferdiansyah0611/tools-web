import { dirname, join } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename).replace("\\src", "");

export const paths = {
	root: __dirname,
	data: {
		express: join(__dirname, "../", "/data/express/"),
		firebase: join(__dirname, "../", "/data/firebase/"),
		react: join(__dirname, "../", "/data/react/"),
		tailwind: join(__dirname, "../", "/data/tailwind/"),
		test: join(__dirname, "../", "/data/test/"),
		vite: join(__dirname, "../", "/data/vite/"),
		vue: join(__dirname, "../", "/data/vue/"),
	},
	directory: {
		component: (next: string[], appFolder: string) => join(appFolder, "/src/component", ...next),
		components: (next: string[], appFolder: string) => join(appFolder, "/src/components", ...next),
		route: (next: string[], appFolder: string) => join(appFolder, "/src/route", ...next),
		store: (next: string[], appFolder: string) => join(appFolder, "/src/store", ...next),
		style: (next: string[], appFolder: string) => join(appFolder, "/src/style", ...next),
		service: (next: string[], appFolder: string) => join(appFolder, "/src/service", ...next),
		model: (next: string[], appFolder: string) => join(appFolder, "/model", ...next),
		api: (next: string[], appFolder: string) => join(appFolder, "/api", ...next),
		src: (next: string[], appFolder: string) => join(appFolder, "/src", ...next),
	}
};