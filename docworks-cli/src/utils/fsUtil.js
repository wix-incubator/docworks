'use strict'
const fs = require('fs-extra')

const isFile = path => path && fs.statSync(path).isFile()
const not = func => value => !func(value)
const isNotFile = not(isFile)

function getAllFilesInDirSync(path) {
    if (!path) {
        return []
    }
    const fsStat = fs.statSync(path)
    if (fsStat.isFile()) {
        return [path]
    }
    let result = []
    if (fsStat.isDirectory()) {
        const items = fs.readdirSync(path).map(fileName => `${path}/${fileName}`)
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

module.exports = {
    getAllFilesInDirSync
}
