import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, Input } from '@angular/core'

import { Project } from '../project'

@Component({
    selector: 'app-project-gallery',
    templateUrl: './project-gallery.component.html',
    styleUrls: ['./project-gallery.component.scss'],
    animations: [
        trigger('imgLoaded', [
            state('false', style({ opacity: 0.5 })),
            transition('false => true', [style({ opacity: 0.5 }), animate('500ms ease-in', style({ opacity: '*' }))]),
        ]),
    ],
})
export class ProjectGalleryComponent {
    @Input() project!: Project
    @Input() imagePath: string = ''

    loaded = false

    constructor() {}
}
