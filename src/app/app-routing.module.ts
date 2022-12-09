import { NgModule } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    BaseRouteReuseStrategy,
    RouteReuseStrategy,
    RouterModule,
    Routes,
} from '@angular/router'

import { IndexComponent } from './index/index.component'
import { ProjectComponent } from './project/project.component'
import { ProjectsComponent } from './projects/projects.component'
import { ProjectSliderComponent } from './slider/slider.component'

const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent,
        children: [
            { path: '', component: IndexComponent, data: { disableRandomImage: true } },
            { path: 'projects', children: [], data: { disableRandomImage: false } },
        ],
    },
    {
        path: 'projects',
        component: ProjectSliderComponent,
        children: [{ path: ':name', component: ProjectComponent, data: { animation: 'ProjectPage' } }],
    },
]

class CustomRouteReuseStrategy extends BaseRouteReuseStrategy {
    override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        if (super.shouldReuseRoute(future, curr)) {
            switch (curr.component) {
                case ProjectComponent:
                    if (future.params !== curr.params) {
                        return false
                    }
            }
        }
        return super.shouldReuseRoute(future, curr)
    }
}

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    providers: [{ provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }],
    exports: [RouterModule],
})
export class AppRoutingModule {}
