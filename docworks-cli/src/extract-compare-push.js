import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir, merge} from 'docworks-repo';
import {join} from 'path';
import git from 'nodegit';
import defaultLogger from './logger';

export default async function extractComparePush(remoteRepo, workingDir, projectSubdir, jsDocSources, plugins, logger) {
  logger = logger || defaultLogger;
  logger.log(`remote repo url: ${remoteRepo}`);
  logger.log(`working dir: ${workingDir}`);
  logger.log(`project dir: ${projectSubdir}`);
  logger.log(`jsdoc sources: ${JSON.stringify(jsDocSources)}`);
  let workingSubdir = join(workingDir, projectSubdir);
  try {

    logger.log(`git clone ${remoteRepo} ${workingDir}`);
    await git.Clone(remoteRepo, workingDir);

    logger.log(`docworks readServices ${workingSubdir}`);
    let repoContent = await readFromDir(workingSubdir);

    logger.log(`docworks extractDocs ${jsDocSources.include}/**/${jsDocSources.includePattern}`);
    let newDocs = runJsDoc(jsDocSources, plugins).services;

    logger.log(`docworks merge`);
    let merged = merge(newDocs, repoContent.services);

    logger.log(`docworks saveServices ${workingSubdir}`);
    await saveToDir(workingSubdir, merged.repo);

    let localRepo = await git.Repository.open(workingDir);

    logger.log(`git status`);
    let statuses = await localRepo.getStatus();
    let files = statuses.filter(_ => _.isNew() || _.isModified())
      .map(_ => {
        logger.log(`  ${_.isNew()?'New:     ':'Modified:'} ${_.path()}`);
        return _.path()
      });

    if (files.length > 0) {
      logger.log(`git add ${files.join(' ')}`);
      let index = await localRepo.refreshIndex();
      await Promise.all(files.map(file => index.addByPath(file)));
      await index.write();
      let oid = await index.writeTree();

      logger.log(`git commit -m '${merged.messages.join('\n')}'`);
      let parents = [];
      try {
        let head = await git.Reference.nameToId(localRepo, "HEAD");
        let parent = await localRepo.getCommit(head);
        parents = [parent];
      }
      catch (err) {

      }
      let author = git.Signature.default(localRepo);
      let committer = git.Signature.default(localRepo);
      await localRepo.createCommit("HEAD", author, committer, merged.messages.join('\n'), oid, parents);

      logger.log('git push origin master');
      let remote = await git.Remote.lookup(localRepo, 'origin');
      await remote.push(['refs/heads/master:refs/heads/master']);
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