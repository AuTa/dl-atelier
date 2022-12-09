import { TestBed } from '@angular/core/testing'

import { SliderIndexService } from './slider-index.service'

describe('ItemsIndexService', () => {
    let service: SliderIndexService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(SliderIndexService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
