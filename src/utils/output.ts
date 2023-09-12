import chalk from "chalk";

const output = {
  log: function (...message: any[]) {
    console.log(chalk.magentaBright(getTimeLog()), ...message);
  },
  error: function (...message: any[]) {
    console.log(chalk.magentaBright(getTimeLog()), chalk.redBright(...message));
  },
  warn: function (...message: any[]) {
    console.log(chalk.magentaBright(getTimeLog()), ...message);
  },
  success: function (...message: any[]) {
    console.log(chalk.magentaBright(getTimeLog()), ...message);
  },
};

/**
 * time log, example: [10:10]
 */
function getTimeLog() {
  let date = new Date();
  return `[${date.getMinutes()}:${date.getSeconds()}]\t`;
}

export default output;
