import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import { Project } from '../project'

@Component({
    selector: 'app-project-gallery',
    templateUrl: './project-gallery.component.html',
    styleUrls: ['./project-gallery.component.scss'],
})
export class ProjectGalleryComponent implements OnInit {
    @Input() project!: Project
    @Input() imagePath: string = ''

    constructor() {}

    ngOnInit(): void {}
}
