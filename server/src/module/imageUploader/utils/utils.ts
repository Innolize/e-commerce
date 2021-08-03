import { ImageUploaderError } from "../error/imageUploaderError"

export const obtainExtension = (filename: string): string => {
    console.log(filename)
    const extension = filename.split(".").pop()
    if (!extension) {
        throw ImageUploaderError.inexistentExtension()
    }
    return extension
}

export const obtainFilename = (filepath: string): string | Error => {
    const filename = filepath.split("/").pop()
    if (!filename) {
        throw ImageUploaderError.UnexpectedPath()
    }
    return filename
}