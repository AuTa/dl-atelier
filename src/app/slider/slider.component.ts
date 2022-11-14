import { animate, style, transition, trigger } from '@angular/animations'
import { AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
    EMPTY,
    empty,
    filter,
    first,
    fromEvent,
    interval,
    map,
    Observable,
    ReplaySubject,
    scan,
    startWith,
    Subject,
    switchMap,
    take,
    takeUntil,
    takeWhile,
    tap,
    timer,
} from 'rxjs'

import { Project } from '../project'
import { ProjectService } from '../project.service'

/**
 * @private _index
 */
@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {
    private _index!: number

    @Input() projects!: Array<Project>
    @Input()
    get index(): number {
        return this._index
    }
    set index(i: number) {
        this._index = i
        this.autoPlayable$.next(true)

        if (this.projects === undefined || this.projects.length <= i) {
            return
        }
        const project = this.projects[this._index]
        if (project !== this.project) {
            this.project = project

            this.name$
                .pipe(
                    tap((name) => {
                        if (name != this.project.name) {
                            this.router.navigate([`/projects/${this.project.name}`])
                        }
                    }),
                )
                .subscribe()
        }
    }

    name$!: Observable<string | null>
    slideshowTimer$: Observable<number> = timer(7000)
    autoPlayable$ = new ReplaySubject<boolean>(1)
    unsubscribe$ = new Subject<void>()

    project!: Project
    navHidden = false

    @HostListener('window:keyup.arrowleft', ['$event'])
    onKeyUpLeft(event: KeyboardEvent) {
        this.autoPlayable$
            .pipe(
                first(),
                takeWhile((val) => val),
                tap(() => this.onClick('back')),
            )
            .subscribe()
    }
    @HostListener('window:keyup.arrowright', ['$event'])
    onKeyUpRight(event: KeyboardEvent) {
        this.autoPlayable$
            .pipe(
                first(),
                takeWhile((val) => val),
                tap(() => this.onClick('forward')),
            )
            .subscribe()
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private projectService: ProjectService,
    ) {
        this.name$ = this.route.paramMap.pipe(map((params) => params.get('name')))
    }

    ngOnInit(): void {
        if (this.projects === undefined) {
            this.getProjects()
        }
        this.getProject()
        this.name$.subscribe(() => this.getProject())
    }

    ngAfterViewInit(): void {
        const s = this.autoPlayable$
            .pipe(
                startWith(true),
                switchMap((playable) => (playable ? this.slideshowTimer$ : EMPTY)),
                tap(() => this.onClick('forward')),
                takeUntil(this.unsubscribe$),
            )
            .subscribe()
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next()
        this.autoPlayable$.unsubscribe()
    }

    getProject(): void {
        const name = this.route.snapshot.paramMap.get('name')!
        this.projectService.getProject(name).subscribe(([, index]) => (this.index = index))
    }

    getProjects(): void {
        this.projectService.getProjects().subscribe((projects) => {
            this.projects = projects
        })
    }

    onClick(action: string): void {
        switch (action) {
            case 'back':
                if (this.index > 0) {
                    --this.index
                }
                break
            case 'forward':
                if (this.index < this.projects.length - 1) {
                    ++this.index
                } else {
                    this.autoPlayable$.next(false)
                }
                break
            default:
                break
        }
    }

    changePlayable(state: boolean): void {
        this.autoPlayable$.next(state)
    }
}
