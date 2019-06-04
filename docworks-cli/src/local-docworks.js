'use strict';
import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir, merge} from 'docworks-repo';
import {join} from 'path';
import fs from 'fs-extra';
import * as logger from './logger';
// import chalk from 'chalk';
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

function copyFilesToOutputDirectory(outputDirectory, filesToCopy) {
    if (fs.existsSync(outputDirectory)) {
        fs.rmdirSync(outputDirectory);
    }
    fs.mkdirSync(outputDirectory, {recursive: true});
    console.log('writing files... ', filesToCopy.length);
    // TODO 04/06/2019 NMO - enable when ready
    // filesToCopy.forEach(file => fs.copyFileSync(file, `${outputDirectory}/${file}`));
}

// TODO 02/06/2019 NMO - what is the difference between outputDir, workingDir, projDir & jsDocsSources????????
export default async function localDocworks(outputDirectory, tmpDir, projectDir, jsDocSources, plugins) {
    logTaskConfig(outputDirectory, tmpDir, projectDir, jsDocSources, plugins);

    const workingSubdir = join(tmpDir, projectDir);

    try {
        await fs.ensureDir(tmpDir);

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

        // TODO 02/06/2019 NMO - get the files that the runJsDoc output created.. yay!
        const files = [...services];
        console.log('files = ', JSON.stringify(files[0]))

        if (files.length > 0) {
            copyFilesToOutputDirectory(outputDirectory, files);
        }
        else {
            logger.log('no changes detected');
        }
        logger.success('completed workflow');
    }
    catch (error) {
        logger.error('failed to complete workflow\n' + error.stack);
        throw error;
    }

}

