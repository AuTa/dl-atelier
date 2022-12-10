import { NgIterable } from '@angular/core'
import { environment } from '../environments/environment'

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
    defaultDetails?: boolean

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
     * 通过环境变量的图片文件夹属性构造出图片基础文件夹的路径。
     */
    get imageBaseFolder(): string {
        return environment.imageFolder ? `${environment.imageFolder}/` : ''
    }
    /**
     * 通过数据中的图片前缀构造出图片前缀的路径。
     */
    get imagePathFolder(): string {
        return this.imagePathPrefix ? `${this.imagePathPrefix}/` : ''
    }
    /**
     * 生成图片的完整路径。
     * @param imagePath 图片本身的路径。
     * @returns 图片完整的请求路径。
     */
    imageWholePath(imagePath: string): string {
        return `${this.imageBaseFolder}${this.imagePathFolder}${imagePath}`
    }
    /**
     * 通过索引获取图片地址。
     * @param imageIndex 图片索引。
     * @returns
     */
    imagePathByIndex(imageIndex: number = 0): string {
        return this.imageWholePath(`${imageIndex.toString().padStart(2, '0')}.jpg`)
    }
    /**
     * 返回主要背景图路径。
     * mainImage 优先于 mainImageIndex，都不存在则返回 ''。
     */
    get mainImagePath(): string {
        return this.mainImage
            ? this.imageWholePath(this.mainImage)
            : this.mainImageIndex
            ? this.imagePathByIndex(this.mainImageIndex)
            : ''
    }
    /**
     * 返回图片路径列表。
     * images 优先于 index。
     */
    get imagePaths(): Array<string> {
        if (this.images !== undefined && this.images.length > 0) {
            return this.images.map(imagePath => this.imageWholePath(imagePath))
        }
        let imagePathes = []
        for (let i = this.beginImageIndex; i < this.endImageIndex; i++) {
            const imagePath = this.imagePathByIndex(i)
            imagePathes.push(imagePath)
        }
        return imagePathes
    }
}
