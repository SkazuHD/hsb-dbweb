import {TestBed} from '@angular/core/testing';
import {CanActivateFn} from '@angular/router';

import {guard403} from './admin.guard';

describe('adminGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guard403(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
