import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidationComponent } from './consolidation';

describe('Consolidation', () => {
  let component: ConsolidationComponent;
  let fixture: ComponentFixture<ConsolidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
