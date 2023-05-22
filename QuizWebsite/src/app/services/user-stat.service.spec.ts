import { TestBed } from '@angular/core/testing';

import { UserStatService } from './user-stat.service';

describe('UserStatService', () => {
  let service: UserStatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
