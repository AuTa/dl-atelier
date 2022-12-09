import { animate, style, transition, trigger } from '@angular/animations'
import { FlexibleConnectedPositionStrategyOrigin, Overlay, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import { Component, ElementRef, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core'
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
                animate('1000ms ease-in', style({ opacity: '*', transform: 'none' })),
            ]),
            transition(':leave', [
                style({ position: 'relative', opacity: 1 }),
                animate('1000ms ease-out', style({ opacity: 0, transform: 'translateY(12px)' })),
            ]),
        ]),
    ],
})
export class ProjectPositionComponent {
    @Input() projects: Array<Project> | null = null

    @ViewChild('overlay', { static: false }) overlayTemplate!: TemplateRef<any>

    constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

    overlayRefFactory(origin: FlexibleConnectedPositionStrategyOrigin): OverlayRef {
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(origin)
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
        return this.overlay.create({
            positionStrategy, // 位置策略
            scrollStrategy: this.overlay.scrollStrategies.reposition(), // 滚动策略
            width: 200,
            hasBackdrop: false, // 是否显示遮罩层
        })
    }

    onMouseEnter(event: Event, index: number): void {
        if (this.projects === null || index >= this.projects.length) {
            return
        }
        const project = this.projects[index]
        const elementRef = new ElementRef(event.currentTarget)
        const overlayRef = this.overlayRefFactory(elementRef)
        overlayRef.attach(
            new TemplatePortal(this.overlayTemplate, this.viewContainerRef, {
                url: project.mainImagePath('images'),
                name: project.name,
            }),
        )
        /**
         * MouseLeave Event Handler
         */
        const subscription = fromEvent(event.currentTarget!, 'mouseleave').subscribe(evt => {
            if (overlayRef.hasAttached()) {
                overlayRef.detach()
            }
            subscription.unsubscribe()
        })
    }
}
