import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core'
import { first, interval } from 'rxjs'

@Directive({
    selector: '[appIfChanges]',
})
export class IfChangesDirective {
    private currentValue: any
    private hasView = false
    private leaveTransitionDuration: number = 0

    constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<any>) {}

    @Input() set appIfChanges(val: any) {
        if (!this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef)
            this.hasView = true
        } else if (val !== this.currentValue) {
            this.viewContainer.clear()
            this.viewContainer.createEmbeddedView(this.templateRef)
            this.currentValue = val
        }
    }
    // TODO: 变动时是否会同时存在？
    @Input() set ngIfAnimation(object: { data: any; leaveTransitionDuration: number }) {
        this.leaveTransitionDuration = object.leaveTransitionDuration
        this.viewContainer.clear()
        if (object.data) this.add_new_view()
        this.currentValue = object.data
    }

    private get delay(): number {
        return this.currentValue ? this.leaveTransitionDuration : 0
    }
    private add_new_view(): void {
        interval(this.delay) // timeout until `:leave` animation is ran
            .pipe(first())
            .subscribe(() => {
                this.viewContainer.createEmbeddedView(this.templateRef)
            })
    }
}
