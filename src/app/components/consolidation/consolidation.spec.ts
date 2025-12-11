import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Consolidation } from './consolidation';

describe('Consolidation', () => {
  let component: Consolidation;
  let fixture: ComponentFixture<Consolidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Consolidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Consolidation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
