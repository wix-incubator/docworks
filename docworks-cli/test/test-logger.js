import chalk from 'chalk';

let _log = [];

export function get() {
  return _log;
}

export function reset() {
  _log = [];
}

export const rawLog = (_) => _log.push(_);
export const details = (_) => _log.push(`    ${chalk.gray(_)}`);
export const config = (cmd, args) => _log.push(`${chalk.whiteBright(cmd)} ${chalk.white(args)}` );
export const command = (cmd, args) => _log.push(`${chalk.green('>')} ${chalk.whiteBright(cmd)} ${chalk.white(args)}` );
export const newLine = () => _log.push();
export const log = (_) => _log.push(`${chalk.white(_)}`);
export const warn = (_) => _log.push(`${chalk.yellow(_)}`);
export const error = (_) => _log.push(`${chalk.red(_)}`);
export const success = (_) => _log.push(`${chalk.green(_)}`);
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

