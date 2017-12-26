import {readFromDir} from 'docworks-repo';
import fs from 'fs-extra';
import {join} from 'path';

function renderDocsSummary(md, docs) {
  if (docs && docs.summary) {
    md += `${docs.summary}\n\n`;
  }
  return md;
}

function renderDocsDescription(md, docs) {
  if (docs && docs.description) {
    md += `### Description
    
${docs.description}\n\n`;
  }
  return md;
}

function renderPropSyntax(md, prop) {
  md += `\`\`\`javascript\n`;
  if (prop.get)
    md += `get ${prop.name}: ${prop.type}\n`;
  if (prop.set)
    md += `set ${prop.name}: ${prop.type}\n`;
  md += `\`\`\`\n\n`;
  return md;
}

function renderOperationSyntax(md, op) {

  function renderTypes() {
    if (op.params.length === 0)
      return '';
    return op.params.map(_ => `${_.name}: ${_.type}`).join(', ');
  }

  md += `### Syntax
   
\`\`\`javascript
function ${op.name}(${renderTypes()}): ${op.ret.type}`;
  md += `\`\`\`\n\n`;
  return md;
}

function renderPropType(md, prop) {
  md += `### Type
   
${prop.type}\n\n`;
  return md;
}

function renderParamTable(md, op) {
  md += `### Parameters\n\n`;

  if (op.params.length > 0) {
    md += 'name | type | doc\n';
    md += '--------- | ------- | -----------\n';
    op.params.forEach(param => {
      md += `${param.name} | ${param.type} | ${param.doc}\n`;
    });
  }

  return md;
}

function renderReturns(md, op) {
  md += `### returns\n\n`;
  md += `${op.ret.type}\n`;
  return md;
}

async function run() {
  let repo = await readFromDir('../../docs-work');
  let services = repo.services;

  await Promise.all(services.map(service => {
    let md;
    let filename;
    if (service.memberOf) {
      md = `# ${service.memberOf}.${service.name}\n\n`;
      filename = `${service.memberOf}.${service.name}.md`;
    }
    else {
      md = `# ${service.name}\n\n`;
      filename = `${service.name}.md`;
    }

    md = renderDocsSummary(md, service.docs);
    md = renderDocsDescription(md, service.docs);

    service.properties.forEach(prop => {
      md += `## ${prop.name}\n\n`;

      md = renderDocsSummary(md, prop.docs);
      md = renderPropSyntax(md, prop);
      md = renderDocsDescription(md, prop.docs);
      md = renderPropType(md, prop);

    });

    service.operations.forEach(op => {
      md += `## ${op.name}\n\n`;
      md = renderDocsSummary(md, op.docs);
      md = renderOperationSyntax(md, op);
      md = renderDocsDescription(md, op.docs);
      md = renderParamTable(md, op);
      md = renderReturns(md, op);
    });

    console.log('saving', filename);
    return fs.outputFile(join('../../slate/node-slate/source/includes', filename), md);
  }));
}



run()
  .then(() => console.log('finished'));
