import chalk from 'chalk';

export default {
    log: (_) => console.log(`    ${chalk.white(_)}`),
    error: (_) => console.log(`    ${chalk.red(_)}`),
    success: (_) => console.log(`    ${chalk.green(_)}`)
}