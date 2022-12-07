import { animate, animateChild, group, query, stagger, style, transition, trigger } from '@angular/animations'
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { filter, tap } from 'rxjs'

import { Lang, Project } from '../project'

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    animations: [
        trigger('myInsertRemoveTrigger', [
            transition(':enter', [
                group([
                    query('app-project-description', [
                        style({ transform: 'translateX(-50%)' }),
                        animate('500ms ease-in', style({ transform: 'none' })),
                    ]),
                    query('app-project-gallery', [
                        style({ transform: 'scale(0.5)', opacity: 0 }),
                        stagger(100, [animate('500ms ease-in', style({ transform: 'none', opacity: '*' }))]),
                    ]),
                ]),
            ]),
            transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
        ]),
        trigger('myTrigger', [
            transition('* => *', [style({ opacity: 0 }), animate('500ms ease-in', style({ opacity: 1 }))]),
        ]),
    ],
})
export class ProjectComponent implements OnChanges, AfterViewInit {
    @Input() project!: Project
    @Input() navHidden?: boolean
    @Output() navHiddenChange = new EventEmitter<boolean>()
    @Output() playableChange = new EventEmitter<boolean>()

    imagePathes: Array<string> = []
    mainImagePath: string = ''

    private _showDetails: boolean = false
    get showDetails(): boolean {
        return this._showDetails
    }
    set showDetails(val: boolean) {
        this._showDetails = val
        this.navHiddenChange.emit(val)
        this.playableChange.emit(!val)
    }
    preMainImagePath?: string

    constructor(private route: ActivatedRoute, private titleService: Title) {}

    ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            switch (propName) {
                case 'project': {
                    if (this.project === undefined) {
                        this.project = new Project()
                    }
                    const chng = changes['project']
                    if (!chng.isFirstChange()) {
                        this.preMainImagePath = (chng.previousValue as Project).mainImagePath(this.imageBasePath)
                    }
                    this.titleService.setTitle(`大料建筑 - ${this.project.getLangField(Lang.cn, 'Title')}`)

                    this.imagePathes = this.project.imagePaths(this.imageBasePath)
                    this.mainImagePath = this.project.mainImagePath(this.imageBasePath)
                }
            }
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.route.fragment
                .pipe(
                    filter(fragment => fragment == 'details'),
                    tap(_ => (this.showDetails = true)),
                )
                .subscribe()
        })
    }
    imageBasePath = 'images'

    onClick(event: Event, valid: boolean): void {
        event.stopPropagation()
        if (valid) {
            this.showDetails = !this.showDetails
        }
    }
}
