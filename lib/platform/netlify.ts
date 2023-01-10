import PlatformDetection from './detection';

const axiomUrl = process.env.AXIOM_URL || 'https://cloud.axiom.co';
const dataset = process.env.AXIOM_DATASET;
const token = process.env.AXIOM_TOKEN;

export default class NetlifyDetection implements PlatformDetection {
    isEnvVarsSet() {
        return !!(axiomUrl && dataset && token);
    }
}
