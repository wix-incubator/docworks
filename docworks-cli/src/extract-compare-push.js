import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir, merge} from 'docworks-repo';
import git from 'nodegit';
import defaultLogger from './logger';

export default async function extractDocs(remoteRepo, localFolder, jsDocSources, logger) {
  logger = logger || defaultLogger;
  try {

    logger.log(`git clone ${remoteRepo} ${localFolder}`);
    await git.Clone(remoteRepo, localFolder);

    logger.log(`docworks readServices ${localFolder}`);
    let repoContent = await readFromDir(localFolder);

    logger.log(`docworks extractDocs ${jsDocSources.include}/**/${jsDocSources.includePattern}`);
    let newDocs = runJsDoc(jsDocSources).services;

    logger.log(`docworks merge`);
    let merged = merge(newDocs, repoContent.services);

    logger.log(`docworks saveServices ${localFolder}`);
    await saveToDir(localFolder, merged.repo);

    let localRepo = await git.Repository.open(localFolder);

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
      let head = await git.Reference.nameToId(localRepo, "HEAD");
      let parent = await localRepo.getCommit(head);
      let author = git.Signature.default(localRepo);
      let committer = git.Signature.default(localRepo);
      await localRepo.createCommit("HEAD", author, committer, merged.messages.join('\n'), oid, [parent]);

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