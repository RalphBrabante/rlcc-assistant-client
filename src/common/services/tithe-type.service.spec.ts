import { TestBed } from '@angular/core/testing';

import { TitheTypeService } from './tithe-type.service';

describe('TitheTypeService', () => {
  let service: TitheTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitheTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
