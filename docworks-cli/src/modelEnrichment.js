'use strict'
const fs = require('fs-extra')
const {getAllFilesInDirSync} = require('./utils/fsUtil')

function enrichModel(mergedRepo, enrichingDocsDir) {
    const enrichmentJSON = readServicesEnrichmentDataFromDir(enrichingDocsDir)
    return enrichRepoModel(mergedRepo, enrichmentJSON)
}

function readServicesEnrichmentDataFromDir(enrichmentDataDirectoryPath) {
    let filesInDocsDir = getAllFilesInDirSync(enrichmentDataDirectoryPath)
    filesInDocsDir = filesInDocsDir.filter(filePath => filePath.toLowerCase().endsWith('ed.json'))
    return filesInDocsDir.reduce((docMap, enrichmentDocFile) => {
        const fileContent = fs.readFileSync(enrichmentDocFile, 'utf8')
        const fileContentAsJSON = JSON.parse(fileContent)
        docMap[fileContentAsJSON.name] = fileContentAsJSON.enrichment
        return docMap
    }, {})
}

function enrichRepoModel(repoToEnrich, enrichmentJSON) {
    repoToEnrich = repoToEnrich.map(entry => {
        const entryName = entry.name
        if (enrichmentJSON[entryName]) {
            return Object.assign({}, entry, enrichmentJSON[entryName])
        }
        return entry
    })
    return repoToEnrich
}

module.exports = {
  enrichModel
}
