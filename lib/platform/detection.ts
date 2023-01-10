import NetlifyDetection from "./netlify";
import VercelDetection from "./vercel";

export default interface PlatformDetection {
    isEnvVarsSet(): boolean;
}

const platforms = [VercelDetection, NetlifyDetection]

export function detectPlatform(): PlatformDetection {
    for (let p of platforms) {
        const platform = new p();
        if (platform.isEnvVarsSet()) {
            return platform;
        }
    }
    throw new Error("No platform detected");
}