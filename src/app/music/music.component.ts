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

    @ViewChild('audio') private _audio!: ElementRef<HTMLAudioElement>
    @ViewChild('play') playButton!: MatIconButton

    audio!: HTMLAudioElement

    ngAfterViewInit(): void {
        this.audio = this._audio.nativeElement
        from(this.audio.play())
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
            ? from(this._audio.nativeElement.play()).subscribe(() => (this.playButton.color = undefined))
            : this._audio.nativeElement.pause()
    }
}
