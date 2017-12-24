import chalk from 'chalk';

export const rawLog = (_) => console.log(_);
export const details = (_) => console.log(`    ${chalk.gray(_)}`);
export const config = (cmd, args) => console.log(`${chalk.whiteBright(cmd)} ${chalk.white(args)}` );
export const command = (cmd, args) => console.log(`${chalk.green('>')} ${chalk.whiteBright(cmd)} ${chalk.white(args)}` );
export const newLine = () => console.log();
export const log = (_) => console.log(`${chalk.white(_)}`);
export const warn = (_) => console.log(`${chalk.yellow(_)}`);
export const error = (_) => console.log(`${chalk.red(_)}`);
export const success = (_) => console.log(`${chalk.green(_)}`);
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

