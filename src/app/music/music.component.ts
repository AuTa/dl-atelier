import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { from, tap, catchError, of } from 'rxjs'

@Component({
    selector: 'app-music',
    templateUrl: './music.component.html',
    styleUrls: ['./music.component.scss'],
})
export class MusicComponent implements AfterViewInit {
    isPlay = false

    @ViewChild('audio') audio!: ElementRef<HTMLAudioElement>
    @ViewChild('play') playButton!: MatIconButton

    ngAfterViewInit(): void {
        const audio = this.audio.nativeElement
        from(audio.play())
            .pipe(
                tap(() => {
                    this.isPlay = true
                }),
                catchError(error => {
                    this.playButton
                    this.playButton.color = 'accent'
                    return of(error)
                }),
            )
            .subscribe()
    }

    onClick(): void {
        this.isPlay = !this.isPlay
        this.isPlay
            ? from(this.audio.nativeElement.play()).subscribe(() => (this.playButton.color = undefined))
            : this.audio.nativeElement.pause()
    }
}
