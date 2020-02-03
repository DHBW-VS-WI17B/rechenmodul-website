import { TestBed } from '@angular/core/testing';

import { ResultListService } from './result-list.service';

describe('ResultListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResultListService = TestBed.get(ResultListService);
    expect(service).toBeTruthy();
  });
});
