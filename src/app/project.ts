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
    mainImage?: string // 主图链接，如果存在则不考虑索引。
    images?: string[] // 图片链接，如果存在则不考虑索引。

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

    get imagePathFolder(): string {
        return this.imagePathPrefix ? `${this.imagePathPrefix}/` : ''
    }

    /**
     * 通过索引获取图片地址
     * @param imageBasePath - 图片存储位置
     * @param imageIndex
     * @returns
     */
    imagePathByIndex(imageBasePath: string, imageIndex: number = 0): string {
        return `${imageBasePath}/${this.imagePathFolder}${imageIndex.toString().padStart(2, '0')}.jpg`
    }

    mainImagePath(imageBasePath: string): string {
        if (this.mainImageIndex === undefined) {
            return this.mainImage ? `${imageBasePath}/${this.imagePathFolder}${this.mainImage}` : ''
        }
        return this.imagePathByIndex(imageBasePath, this.mainImageIndex)
    }

    imagePaths(imageBasePath: string): Array<string> {
        if (this.images !== undefined && this.images.length > 0) {
            return this.images.map(imagePath => `${imageBasePath}/${this.imagePathFolder}${imagePath}`)
        }
        let imagePathes = []
        for (let i = this.beginImageIndex; i < this.endImageIndex; i++) {
            const imagePath = this.imagePathByIndex(imageBasePath, i)
            imagePathes.push(imagePath)
        }
        return imagePathes
    }
}
