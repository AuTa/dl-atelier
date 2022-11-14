import { NgIterable } from '@angular/core'

enum Field {
    Title,
    Description,
    FactsFigures,
}
export enum Lang {
    cn = 'cn',
    en = 'en',
}
type FieldStrings = keyof typeof Field
export type LangStrings = keyof typeof Lang

export class Project {
    name!: string // 链接
    cnTitle!: string // 简体中文标题
    enTitle?: string // 英文标题
    cnFactsFigures?: string[]
    enFactsFigures?: string[]
    cnDescription?: string
    enDescription?: string
    imagePathPrefix?: string
    mainImageIndex?: number
    beginImageIndex!: number
    endImageIndex!: number

    getLangField(lang: LangStrings, field: FieldStrings): NgIterable<string> {
        const fieldMap: Record<FieldStrings, Record<LangStrings, () => string | string[]>> = {
            Title: { cn: () => this.cnTitle, en: () => this.enTitle ?? '' },
            Description: { cn: () => this.cnDescription ?? '', en: () => this.enDescription ?? '' },
            FactsFigures: {
                cn: () => this.cnFactsFigures ?? '',
                en: () => this.enFactsFigures ?? '',
            },
        }
        const f = fieldMap[field][lang]
        return f()
    }

    /**
     * 通过索引获取图片地址
     * @param imageBasePath - 图片存储位置
     * @param imageIndex
     * @returns
     */
    imagePathByIndex(imageBasePath: string, imageIndex: number = 0): string {
        return `${imageBasePath}/${this.imagePathPrefix}/${imageIndex
            .toString()
            .padStart(2, '0')}.jpg`
    }

    mainImagePath(imageBasePath: string): string {
        return this.imagePathByIndex(imageBasePath, this.mainImageIndex)
    }

    imagePaths(imageBasePath: string): Array<string> {
        let imagePathes = []
        for (let i = this.beginImageIndex; i < this.endImageIndex; i++) {
            let imagePath = `${imageBasePath}/${this.imagePathPrefix}/${i
                .toString()
                .padStart(2, '0')}.jpg`
            imagePathes.push(imagePath)
        }
        return imagePathes
    }
}
