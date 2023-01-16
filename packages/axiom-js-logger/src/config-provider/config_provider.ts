export default interface ConfigProvider {
    isEnvVarsSet(): boolean;
    getIngestURL(): string;
    getMeta(req: any): any;
    getDataset(): string | undefined;
    // getLogsEndpoint(): string
    // getWebVitalsEndpoint(): string
  }
  