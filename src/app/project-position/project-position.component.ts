import { animate, state, style, transition, trigger } from '@angular/animations'
import { Overlay } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core'
import { MatRadioButton } from '@angular/material/radio'
import { fromEvent } from 'rxjs'
import { Project } from '../project'

@Component({
    selector: 'app-project-position',
    templateUrl: './project-position.component.html',
    styleUrls: ['./project-position.component.scss'],
    animations: [
        trigger('overlayTrigger', [
            transition(':enter', [
                style({ position: 'relative', opacity: 0, transform: 'translateY(12px)' }),
                animate('1000ms ease-in', style({ opacity: 1, transform: 'none' })),
            ]),
            transition(':leave', [
                style({ position: 'relative', opacity: 1 }),
                animate('1000ms ease-out', style({ opacity: 0, transform: 'translateY(12px)' })),
            ]),
        ]),
    ],
})
export class ProjectPositionComponent {
    @Input() index: number = 0
    @Output() indexChange = new EventEmitter<number>()

    @Input() projects: Array<Project> | null = null

    @ViewChildren(MatRadioButton) radios!: QueryList<MatRadioButton>
    @ViewChild('overlay', { static: false }) overlayTemplate!: TemplateRef<any>

    constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

    onClickOption(index: number): void {
        this.index = index
        this.indexChange.emit(this.index)
    }

    onMouseEnter(event: Event, index: number): void {
        if (this.projects === null || index >= this.projects.length) {
            return
        }
        const elementRef = new ElementRef(event.currentTarget)

        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(elementRef)
            .withPositions([
                {
                    originX: 'center',
                    originY: 'top',
                    overlayX: 'center',
                    overlayY: 'bottom',
                    offsetY: -12,
                },
            ])
            .withFlexibleDimensions(false)
        const overlayRef = this.overlay.create({
            positionStrategy, // 位置策略
            scrollStrategy: this.overlay.scrollStrategies.reposition(), // 滚动策略
            width: 200,
            hasBackdrop: false, // 是否显示遮罩层
        })
        const project = this.projects[index]
        overlayRef.attach(
            new TemplatePortal(this.overlayTemplate, this.viewContainerRef, {
                url: project.mainImagePath('images'),
                name: project.name,
            }),
        )
        const mouseLeave = fromEvent(event.currentTarget!, 'mouseleave')
        const subscription = mouseLeave.subscribe(evt => {
            if (overlayRef.hasAttached()) {
                overlayRef.detach()
            }
            subscription.unsubscribe()
        })
    }
}
