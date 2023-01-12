export default interface ConfigProvider {
    getIngestURL(): string;
    getMeta(req: any);
    getLogsEndpoint(): string
    getWebVitalsEndpoint(): string
  }
  