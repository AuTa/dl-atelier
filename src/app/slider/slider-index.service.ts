import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs'

@Injectable()
export class SliderIndexService {
    itemChange$ = new ReplaySubject<number>(1)
}
