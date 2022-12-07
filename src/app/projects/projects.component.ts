import { animate, AnimationBuilder, query, stagger, style, transition, trigger } from '@angular/animations'
import { CdkPortalOutlet, ComponentPortal, Portal } from '@angular/cdk/portal'
import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { EMPTY, filter, Observable, ReplaySubject, startWith, switchMap, tap, timer } from 'rxjs'

import { Project } from '../project'
import { ProjectTileComponent } from '../project-tile/project-tile.component'
import { ProjectService } from '../project.service'

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
    animations: [
        trigger('randomImageTrigger', [
            transition(':leave', [animate('500ms ease-out', style({ opacity: 0.5 }))]),
            transition(':enter', [style({ opacity: 0.5 }), animate('500ms 500ms ease-in', style({ opacity: 1 }))]),
        ]),
        trigger('projectAnimations', [
            transition('* => true', [
                query('.project', [
                    style({ opacity: 0, transform: 'translateY(25%)' }),
                    stagger(100, [animate('500ms ease-in-out', style({ opacity: 1, transform: 'none' }))]),
                ]),
            ]),
        ]),
    ],
})
export class ProjectsComponent implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit {
    @Input() projects!: Array<Project>

    @ViewChildren(ProjectTileComponent) tilePortalContents!: QueryList<ProjectTileComponent>
    @ViewChild(CdkPortalOutlet) imgPortalOutlet!: CdkPortalOutlet

    randomImagePortal?: Portal<any>

    disableRandomImage$ = new ReplaySubject<boolean>(1)
    navEnd$!: Observable<NavigationEnd>

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,
        private _builder: AnimationBuilder,
        private titleService: Title,
        private projectService: ProjectService,
    ) {
        this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe(() => {
            this.route.firstChild?.data.subscribe(data =>
                this.disableRandomImage$.next(data['disableRandomImage'] as boolean),
            )
        })
    }

    ngOnInit(): void {
        if (this.projects === undefined) {
            this.getProjects()
        }
        this.titleService.setTitle('大料建筑 / DL Atelier')
    }

    ngAfterContentChecked(): void {
        this.cdref.detectChanges()
    }

    ngAfterViewInit(): void {
        const autoPlayable$ = new ReplaySubject<boolean>(1)
        autoPlayable$
            .pipe(
                startWith(true),
                switchMap(playable =>
                    playable
                        ? this.disableRandomImage$.pipe(
                              startWith(true),
                              switchMap(disable => (disable ? timer(0) : timer(0, 2000))),
                          )
                        : EMPTY,
                ),
                tap(() => this.attachRandomImagePortal()),
            )
            .subscribe()
        if (this.tilePortalContents.length > 0) autoPlayable$.next(true)

        this.tilePortalContents.changes.subscribe(_ => autoPlayable$.next(true))
    }

    ngOnDestroy(): void {
        this._unsubGetProjects()
    }

    getProjects(): void {
        const sub = this.projectService.getProjects().subscribe(projects => {
            this.projects = projects
        })
        this._unsubGetProjects = sub.unsubscribe
    }

    private _unsubGetProjects(): void {}

    attachRandomImagePortal(): void {
        const portal = new ComponentPortal(ProjectTileComponent)
        this.randomImagePortal = portal
        this.imgPortalOutlet.attached.subscribe(ref => {
            ref = ref as ComponentRef<ProjectTileComponent>
            const randomAnimation = this._builder.build([
                style({ opacity: 0.5 }),
                animate('500ms ease-in', style({ opacity: 1 })),
            ])
            const player = randomAnimation.create(ref.location.nativeElement)

            ref.setInput('forbiddenLoading', true)

            const val = this.tilePortalContents
            const imgContent = val.get(Math.floor(Math.random() * val.length))
            ref.setInput('project', imgContent?.project)

            player.play()
        })
    }
}
