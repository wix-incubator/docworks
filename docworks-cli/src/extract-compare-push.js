import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir, merge} from 'docworks-repo';
import git from 'nodegit';

export default async function extractDocs(remoteRepo, localFolder, jsDocSources, logger) {
  try {

    logger(`git clone ${remoteRepo} ${localFolder}`);
    await git.Clone(remoteRepo, localFolder);

    logger(`docworks readServices ${localFolder}`);
    let repoContent = await readFromDir(localFolder);

    logger(`docworks extractDocs ${jsDocSources.include}/**/${jsDocSources.includePattern}`);
    let newDocs = runJsDoc(jsDocSources).services;

    logger(`docworks merge`);
    let merged = merge(newDocs, repoContent.services);

    logger(`docworks saveServices ${localFolder}`);
    await saveToDir(localFolder, merged.repo);

    let localRepo = await git.Repository.open(localFolder);

    logger(`git status`);
    let statuses = await localRepo.getStatus();
    let files = statuses.filter(_ => _.isNew() || _.isModified())
      .map(_ => {
        logger(`  ${_.isNew()?'New:     ':'Modified:'} ${_.path()}`);
        return _.path()
      });

    if (files.length > 0) {
      logger(`git add ${files.join(' ')}`);
      let index = await localRepo.refreshIndex();
      await Promise.all(files.map(file => index.addByPath(file)));
      await index.write();
      let oid = await index.writeTree();

      logger(`git commit -m '${merged.messages.join('\n')}'`);
      let head = await git.Reference.nameToId(localRepo, "HEAD");
      let parent = await localRepo.getCommit(head);
      var author = git.Signature.default(localRepo);
      var committer = git.Signature.default(localRepo);
      await localRepo.createCommit("HEAD", author, committer, merged.messages.join('\n'), oid, [parent]);

      logger('git push origin master');
      let remote = await git.Remote.lookup(localRepo, 'origin');
      await remote.push(['refs/heads/master:refs/heads/master']);
    }
    else {
      logger('no changes detected');
    }
    logger('completed workflow');
  }
  catch (error) {
    logger('failed to complete workflow\n', error.stack);
  }
}