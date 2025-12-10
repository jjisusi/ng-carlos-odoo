import { TestBed } from '@angular/core/testing';

import { AppMessages } from './app-messages';

describe('AppMessages', () => {
  let service: AppMessages;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppMessages);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
