export const obtainExtension = (filename: string): string | Error => {
    const extension = filename.split(".").pop()
    if (!extension) {
        throw Error("Filename has no extension")
    }
    return extension
}

export const obtainFilename = (filepath: string): string | Error => {
    const filename = filepath.split("/").pop()
    if (!filename) {
        throw Error("Unexpected image path")
    }
    return filename
}