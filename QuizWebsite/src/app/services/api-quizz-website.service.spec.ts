import { TestBed } from '@angular/core/testing';

import { ApiQuizzWebsiteService } from './api-quizz-website.service';

describe('ApiQuizzWebsiteService', () => {
  let service: ApiQuizzWebsiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiQuizzWebsiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
