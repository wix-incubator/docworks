'use strict';
import runJsDoc from 'docworks-jsdoc2spec';
import {merge, readFromDir, saveToDir} from 'docworks-repo';
import {join} from 'path';
import fs from 'fs-extra';
import * as logger from './logger';
import Git from "./git";
import {runPlugins} from './plugins';

const VEE_CHAR = '\u2713';

function logTaskConfig(outputDirectory, workingDir, projectSubdir, jsDocSources, plugins) {
    logger.newLine();
    logger.config(`output dir:        `, outputDirectory); // the dist for docworks
    logger.config(`working dir:       `, workingDir); // the (temp) working dir
    logger.config(`project dir:       `, projectSubdir); // the project name (namespace/subdir for working dir)
    logger.config(`jsdoc sources:     `, JSON.stringify(jsDocSources)); // jsDocs
    logger.config(`plugins:           `, plugins.join(', '));
    logger.newLine();
}

const isFile = path => path && fs.statSync(path).isFile();
const not = func => value => !func(value);

function getAllFilesInDir(path) {
    if (!path) {
        return [];
    }
    const fsStat = fs.statSync(path);
    if (fsStat.isFile()) {
        return [path];
    }
    let result = [];
    if (fsStat.isDirectory()) {
        const items = fs.readdirSync(path).map(fileName => `${path}/${fileName}`);
        const directoryFiles = items.filter(isFile);
        result = result.concat(directoryFiles);
        const subDirectories = items.filter(not(isFile));
        for (let i = 0; i < subDirectories.length; i++) {
            result = result.concat(getAllFilesInDir(subDirectories[i]));
        }
        return result;
    }
    return result;
}

function getChangedAndNewSrcFiles(srcDir, targetDir) {
    const differentFiles = [];
    const allFilesInSrc = getAllFilesInDir(srcDir);
    for (let i = 0; i < allFilesInSrc.length; i++) {
        const srcFilePath = allFilesInSrc[i];
        const targetFilePath = srcFilePath.replace(srcDir, targetDir);
        if (fs.existsSync(targetFilePath)) {
            if (areFilesDifferent(srcFilePath, targetFilePath)) {
                differentFiles.push(srcFilePath);
            }
        } else {
            differentFiles.push(srcFilePath);
        }
    }
    return differentFiles;
}

const areFilesDifferent = (fileA, fileB) => readFileContent(fileA) !== readFileContent(fileB);
const readFileContent = fileToRead => fs.readFileSync(fileToRead, 'utf8');

async function copyDiffedFilesToOutputDirectory(srcDir, targetDir) {
    const differentFiles = getChangedAndNewSrcFiles(srcDir, targetDir);
    if (!differentFiles || differentFiles.length === 0) {
        logger.log('-- No changes detected.');
        return;
    }

    await fs.ensureDir(targetDir);

    differentFiles.forEach(srcFileToCopy => {
        fs.copySync(srcFileToCopy, srcFileToCopy.replace(srcDir, targetDir), {overwrite: true});
    });
}

async function cloneGitRepoToDirectory(remoteRepo, targetDir) {
    await fs.ensureDir(targetDir);

    const baseGit = new Git();
    logger.command('git', `clone ${remoteRepo} ${targetDir}`);
    await baseGit.clone(remoteRepo, targetDir);

}

async function gitCheckoutExistingOrNewBranch(repoDirectory, branchName, fallbackBranchToCreate) {
    if (branchName) {
        await checkoutExistingBranch(repoDirectory, branchName, fallbackBranchToCreate);
    } else {
        await checkoutNewBranch(repoDirectory, fallbackBranchToCreate);
    }
}

async function checkoutExistingBranch(repoDirectory, branchName, fallbackBranchName) {
    const localGit = new Git(repoDirectory);
    try {
        logger.command('git', `checkout ${branchName}`);
        await localGit.checkout(branchName);
    }
    catch (e) {
        await checkoutNewBranch(repoDirectory, fallbackBranchName);
        logger.warn(`cant checkout branch ${branchName}. created ${fallbackBranchName} on top of master`);
    }
}

async function checkoutNewBranch(repoDirectory, branchNameToCreate) {
    const localGit = new Git(repoDirectory);
    try {
        logger.command('git', `checkout -b ${branchNameToCreate}`);
        await localGit.checkout(`-b${branchNameToCreate}`);
    } catch (e) {
        logger.error('Failed to create a new branch on top of master. Aborting.');
        process.exit(1);
    }
}

function createUniqueId(prefix) {
    const suffix = Date.now().toString(36);
    return (prefix + suffix).trim();
}


function enrichModel(mergedRepo, enrichingDocsDir) {
    const enrichmentJSON = readServicesEnrichmentDataFromDir(enrichingDocsDir);
    return enrichRepoModel(mergedRepo, enrichmentJSON)
}

function readServicesEnrichmentDataFromDir(enrichmentDataDirectoryPath) {
    let filesInDocsDir = getAllFilesInDir(enrichmentDataDirectoryPath)
    filesInDocsDir = filesInDocsDir.filter(filePath => filePath.toLowerCase().endsWith('ed.json'))
    return filesInDocsDir.reduce((docMap, enrichmentDocFile) => {
        const fileContent = fs.readFileSync(enrichmentDocFile, 'utf8')
        const fileContentAsJSON = JSON.parse(fileContent)
        docMap[fileContentAsJSON.name] = fileContentAsJSON.enrichment
        return docMap
    }, {});
}

function enrichRepoModel(repoToEnrich, enrichmentJSON) {
    repoToEnrich = repoToEnrich.map(entry => {
        const entryName = entry.name;
        if (enrichmentJSON[entryName]) {
            return Object.assign({}, entry, enrichmentJSON[entryName])
        }
        return entry
    })
    return repoToEnrich
}


export default async function localDocworks(remoteRepo, branch, outputDirectory, tmpDir, projectDir, jsDocSources, plugins, enrichmentDocsDir, dryRun) {
    logTaskConfig(outputDirectory, tmpDir, projectDir, jsDocSources, plugins);

    try {
        await cloneGitRepoToDirectory(remoteRepo, tmpDir);

        const workingSubdir = join(tmpDir, projectDir);
        await gitCheckoutExistingOrNewBranch(tmpDir, branch, createUniqueId('localdocs-'));

        logger.command('docworks', `extractDocs ${jsDocSources.include} ${jsDocSources.includePattern}`);
        const {services, errors} = runJsDoc(jsDocSources, plugins);
        logger.jsDocErrors(errors);

        logger.command('docworks', `readServices ${workingSubdir}`);
        const repoContent = await readFromDir(workingSubdir);

        logger.command('docworks', `merge`);
        const merged = merge(services, repoContent.services, plugins);

        logger.command('docworks', 'enrichment');
        const enriched = enrichModel(merged.repo, enrichmentDocsDir);

        logger.command('docworks', `saveServices ${workingSubdir}`);
        await saveToDir(workingSubdir, enriched);

        logger.log('  running ecpAfterMerge plugins');
        await runPlugins(plugins, 'ecpAfterMerge', tmpDir, projectDir);

        if (dryRun) {
            logger.newLine();
            logger.success(VEE_CHAR, '[Dry run] local docworks completed successfully. No output.');
        } else {
            copyDiffedFilesToOutputDirectory(tmpDir, outputDirectory);

            logger.newLine();
            logger.success(VEE_CHAR, 'local docworks completed successfully, see output: ' + outputDirectory);
        }
    }
    catch (error) {
        logger.error('Failed to complete workflow\n', error.stack);
        throw error;
    }

}

