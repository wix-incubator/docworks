'use strict';
import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir, merge} from 'docworks-repo';
import {join} from 'path';
import fs from 'fs-extra';
import * as logger from './logger';
import Git from "./git";
// import {runPlugins} from './plugins';

function logStatus(statuses, logger) {
    statuses.created.forEach(file => logger.details(`  New:      ${file}`));
    statuses.not_added.forEach(file => logger.details(`  New:      ${file}`));
    statuses.modified.forEach(file => logger.details(`  Modified:      ${file}`));
}


function logTaskConfig(outputDirectory, workingDir, projectSubdir, jsDocSources, plugins) {
    logger.newLine();
    logger.config(`output dir:        `, outputDirectory); // the dist!
    logger.config(`working dir:       `, workingDir); // the temp dir
    logger.config(`project dir:       `, projectSubdir); // the project where the sources are (i.e. wix-data-core)
    logger.config(`jsdoc sources:     `, JSON.stringify(jsDocSources)); // jsDoc
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
        for (let i=0; i < subDirectories.length; i++) {
            result = result.concat(getAllFilesInDir(subDirectories[i]));
        }
        return result;
    }
    return result;
}

function getDiffFiles(srcDir, targetDir) {
    const differentFiles = [];
    const allFilesInSrc = getAllFilesInDir(srcDir);
    console.log('>>> all files = ', allFilesInSrc.length)
    console.log('>>> targetDir:', targetDir)
    for (let i=0; i < allFilesInSrc.length; i++) {
        let srcFilePath = allFilesInSrc[i];
        let targetFilePath = srcFilePath.replace(srcDir, targetDir);
        if (fs.existsSync(targetFilePath)) {
            if (areFilesDifferent(srcFilePath, targetFilePath)) {
                differentFiles.push(srcFilePath);
            }
        } else {
            differentFiles.push(srcFilePath);
        }
    }
    console.log('---------------- number of missing/changed files:', differentFiles.length)
    return differentFiles;
}

function areFilesDifferent(src, dest) {
    return fs.readFileSync(src, 'utf8') !== fs.readFileSync(dest, 'utf8');
}

async function copyDiffFilesToOutputDirectory(srcDir, targetDir) {
    const differentFiles = getDiffFiles(srcDir, targetDir);
    if (!differentFiles || differentFiles.length === 0) {
        return;
    }

    console.log('------------------ differentFiles.length', differentFiles.length)
    console.log(differentFiles.slice(0, 10))
    await fs.ensureDir(targetDir);

    differentFiles.forEach(srcFileToCopy => {
        fs.copySync(srcFileToCopy, srcFileToCopy.replace(srcDir, targetDir), {overwrite: true});
    });
}

async function cloneGitRepoToDirectory(remoteRepo, targetDir) {
    await fs.ensureDir(targetDir);

    let baseGit = new Git();
    logger.command('git', `clone ${remoteRepo} ${targetDir}`);
    await baseGit.clone(remoteRepo, targetDir);

}

async function gitCheckoutNewBranch(repoDirectory, branchName) {
    let localGit = new Git(repoDirectory);
    if (branchName) {
        try {
            logger.command('git', `checkout -b ${branchName}`);
            await localGit.checkout(`-b${branchName}`);
        }
        catch (e) {
            console.log(`cant checkout branch ${branchName}. Terminating.`, e);
            process.exit(1);
        }
    }
}

function createUniqueId(prefix) {
    const suffix = Date.now().toString(36);
    return (prefix + suffix).trim();
}


export default async function localDocworks(remoteRepo, outputDirectory, tmpDir, projectDir, jsDocSources, plugins) {
    logTaskConfig(outputDirectory, tmpDir, projectDir, jsDocSources, plugins);

    try {
        await cloneGitRepoToDirectory(remoteRepo, tmpDir);

        const workingSubdir = join(tmpDir, projectDir);
        await gitCheckoutNewBranch(workingSubdir, createUniqueId('localdocs-'));

        logger.command('docworks', `readServices ${workingSubdir}`);
        const repoContent = await readFromDir(workingSubdir);

        logger.command('docworks', `extractDocs ${jsDocSources.include} ${jsDocSources.includePattern}`);
        const {services, errors} = runJsDoc(jsDocSources, plugins);
        logger.jsDocErrors(errors);

        // TODO 02/06/2019 NMO - what is this for??? do i need it???
        logger.command('docworks', `merge`);
        let merged = merge(services, repoContent.services, plugins);

        logger.command('docworks', `saveServices ${workingSubdir}`);
        await saveToDir(workingSubdir, merged.repo);

        logger.log('  running ecpAfterMerge plugins');
        // await runPlugins(plugins, 'ecpAfterMerge', tmpDir, projectDir); // TODO 04/06/2019 NMO - need to re-enable

        copyDiffFilesToOutputDirectory(tmpDir, outputDirectory);

        logger.success('local docworks completed successfully, see output: ' + outputDirectory);
    }
    catch (error) {
        logger.error('failed to complete workflow\n' + error.stack);
        throw error;
    }

}

