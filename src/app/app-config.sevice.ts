import { Injectable } from '@angular/core';
import { AppConfig } from './app-config';

@Injectable()
export class AppConfigService {
  private appConfig: AppConfig = new AppConfig('http://localhost:8080', 'ws://' + window.location.host);

  get getConfig(): AppConfig {
    return this.appConfig;
  }
}
