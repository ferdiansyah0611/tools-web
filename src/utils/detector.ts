import config from "./config.js";
import { file, readPackageJson } from "./file.js";

const detector = {
    express() {
        const read = packages.read()
        if (read.dependencies?.express) return true;
        return false;
    },
    react() {
        const read = packages.read()
        if (read.dependencies?.react) return true;
        return false;
    },
    tailwind() {
        const read = packages.read()
        if (read.dependencies?.tailwindcss) return true;
        return false;
    },
    vite() {
        const read = packages.read()
        if (read.devDependencies?.vite) return true;
        return false;
    },
    vue() {
        const read = packages.read()
        if (read.dependencies?.vue) return true;
        return false;
    },
    laravel() {
        let read: any = file.read(config.pathApp[0] + "/composer.json");
        if (!read) return false;

        read = JSON.parse(read);
        if (read?.require['laravel/framework']) return true;
        return false;
    },
}

const packages = {
    data: null,
    read() {
        if(this.data) return this.data;

        const result = readPackageJson(config.pathApp[0]);
        if(result) return result;
        else return {}
    }
}

export default detector;