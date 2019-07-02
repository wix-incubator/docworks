const chalk = require('chalk')

/* eslint-disable no-console */
const nvl = (_) => _?_:''
exports.rawLog = (...args) => console.log(...args)
exports.details = (...args) => console.log(`    ${chalk.gray(...args)}`)
exports.config = (cmd, args) => console.log(`${chalk.whiteBright(cmd)} ${chalk.white(nvl(args))}` )
exports.command = (cmd, args) => console.log(`${chalk.green('>')} ${chalk.whiteBright(cmd)} ${chalk.white(nvl(args))}` )
exports.newLine = () => console.log()
exports.log = (...args) => console.log(`${chalk.white(...args)}`)
const warn = (...args) => console.log(`${chalk.yellow(...args)}`)
exports.warn = warn
exports.error = (...args) => console.log(`${chalk.red(...args)}`)
exports.success = (...args) => console.log(`${chalk.green(...args)}`)
exports.jsDocErrors = (errors) => {
  if (errors.length > 0) {
    errors.forEach(_ => {
      if (_.location)
        warn(`  ${_.message} (${_.location})`)
      else
        warn(`  ${_.message}`)
    })
    warn(`  ${errors.length} jsDoc issues detected`)
    return false
  }
  return true
}

/* eslint-enable */
