import { Injectable } from '@angular/core'
import { forkJoin, last, map, mergeAll, Observable, of, ReplaySubject, scan, single, Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Type, plainToClass } from 'class-transformer'

import { Project } from './project'
import { from } from 'rxjs'
import { mergeMap } from 'rxjs'
import { Subscription } from 'rxjs'

class ProjectsJSON {
    @Type(() => Project)
    projects!: Array<Project>
}

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    PROJECTS = new ReplaySubject<Array<Project>>()
    subscription!: Subscription

    constructor(private http: HttpClient) {
        this.http
            .get<ProjectsJSON>('data.json')
            .pipe(
                map(data => {
                    let response = plainToClass(ProjectsJSON, data)
                    this.PROJECTS.next(response.projects)
                    return response.projects
                }),
            )
            .subscribe()
    }

    getProject(projectName: string): Observable<[Project, number]> {
        return this.PROJECTS.pipe(
            map(projects => {
                const project = projects.find(p => p.name === projectName)!
                const index = projects.indexOf(project)
                return [project, index] as [Project, number]
            }),
        )
    }

    getProjects(): Observable<Project[]> {
        return this.PROJECTS
    }
}
