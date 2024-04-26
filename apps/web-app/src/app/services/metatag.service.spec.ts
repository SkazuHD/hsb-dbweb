import { TestBed } from '@angular/core/testing';

import { MetatagService } from './metatag.service';

describe('MetatagService', () => {
  let service: MetatagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetatagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
