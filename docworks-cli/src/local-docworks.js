'use strict'
const runJsDoc = require('docworks-jsdoc2spec')
const {merge, readFromDir, saveToDir} = require('docworks-repo')
const {join} = require('path')
const fs = require('fs-extra')
const logger = require('./logger')
const Git = require('./git')
const {runPlugins} = require('./plugins')
const {getAllFilesInDirSync} = require('./utils/fsUtil')
const {enrichModel} = require('./modelEnrichment')

const VEE_CHAR = '\u2713'

function logTaskConfig(outputDirectory, workingDir, projectSubdir, jsDocSources, plugins) {
    logger.newLine()
    logger.config('output dir:        ', outputDirectory) // the dist for docworks
    logger.config('working dir:       ', workingDir) // the (temp) working dir
    logger.config('project dir:       ', projectSubdir) // the project name (namespace/subdir for working dir)
    logger.config('jsdoc sources:     ', JSON.stringify(jsDocSources)) // jsDocs
    logger.config('plugins:           ', plugins.join(', '))
    logger.newLine()
}

function getChangedAndNewSrcFiles(srcDir, targetDir) {
    const differentFiles = []
    const allFilesInSrc = getAllFilesInDirSync(srcDir)
    for (let i = 0; i < allFilesInSrc.length; i++) {
        const srcFilePath = allFilesInSrc[i]
        const targetFilePath = srcFilePath.replace(srcDir, targetDir)
        if (fs.existsSync(targetFilePath)) {
            if (areFilesDifferent(srcFilePath, targetFilePath)) {
                differentFiles.push(srcFilePath)
            }
        } else {
            differentFiles.push(srcFilePath)
        }
    }
    return differentFiles
}

const areFilesDifferent = (fileA, fileB) => readFileContent(fileA) !== readFileContent(fileB)
const readFileContent = fileToRead => fs.readFileSync(fileToRead, 'utf8')

async function copyDiffedFilesToOutputDirectory(srcDir, targetDir) {
    const differentFiles = getChangedAndNewSrcFiles(srcDir, targetDir)
    if (!differentFiles || differentFiles.length === 0) {
        logger.log('-- No changes detected.')
        return
    }

    await fs.ensureDir(targetDir)

    differentFiles.forEach(srcFileToCopy => {
        fs.copySync(srcFileToCopy, srcFileToCopy.replace(srcDir, targetDir), {overwrite: true})
    })
}

async function cloneGitRepoToDirectory(remoteRepo, targetDir) {
    await fs.ensureDir(targetDir)

    const baseGit = new Git()
    logger.command('git', `clone ${remoteRepo} ${targetDir}`)
    await baseGit.clone(remoteRepo, targetDir)

}

async function gitCheckoutExistingOrNewBranch(repoDirectory, branchName, fallbackBranchToCreate) {
    if (branchName) {
        await checkoutExistingBranch(repoDirectory, branchName, fallbackBranchToCreate)
    } else {
        await checkoutNewBranch(repoDirectory, fallbackBranchToCreate)
    }
}

async function checkoutExistingBranch(repoDirectory, branchName, fallbackBranchName) {
    const localGit = new Git(repoDirectory)
    try {
        logger.command('git', `checkout ${branchName}`)
        await localGit.checkout(branchName)
    }
    catch (e) {
        await checkoutNewBranch(repoDirectory, fallbackBranchName)
        logger.warn(`cant checkout branch ${branchName}. created ${fallbackBranchName} on top of master`)
    }
}

async function checkoutNewBranch(repoDirectory, branchNameToCreate) {
    const localGit = new Git(repoDirectory)
    try {
        logger.command('git', `checkout -b ${branchNameToCreate}`)
        await localGit.checkout(`-b${branchNameToCreate}`)
    } catch (e) {
        logger.error('Failed to create a new branch on top of master. Aborting.')
        process.exit(1)
    }
}

function createUniqueId(prefix) {
    const suffix = Date.now().toString(36)
    return (prefix + suffix).trim()
}


async function localDocworks({remoteRepo, branch, outputDirectory, tmpDir, projectDir, jsDocSources, plugins, enrichmentDocsDir, dryRun}) {
    logTaskConfig(outputDirectory, tmpDir, projectDir, jsDocSources, plugins)

    try {
        await cloneGitRepoToDirectory(remoteRepo, tmpDir)

        const workingSubdir = join(tmpDir, projectDir)
        await gitCheckoutExistingOrNewBranch(tmpDir, branch, createUniqueId('localdocs-'))

        logger.command('docworks', `extractDocs ${jsDocSources.include} ${jsDocSources.includePattern}`)
        const {services, errors} = runJsDoc(jsDocSources, plugins)
        logger.jsDocErrors(errors)

        logger.command("deleting ", workingSubdir)
        fs.emptyDirSync(workingSubdir);
        await fs.ensureDir(workingSubdir)
        logger.command('docworks', `readServices ${workingSubdir}`)
        const repoContent = await readFromDir(workingSubdir)

        logger.command('docworks', 'merge')
        const merged = merge(services, repoContent.services, plugins)

        let enriched = merged.repo
        if (enrichmentDocsDir) {
            logger.command('docworks', 'enrichment')
            enriched = enrichModel(merged.repo, enrichmentDocsDir)
        }

        

        logger.command('docworks', `saveServices ${workingSubdir}`)
        await saveToDir(workingSubdir, enriched)

        logger.log('  running ecpAfterMerge plugins')
        await runPlugins(plugins, 'ecpAfterMerge', tmpDir, projectDir)

        if (dryRun) {
            logger.newLine()
            logger.success(VEE_CHAR, '[Dry run] local docworks completed successfully. No output.')
        } else {
            copyDiffedFilesToOutputDirectory(tmpDir, outputDirectory)

            logger.newLine()
            logger.success(VEE_CHAR, 'local docworks completed successfully, see output: ' + outputDirectory)
        }
    }
    catch (error) {
        logger.error('Failed to complete workflow\n', error.stack)
        throw error
    }

}

module.exports = localDocworks
