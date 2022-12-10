import { animate, style, transition, trigger } from '@angular/animations'
import { Component, Input, OnInit } from '@angular/core'
import { BehaviorSubject, delay, mergeMap, of } from 'rxjs'

import { Project } from '../project'

@Component({
    selector: 'app-project-tile',
    templateUrl: './project-tile.component.html',
    styleUrls: ['./project-tile.component.scss'],
})
export class ProjectTileComponent implements OnInit {
    @Input() project!: Project
    @Input() forbiddenLoading: boolean = false

    mainImagePath?: string

    loading$ = new BehaviorSubject(true)

    ngOnInit(): void {
        this.mainImagePath = this.project.mainImagePath
    }
}
