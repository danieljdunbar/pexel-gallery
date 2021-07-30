import { SupportedViews } from './supported-views-enum';
import { ReplaySubject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  CurrentViewService,
  MOBILE_MEDIA_QUERY,
  TABLET_MEDIA_QUERY,
  DESKTOP_MEDIA_QUERY,
} from './current-view.service';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';

describe('Service: CurrentView', () => {
  let currentViewService: CurrentViewService;
  let breakpointSubject: ReplaySubject<BreakpointState>;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    breakpointSubject = new ReplaySubject();
    breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', [
      'isMatched',
      'observe',
    ]);

    breakpointObserverSpy.observe.and.returnValue(breakpointSubject);
    breakpointObserverSpy.isMatched.and.returnValue(true);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    currentViewService = new CurrentViewService(breakpointObserverSpy);
  });

  it('correctly sets initial view', (done) => {
    currentViewService.currentView.subscribe((result) => {
      expect(result).toBe(SupportedViews.MOBILE);
      done();
    });
  });

  it('outputs correct view when updated', (done) => {
    const nextBreakpoint: BreakpointState = {
      breakpoints: {
        [MOBILE_MEDIA_QUERY]: false,
        [TABLET_MEDIA_QUERY]: false,
        [DESKTOP_MEDIA_QUERY]: true,
      },
      matches: true,
    };
    breakpointSubject.next(nextBreakpoint);

    currentViewService.currentView.subscribe((result) => {
      expect(result).toBe(SupportedViews.DESKTOP);
      done();
    });
  });
});
