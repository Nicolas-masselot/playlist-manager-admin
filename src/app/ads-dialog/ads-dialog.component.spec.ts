import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsDialogComponent } from './ads-dialog.component';

describe('AdsDialogComponent', () => {
  let component: AdsDialogComponent;
  let fixture: ComponentFixture<AdsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
