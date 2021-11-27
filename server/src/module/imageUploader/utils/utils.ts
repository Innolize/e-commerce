import { ImageUploaderError } from "../error/imageUploaderError"

export const obtainExtension = (filename: string): string => {
    console.log(filename)
    const extension = filename.split(".").pop()
    if (!extension || extension === filename) {
        throw ImageUploaderError.inexistentExtension()
    }
    return extension
}

export const obtainFilename = (filepath: string): string => {
    const filename = filepath.split("/").pop()
    if (!filename || filename === filepath) {
        throw ImageUploaderError.UnexpectedPath()
    }
    return filename
}