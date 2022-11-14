import { animateChild, group, query, transition, trigger } from '@angular/animations'
import { Component, OnInit } from '@angular/core'
import { ChildrenOutletContexts } from '@angular/router'
import { Project } from './project'
import { ProjectService } from './project.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = '大料建筑'
}
