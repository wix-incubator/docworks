'use strict';
import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir, merge} from 'docworks-repo';
import {join} from 'path';
import fs from 'fs-extra';
import * as logger from './logger';
import Git from "./git";
import {runPlugins} from './plugins';

const VEE_CHAR = '\u2713';

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

function getChangedAndNewSrcFiles(srcDir, targetDir) {
    const differentFiles = [];
    const allFilesInSrc = getAllFilesInDir(srcDir);
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
    return differentFiles;
}

function areFilesDifferent(src, dest) {
    return fs.readFileSync(src, 'utf8') !== fs.readFileSync(dest, 'utf8');
}

async function copyDiffedFilesToOutputDirectory(srcDir, targetDir) {
    const differentFiles = getChangedAndNewSrcFiles(srcDir, targetDir);
    if (!differentFiles || differentFiles.length === 0) {
        return;
    }

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
            logger.error(`cant checkout branch ${branchName}. Terminating.`, e);
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

        logger.command('docworks', `merge`);
        let merged = merge(services, repoContent.services, plugins);

        logger.command('docworks', `saveServices ${workingSubdir}`);
        await saveToDir(workingSubdir, merged.repo);

        logger.log('  running ecpAfterMerge plugins');
        await runPlugins(plugins, 'ecpAfterMerge', tmpDir, projectDir);

        copyDiffedFilesToOutputDirectory(tmpDir, outputDirectory);

        logger.newLine();
        logger.success(VEE_CHAR, 'local docworks completed successfully, see output: ' + outputDirectory);
    }
    catch (error) {
        logger.error('failed to complete workflow\n' + error.stack);
        throw error;
    }

}

