'use strict';

import chai from 'chai';
import chaiSubset from 'chai-subset';
import fs from "fs-extra";
import localDocworks from '../src/local-docworks';
import Git from "../src/git";

chai.use(chaiSubset);
const {expect} = chai;


const REPO_PATH_V1 = './test/ver1';
const REPO_PATH_V2 = './test/ver2';

const JSDOC_SRC_GLOB = {"include": REPO_PATH_V2, "includePattern": ".+\\.(js)?$"};

async function initializeMockFilesWithDocumentation() {
    const localRepo = './tmp/localRepo';
    await fs.ensureDir(localRepo);
    await fs.copy(REPO_PATH_V1, localRepo);
    let localGitRepo = new Git(localRepo);
    await localGitRepo.init();
    localGitRepo.add('.');
    localGitRepo.commit('init v1');
    return localRepo
}

async function runLocalDocworks(dirToProcess, outputDir) {
    const TMP_LDW_PROCESS_DIR = './tmp/localDocworksTmp';
    await fs.ensureDir(TMP_LDW_PROCESS_DIR);
    await fs.emptyDir(TMP_LDW_PROCESS_DIR);

    await localDocworks(dirToProcess, '', outputDir, TMP_LDW_PROCESS_DIR, '', JSDOC_SRC_GLOB, []);
}

async function makeSureLocaloutputDirContainsDocComments(outputDir, partialJsonToFind) {
    const jsonFileContent = await fs.readFileSync(outputDir + '/Service.service.json', {encoding: 'utf8'});
    expect(JSON.parse(jsonFileContent)).to.containSubset(partialJsonToFind);
}

describe('ldw - local docworks command', () => {
    it('should copy docworks output to a (specified) local directory', async () => {
        const dirToProcess = await initializeMockFilesWithDocumentation();

        const outputDirectory = './tmp/localRepoOutput';
        await runLocalDocworks(dirToProcess, outputDirectory);

        const newCommentToFind = {
            "operations": [{
                "params":
                    [{
                        "name": "param",
                        "doc": "a parameter"
                    },
                        {
                            "name": "param2",
                            "doc": "a new parameter"
                        }]
            }]
        };
        makeSureLocaloutputDirContainsDocComments(outputDirectory, newCommentToFind);
    });
});
