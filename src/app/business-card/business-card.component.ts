import {Component, Input, OnInit} from '@angular/core'

@Component({
    selector: 'app-business-card',
    templateUrl: './business-card.component.html',
    styleUrls: ['./business-card.component.scss'],
})
export class BusinessCardComponent implements OnInit {
    email?: string
    telephone?: string
    mobilephone?: string
    address_1?: string
    address_2?: string

    @Input() hiddenEmail = false
    @Input() hiddenTelephone = false
    @Input() hiddenMobilephone = false
    @Input() hiddenAddress = false

    ngOnInit() {
        this.email = 'L@dl-atelier.com'
        this.telephone = '+86-10-84083292'
        this.mobilephone = '13810159637'
        this.address_1 = '中国 北京 东城区'
        this.address_2 = '国子监街 36号'
    }
}
