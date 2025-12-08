import { TestBed } from '@angular/core/testing';

import { InvoiceParserService } from './invoice-parser.service';

describe('InvoiceParserService', () => {
  let service: InvoiceParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
