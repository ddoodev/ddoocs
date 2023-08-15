import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { VersionInfo } from 'app/navigation/navigation.service';
import { LocationService } from '../../shared/location.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'aio-mode-banner',
  template: `
      <div *ngIf="isArchive || isDev" class="mode-banner alert" [ngClass]="warningClass">
          <p>
              This is the <strong>{{ isDev ? 'dev' : 'archived' }} documentation for
              Discordoo{{ versionString }}</strong> Please visit
              <a href="https://docs.ddoo.dev{{currentPath}}">docs.ddoo.dev</a>
              to see this page for the stable version of Discordoo.
          </p>
      </div>
  `
})
export class ModeBannerComponent implements OnInit, OnDestroy {
  @Input() mode: string;
  @Input() version: VersionInfo;

  currentPath: string;
  private currentPathSubscription: Subscription | undefined;

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    if (this.isArchive || this.isDev) {
      this.currentPathSubscription = this.locationService.currentPath.subscribe((path) =>
        this.currentPath = path ?? ''
      );
    }
  }

  ngOnDestroy() {
    this.currentPathSubscription?.unsubscribe();
  }

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
