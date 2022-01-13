import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSaveComponent } from './video-save.component';

describe('VideoSaveComponent', () => {
  let component: VideoSaveComponent;
  let fixture: ComponentFixture<VideoSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoSaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
