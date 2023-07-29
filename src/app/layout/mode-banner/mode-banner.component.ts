import { Component, Input } from '@angular/core';
import { VersionInfo } from 'app/navigation/navigation.service';

@Component({
  selector: 'aio-mode-banner',
  template: `
      <div *ngIf="isArchive || isDev" class="mode-banner alert" [ngClass]="warningClass">
          <p>
              This is the <strong>{{ isDev ? 'dev' : 'archived' }} documentation for
              Discordoo{{ versionString }}</strong> Please visit
              <a href="https://docs.ddoo.dev">docs.ddoo.dev</a>
              to see this page for the stable version of Discordoo.
          </p>
      </div>
  `
})
export class ModeBannerComponent {
  @Input() mode: string;
  @Input() version: VersionInfo;

  public get isArchive(): boolean {
    return this.mode === 'archive';
  }

  public get isDev(): boolean {
    return this.mode === 'dev';
  }

  public get versionString(): string {
    return this.isArchive ? ` v${this.version.raw}.` : '.';
  }

  public get warningClass() {
    return `${this.mode}-warning`;
  }
}
