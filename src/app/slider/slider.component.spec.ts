import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectSliderComponent } from './slider.component'

describe('SliderComponent', () => {
    let component: ProjectSliderComponent
    let fixture: ComponentFixture<ProjectSliderComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProjectSliderComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ProjectSliderComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
