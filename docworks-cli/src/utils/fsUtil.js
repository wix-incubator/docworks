'use strict'
const fsExtra = require('fs-extra')

const isFile = path => path && fsExtra.statSync(path).isFile()
const not = func => value => !func(value)
const isNotFile = not(isFile)

function getAllFilesInDirSync(path) {
    if (!path) {
        return []
    }
    const fsStat = fsExtra.statSync(path)
    if (fsStat.isFile()) {
        return [path]
    }
    let result = []
    if (fsStat.isDirectory()) {
        const items = fsExtra.readdirSync(path).map(fileName => `${path}/${fileName}`)
        const directoryFiles = items.filter(isFile)
        result = result.concat(directoryFiles)
        const subDirectories = items.filter(isNotFile)
        for (let i = 0; i < subDirectories.length; i++) {
            result = result.concat(getAllFilesInDirSync(subDirectories[i]))
        }
        return result
    }
    return result
}

function writeOutput(outputFileName, fileContent) {
    return fsExtra.outputFile(outputFileName, fileContent)
}

module.exports = {
    getAllFilesInDirSync,
    writeOutput
}
