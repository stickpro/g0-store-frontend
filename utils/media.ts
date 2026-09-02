import type { ImageDTO } from '~/repository/types/api/generatedApiGo'
import { seoAbsoluteUrl } from '~/utils/seo'

export type ImagePresetName = 'thumb' | 'card' | 'pdp' | 'zoom'
export type ImageFormat = 'webp' | 'jpeg'

export type StoreImage = Pick<ImageDTO, 'id' | 'alt' | 'width' | 'height' | 'presets'>

const PRESET_FALLBACK: Record<ImagePresetName, ImagePresetName[]> = {
    thumb: ['thumb', 'card', 'pdp', 'zoom'],
    card: ['card', 'pdp', 'thumb', 'zoom'],
    pdp: ['pdp', 'zoom', 'card', 'thumb'],
    zoom: ['zoom', 'pdp', 'card', 'thumb'],
}

export function imagePresetPath(
    image: StoreImage | null | undefined,
    preset: ImagePresetName,
    format: ImageFormat,
): string | undefined {
    const formats = image?.presets?.[preset]
    if (!formats) return undefined
    if (formats[format]) return formats[format]
    if (format === 'jpeg') return formats.jpg
    return undefined
}

export function resolveImagePreset(
    image: StoreImage | null | undefined,
    preset: ImagePresetName,
): ImagePresetName | undefined {
    return PRESET_FALLBACK[preset].find((candidate) =>
        Boolean(imagePresetPath(image, candidate, 'jpeg') || imagePresetPath(image, candidate, 'webp')),
    )
}

export function imageSrc(
    storageUrl: string,
    image: StoreImage | null | undefined,
    preset: ImagePresetName,
    format: ImageFormat,
): string {
    const resolved = resolveImagePreset(image, preset)
    if (!resolved) return ''
    const path = imagePresetPath(image, resolved, format)
    return path ? seoAbsoluteUrl(storageUrl, path) : ''
}

export function imageHasMedia(image: StoreImage | null | undefined, preset: ImagePresetName): boolean {
    return Boolean(resolveImagePreset(image, preset))
}
