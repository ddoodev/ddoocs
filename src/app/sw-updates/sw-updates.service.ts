import { ApplicationRef, Injectable, OnDestroy } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, filter, from, interval, NEVER, Observable, of, Subject } from 'rxjs';
import { first, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Logger } from 'app/shared/logger.service';


/**
 * SwUpdatesService
 *
 * @description
 * 1. Checks for available ServiceWorker updates once instantiated.
 * 2. Re-checks every 6 hours.
 * 3. Whenever an update is available, it activates the update.
 *
 * @property
 * `updateActivated` {Observable<string>} - Emit the boolean whenever an update is activated.
 */
@Injectable()
export class SwUpdatesService implements OnDestroy {
  private checkInterval = 1000 * 60 * 60 * 6;  // 6 hours
  private onDestroy = new Subject<void>();
  updateActivated: Observable<boolean>;

  constructor(appRef: ApplicationRef, private logger: Logger, private swu: SwUpdate) {
    if (!swu.isEnabled) {
      this.updateActivated = NEVER.pipe(takeUntil(this.onDestroy));
      return;
    }

    // Periodically check for updates (after the app is stabilized).
    const appIsStable = appRef.isStable.pipe(first(v => v));
    concat(appIsStable, interval(this.checkInterval))
      .pipe(
        tap(() => this.log('Checking for update...')),
        takeUntil(this.onDestroy),
      )
      .subscribe(() => this.swu.checkForUpdate());

    // Activate available updates.
    this.swu.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        tap(evt => this.log(`Update available: ${JSON.stringify(evt)}`)),
        takeUntil(this.onDestroy),
        switchMap(() => from(this.swu.activateUpdate()))
      )
      .subscribe((isActivated) => {
        if (isActivated) {
          this.log('Update activated');
          this.updateActivated = of(true).pipe(takeUntil(this.onDestroy));
        }
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  private log(message: string) {
    const timestamp = new Date().toISOString();
    this.logger.log(`[SwUpdates - ${timestamp}]: ${message}`);
  }
}
