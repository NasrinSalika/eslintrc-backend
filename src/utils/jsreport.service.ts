import * as jsreport from 'jsreport';

class JsReportService {
  private static instance: jsreport.JsReport;

  public static getInstance(): jsreport.JsReport {
    if (!JsReportService.instance) {
      JsReportService.instance = jsreport();
      JsReportService.instance.init();
    }
    return JsReportService.instance;
  }

  public async render(reportDefinition: any): Promise<any> {
    if (!JsReportService.instance) {
      await JsReportService.getInstance().init();
    }
    return JsReportService.instance.render(reportDefinition);
  }
}

export default JsReportService;