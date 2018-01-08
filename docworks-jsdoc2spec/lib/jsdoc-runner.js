var path = require("path");
const {cli, env} = require('./jsdoc-loader').default;
import ServiceModel from './services-model';
import interceptStdout from "intercept-stdout";

export default function run(source, plugins) {

  // env.dirname = path.resolve(__dirname, '../', 'node_modules/jsdoc');
  console.log(env.dirname);
  env.pwd = process.cwd();
  env.args = process.argv.slice(2);

  cli.setVersionInfo();
  env.conf = {
    "tags": {
      "allowUnknownTags": true,
      dictionaries: ['jsdoc', 'closure']
    },
    "opts": {
      "lenient": false
    },
    "source": source,
    encoding: 'utf8',
    recurseDepth: 99
  };

  if (plugins)
    env.conf.plugins = plugins;


  // set to follow sub-directories
  env.opts.recurse = true;

  // set the template to process the jsdoc results
  // this folder has to have a file named publish.js
  env.conf.opts.template = __dirname;
  env.opts.template = env.conf.opts.template;

  // set the service model to get output from the jsdoc template
  env.opts.serviceModel = new ServiceModel();
  // required to clear the scanned files for re-running jsdoc
  env.sourceFiles = [];
  env.opts._ = [];

  let messages = [];
  let interceptor = (message) => {
    messages.push({message:message.trim()});
    return '';
  };
  let unhook;
  try {
    unhook = interceptStdout(interceptor, interceptor);
    // run jsdoc
    cli.scanFiles()
      .createParser()
      .parseFiles()
      .processParseResults();

    unhook();
  }
  catch (e){
    unhook();
    throw e;
  }

  env.opts.serviceModel.errors.push(...messages);
  return env.opts.serviceModel;
}

