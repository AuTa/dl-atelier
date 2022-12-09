import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs'

@Injectable()
export class SliderAutoplayService {
    autoplayable$ = new ReplaySubject<boolean>(1)
}
