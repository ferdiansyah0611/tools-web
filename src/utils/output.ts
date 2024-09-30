import chalk from "chalk";

const output = {
  isHidden: false,
  log: function (...message: any[]) {
    if (this.isHidden) return;
    console.log(chalk.magentaBright(getTimeLog()), ...message);
  },
  error: function (...message: any[]) {
    if (this.isHidden) return;
    console.log(chalk.magentaBright(getTimeLog()), chalk.redBright(...message));
  },
  warn: function (...message: any[]) {
    if (this.isHidden) return;
    console.log(chalk.magentaBright(getTimeLog()), ...message);
  },
  success: function (...message: any[]) {
    if (this.isHidden) return;
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
