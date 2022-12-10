import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations'
import { AfterViewInit, Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject, filter, tap } from 'rxjs'

import { Lang, Project } from '../project'
import { ProjectService } from '../project.service'
import { SliderAutoplayService } from '../slider/slider-autoplay.service'
import { SliderIndexService } from '../slider/slider-index.service'

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
                        animate('200ms ease', style({ transform: 'none' })),
                    ]),
                    query('app-project-gallery', [
                        style({ transform: 'scale(0.5)', opacity: 0 }),
                        stagger(50, [animate('200ms ease', style({ transform: 'none', opacity: '*' }))]),
                    ]),
                ]),
            ]),
            transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
        ]),
        trigger('myTrigger', [
            transition('* => 1', [style({ opacity: 0 }), animate('500ms ease-in', style({ opacity: 1 }))]),
        ]),
    ],
})
export class ProjectComponent implements OnInit, AfterViewInit {
    project!: Project

    imagePathes: Array<string> = []
    mainImagePath!: string

    loading$ = new BehaviorSubject(true)

    private _showDetails: boolean = false
    get showDetails(): boolean {
        return this._showDetails
    }
    set showDetails(val: boolean) {
        this._showDetails = val
        this.sliderAutoplay.autoplayable$.next(!val)
    }

    constructor(
        private route: ActivatedRoute,
        private titleService: Title,
        private projectService: ProjectService,
        private sliderIndex: SliderIndexService,
        private sliderAutoplay: SliderAutoplayService,
    ) {}

    ngOnInit(): void {
        const { name } = this.route.snapshot.params
        this.getProject(name)
    }

    private getProject(name: string): void {
        this.projectService.getProject(name).subscribe(([project, index]) => {
            this.project = project
            this.sliderIndex.itemChange$.next(index)

            this.titleService.setTitle(`大料建筑 - ${this.project.getLangField(Lang.cn, 'Title')}`)

            this.imagePathes = this.project.imagePaths
            this.mainImagePath = this.project.mainImagePath
            if (this.project.defaultDetails) this.showDetails = true
            /** 如果有图片，等待图片加载完再自动播放。 */
            if (this.mainImagePath) this.sliderAutoplay.autoplayable$.next(false)
        })
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

    onClick(event: Event, valid: boolean): void {
        event.stopPropagation()
        if (valid) this.showDetails = !this.showDetails
    }
    /**
     * 如果图片加载成功，将 loading 状态改为 false。
     * 无论图片加载成功或者失败，都根据 showDetails 设置是否允许自动播放的属性。
     * @param event 图片加载事件。
     */
    loadImageEvent(event: Event): void {
        if (event.type === 'load') {
            this.loading$.next(false)
        }
        this.sliderAutoplay.autoplayable$.next(!this.showDetails)
    }
}
