import chalk from 'chalk';

const nvl = (_) => _?_:'';
export const rawLog = (...args) => console.log(...args);
export const details = (...args) => console.log(`    ${chalk.gray(...args)}`);
export const config = (cmd, args) => console.log(`${chalk.whiteBright(cmd)} ${chalk.white(nvl(args))}` );
export const command = (cmd, args) => console.log(`${chalk.green('>')} ${chalk.whiteBright(cmd)} ${chalk.white(nvl(args))}` );
export const newLine = () => console.log();
export const log = (...args) => console.log(`${chalk.white(...args)}`);
export const warn = (...args) => console.log(`${chalk.yellow(...args)}`);
export const error = (...args) => console.log(`${chalk.red(...args)}`);
export const success = (...args) => console.log(`${chalk.green(...args)}`);
export const jsDocErrors = (errors) => {
  if (errors.length > 0) {
    errors.forEach(_ => {
      if (_.location)
        warn(`  ${_.message} (${_.location})`);
      else
        warn(`  ${_.message}`);
    });
    warn(`  ${errors.length} jsDoc issues detected`);
    return false;
  }
  return true;
};

