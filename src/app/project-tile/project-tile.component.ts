import { animate, style, transition, trigger } from '@angular/animations'
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common'
import { Component, Input } from '@angular/core'
import { BehaviorSubject, delay, mergeMap, of } from 'rxjs'
import { environment } from './../../environments/environment'

import { Project } from '../project'

@Component({
    selector: 'app-project-tile',
    templateUrl: './project-tile.component.html',
    styleUrls: ['./project-tile.component.scss'],
    animations: [trigger('loadingTrigger', [transition(':leave', [animate('500ms', style({ opacity: 0 }))])])],
    providers: [
        {
            provide: IMAGE_LOADER,
            useValue: (config: ImageLoaderConfig) => {
                const cdnUrl = (environment.cdn as boolean) ? environment.cdnUrl : ''
                return `${cdnUrl}/${encodeURI(config.src)}?imageView2/2/w/${config.width}`
            },
        },
    ],
})
export class ProjectTileComponent {
    @Input() project!: Project
    @Input() delay = 500

    loading$ = new BehaviorSubject(true)
    loaded$ = this.loading$.pipe(mergeMap(val => (val ? of(val) : of(val).pipe(delay(this.delay)))))

    cdnUrl = 'http://www.dl-atelier.com'
}
