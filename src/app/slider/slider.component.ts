/**
 * https://medium.com/frontend-coach/angular-router-animations-what-they-dont-tell-you-3d2737a7f20b
 * https://stackblitz.com/edit/angular-child-route-animation
 */
import { animate, group, query, style, transition, trigger } from '@angular/animations'
import { AfterContentChecked, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, ChildrenOutletContexts, Router } from '@angular/router'
import {
    combineLatest,
    EMPTY,
    map,
    Observable,
    of,
    pairwise,
    ReplaySubject,
    share,
    startWith,
    Subject,
    switchMap,
    take,
    takeUntil,
    tap,
    timer,
} from 'rxjs'

import { Project } from '../project'
import { ProjectService } from '../project.service'
import { SliderAutoplayService } from './slider-autoplay.service'
import { SliderIndexService } from './slider-index.service'

enum navState {
    prev = -1,
    next = 1,
}

/**
 * @private _index
 */
@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    providers: [SliderIndexService, SliderAutoplayService],
    animations: [
        trigger('routeSlide', [
            transition('* => -1', []),
            transition(':increment, :decrement', [
                style({ position: 'relative' }),
                query(':enter, :leave', [
                    style({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }),
                ]),
                group([
                    query(
                        ':enter',
                        [
                            style({ transform: 'translateX({{offsetEnter}}%)' }),
                            animate('800ms ease-in-out', style({ transform: 'translateX(0%)' })),
                        ],
                        { optional: true },
                    ),
                    query(
                        ':leave',
                        [
                            style({ transform: 'translateX(0%)' }),
                            animate('800ms ease-in-out', style({ transform: 'translateX({{offsetLeave}}%)' })),
                        ],
                        { optional: true },
                    ),
                ]),
            ]),
        ]),
    ],
})
export class ProjectSliderComponent implements OnInit, AfterContentChecked, OnDestroy {
    projects!: Array<Project>
    unsubscribe$ = new Subject<void>()

    slideshowTimer$: Observable<number> = timer(7000)
    autoplayable$: ReplaySubject<boolean>
    itemChange$: Observable<number>
    next$!: Observable<string>
    prev$!: Observable<string>
    routeTrigger$!: Observable<object>

    @HostListener('window:keyup.arrowleft', ['$event'])
    onKeyUpLeft(event: KeyboardEvent) {
        this.navigateByKey(navState.prev)
    }

    @HostListener('window:keyup.arrowright', ['$event'])
    onKeyUpRight(event: KeyboardEvent) {
        this.navigateByKey(navState.next)
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private contexts: ChildrenOutletContexts,
        private cdref: ChangeDetectorRef,
        private projectService: ProjectService,
        private itemsIndex: SliderIndexService,
        private autoplay: SliderAutoplayService,
    ) {
        this.autoplayable$ = this.autoplay.autoplayable$
        this.itemChange$ = this.itemsIndex.itemChange$
        this.routeTrigger$ = this.itemChange$.pipe(
            startWith(-1),
            pairwise(),
            map(([prev, curr]) => ({
                value: curr,
                params: {
                    offsetEnter: prev > curr ? -100 : 100,
                    offsetLeave: prev > curr ? 100 : -100,
                },
            })),
        )
    }

    ngOnInit(): void {
        this.getProjects()
    }

    ngAfterContentChecked(): void {
        this.cdref.detectChanges()
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next()
    }

    private getProjects(): void {
        this.projectService.getProjects().subscribe(projects => {
            this.projects = projects
            this.setupRouting()
            this.setupAutoPlay()
        })
    }

    private setupRouting(): void {
        this.prev$ = this.itemChange$.pipe(
            map(index => (index === 0 ? index : index - 1)),
            map(index => this.projects[index].name),
            share(),
        )
        this.next$ = this.itemChange$.pipe(
            map(index => (index === this.projects.length - 1 ? index : index + 1)),
            map(index => {
                return this.projects[index].name
            }),
            share(),
        )
    }

    private setupAutoPlay(): void {
        combineLatest([this.itemChange$, this.autoplayable$.pipe(startWith(true))])
            .pipe(
                switchMap(([itemIndex, autoplayable]: [number, boolean]) =>
                    (!autoplayable || itemIndex === this.projects.length - 1 ? EMPTY : this.slideshowTimer$).pipe(
                        map(() => itemIndex),
                    ),
                ),
                tap(index => this.goToProject(index + 1)),
                takeUntil(this.unsubscribe$),
            )
            .subscribe()
    }
    /**
     * 通过按键导航。
     * @param state 导航状态的选择
     */
    navigateByKey(state: navState): void {
        let extreme = 0
        if (state === navState.next) {
            extreme = this.projects.length - 1
        }
        this.itemChange$
            .pipe(
                take(1),
                switchMap(index => (index === extreme ? EMPTY : of(index + state))),
                tap(index => this.goToProject(index)),
                tap(() => this.autoplayable$.next(true)),
            )
            .subscribe()
    }

    goToProject(index: number): void {
        const name = this.projects[index].name
        this.router.navigate([name], { relativeTo: this.route, skipLocationChange: false })
    }

    getRouteAnimationData() {
        return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation']
    }
}
