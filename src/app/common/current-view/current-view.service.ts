import { Injectable, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ReplaySubject } from 'rxjs';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';

import { SupportedViews } from './supported-views-enum';

const MOBILE_BREAKPOINT = 600;
const TABLET_BREAKPOINT = 960;

export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
export const TABLET_MEDIA_QUERY = `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${
  TABLET_BREAKPOINT - 1
}px)`;
export const DESKTOP_MEDIA_QUERY = `(min-width: ${TABLET_BREAKPOINT}px)`;

@Injectable({
  providedIn: 'root',
})
export class CurrentViewService implements OnDestroy {
  private readonly currentViewSubject = new ReplaySubject<SupportedViews>(1);
  readonly currentView = this.currentViewSubject.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor(private readonly breakpointObserver: BreakpointObserver) {
    // Set initial state
    if (this.breakpointObserver.isMatched(MOBILE_MEDIA_QUERY)) {
      this.currentViewSubject.next(SupportedViews.MOBILE);
    } else if (this.breakpointObserver.isMatched(TABLET_MEDIA_QUERY)) {
      this.currentViewSubject.next(SupportedViews.TABLET);
    } else if (this.breakpointObserver.isMatched(DESKTOP_MEDIA_QUERY)) {
      this.currentViewSubject.next(SupportedViews.DESKTOP);
    }

    this.breakpointObserver
      .observe([MOBILE_MEDIA_QUERY, TABLET_MEDIA_QUERY, DESKTOP_MEDIA_QUERY])
      .subscribe((result) => {
        const breakpoints = result.breakpoints;

        if (breakpoints[MOBILE_MEDIA_QUERY]) {
          this.currentViewSubject.next(SupportedViews.MOBILE);
        } else if (breakpoints[TABLET_MEDIA_QUERY]) {
          this.currentViewSubject.next(SupportedViews.TABLET);
        } else if (breakpoints[DESKTOP_MEDIA_QUERY]) {
          this.currentViewSubject.next(SupportedViews.DESKTOP);
        }
      });
  }

  ngOnDestroy() {
    this.currentViewSubject.complete();
  }
}
