import { AngularRunner } from "./angular-workers/angular-runner";
import { KarmaHelper } from "./karma-workers/karma-helper";
import { TestSuiteInfo } from "vscode-test-adapter-api";
import path = require('path');

export class AngularTestExplorer {
  private readonly karmaHelper: KarmaHelper;
  private readonly angularRunner: AngularRunner;
  private readonly baseKarmaConfigPath: string = path.join(__dirname, '.', 'config', "test-explorer-karma.conf.js");

  public constructor(private readonly angularProjectRootPath: string) {
    this.karmaHelper = KarmaHelper.getInstance();
    this.angularRunner = new AngularRunner(this.angularProjectRootPath, this.baseKarmaConfigPath, "");
  }

  public async loadTests(): Promise<TestSuiteInfo> {
    this.angularRunner.start();
    await this.karmaHelper.waitTillServerReady();

    const result = await this.karmaHelper.loadTests();
    this.angularRunner.cleanUp();

    return result;
  }

  public async runTests(): Promise<void> {
    await this.karmaHelper.runServer();
  }

  public debugTests(): void {
    throw new Error("Not Implemented");
  }
}
