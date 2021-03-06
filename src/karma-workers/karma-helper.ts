import * as karma from "karma";
import { KarmaEventListener } from "./karma-event-listener";
import { TestSuiteInfo } from "vscode-test-adapter-api";

export class KarmaHelper {
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new KarmaHelper();
    }
    return this.instance;
  }

  private static instance: KarmaHelper;
  private readonly karmaEventListener: KarmaEventListener;

  private constructor() {
    this.karmaEventListener = new KarmaEventListener();
  }

  public async waitTillServerReady(): Promise<void> {
    await this.karmaEventListener.listenTillKarmaReady();
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    this.karmaEventListener.nextRunIsForLoading = true;

    await this.runServer();

    return this.karmaEventListener.getTests();
  }

  public async runServer(): Promise<void> {
    return new Promise<void>(resolve => {
      karma.runner.run({ port: 9876 }, (exitCode: number) => {
        global.console.log("karma run done with ", exitCode);
        resolve();
      });
    });
  }

  public stopServer(): void {
    karma.stopper.stop();
  }

  public isValidKarmaConfig(karmaConfigFilePath: string): boolean {
    const cfg = require("karma").config;
    const karmaConfig = cfg.parseConfig(karmaConfigFilePath);

    return karmaConfig != null || karmaConfig !== undefined;
  }
}
