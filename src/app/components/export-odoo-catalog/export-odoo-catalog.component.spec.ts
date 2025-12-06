import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportOdooCatalogComponent } from './export-odoo-catalog.component';

describe('ExportOdooCatalogComponent', () => {
  let component: ExportOdooCatalogComponent;
  let fixture: ComponentFixture<ExportOdooCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportOdooCatalogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportOdooCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
