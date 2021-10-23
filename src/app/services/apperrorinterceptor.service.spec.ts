import { TestBed } from '@angular/core/testing';

import { ApperrorinterceptorService } from './apperrorinterceptor.service';

describe('ApperrorinterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApperrorinterceptorService = TestBed.get(ApperrorinterceptorService);
    expect(service).toBeTruthy();
  });
});
