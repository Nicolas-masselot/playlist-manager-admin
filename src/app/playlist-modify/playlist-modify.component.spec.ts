import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistModifyComponent } from './playlist-modify.component';

describe('PlaylistModifyComponent', () => {
  let component: PlaylistModifyComponent;
  let fixture: ComponentFixture<PlaylistModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
