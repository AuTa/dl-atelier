import { animate, style, transition, trigger } from '@angular/animations'
import { Component, Input } from '@angular/core'

import { Project } from '../project'

@Component({
    selector: 'app-project-tile',
    templateUrl: './project-tile.component.html',
    styleUrls: ['./project-tile.component.scss'],
    animations: [trigger('loadingTrigger', [transition(':leave', [animate('500ms', style({ opacity: 0 }))])])],
})
export class ProjectTileComponent {
    @Input() project!: Project

    loading = true
}
