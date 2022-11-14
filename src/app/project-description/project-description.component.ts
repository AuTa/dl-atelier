import { Component, Input } from '@angular/core'
import { Project, Lang } from '../project'

@Component({
    selector: 'app-project-description',
    templateUrl: './project-description.component.html',
    styleUrls: ['./project-description.component.scss'],
})
export class ProjectDescriptionComponent {
    @Input() project!: Project

    lang = Lang

    constructor() {}
}
