export class ConsoleLogger {
  public static info(tag: string, message: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[\x1b[34mINFO\x1b[0m][${timestamp}][\x1b[36m${tag}\x1b[0m] ${message}`);
  }

  public static success(tag: string, message: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[\x1b[32mSUCCESS\x1b[0m][${timestamp}][\x1b[36m${tag}\x1b[0m] ${message}`);
  }

  public static warn(tag: string, message: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.warn(`[\x1b[33mWARN\x1b[0m][${timestamp}][\x1b[36m${tag}\x1b[0m] ${message}`);
  }

  public static error(tag: string, message: string, err?: any) {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`[\x1b[31mERROR\x1b[0m][${timestamp}][\x1b[36m${tag}\x1b[0m] ${message}`, err || "");
  }
}
