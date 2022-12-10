import { trigger, transition, animate, style } from '@angular/animations'
import { Component, Input, OnInit } from '@angular/core'
import { delay, mergeMap, Observable, of } from 'rxjs'

@Component({
    selector: 'app-image-loading',
    templateUrl: './image-loading.component.html',
    styleUrls: ['./image-loading.component.scss'],
    animations: [trigger('loadingTrigger', [transition(':leave', [animate('400ms ease', style({ opacity: 0 }))])])],
})
export class ImageLoadingComponent implements OnInit {
    @Input() loading$!: Observable<boolean>
    @Input() delay = 200

    loaded$!: Observable<boolean>

    ngOnInit(): void {
        this.loaded$ = this.loading$.pipe(mergeMap(val => (val ? of(val) : of(val).pipe(delay(this.delay)))))
    }
}
