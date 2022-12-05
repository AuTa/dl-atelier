import 'reflect-metadata'

import { OverlayModule } from '@angular/cdk/overlay'
import { PortalModule } from '@angular/cdk/portal'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatRippleModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BusinessCardComponent } from './business-card/business-card.component'
import { IfChangesDirective } from './if-changes.directive'
import { IndexComponent } from './index/index.component'
import { ProjectDescriptionComponent } from './project-description/project-description.component'
import { ProjectGalleryComponent } from './project-gallery/project-gallery.component'
import { ProjectPositionComponent } from './project-position/project-position.component'
import { ProjectTileComponent } from './project-tile/project-tile.component'
import { ProjectComponent } from './project/project.component'
import { ProjectsComponent } from './projects/projects.component'
import { SliderComponent } from './slider/slider.component'

@NgModule({
    declarations: [
        AppComponent,
        ProjectComponent,
        ProjectGalleryComponent,
        SliderComponent,
        ProjectPositionComponent,
        ProjectsComponent,
        ProjectDescriptionComponent,
        IfChangesDirective,
        IndexComponent,
        BusinessCardComponent,
        ProjectTileComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule,
        MatCardModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        OverlayModule,
        PortalModule,
        HttpClientModule,
    ],
    providers: [
        {
            provide: MAT_RADIO_DEFAULT_OPTIONS,
            useValue: { color: 'accent' },
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
