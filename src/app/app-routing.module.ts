import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { IndexComponent } from './index/index.component'
import { ProjectsComponent } from './projects/projects.component'
import { SliderComponent } from './slider/slider.component'

const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent,
        children: [
            { path: '', component: IndexComponent, data: { disableRandomImage: true } },
            { path: 'projects', children: [], data: { disableRandomImage: false } },
        ],
    },
    { path: 'projects/:name', component: SliderComponent },
]

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
