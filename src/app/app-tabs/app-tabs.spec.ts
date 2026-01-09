import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTabs } from './app-tabs';

describe('AppTabs', () => {
  let component: AppTabs;
  let fixture: ComponentFixture<AppTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
