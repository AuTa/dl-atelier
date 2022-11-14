import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPositionComponent } from './project-position.component';

describe('ProjectPositionComponent', () => {
  let component: ProjectPositionComponent;
  let fixture: ComponentFixture<ProjectPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPositionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
