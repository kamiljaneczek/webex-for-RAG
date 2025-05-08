#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import inquirer from "inquirer";
import { ingest } from "../src/commands/ingest.js";

program.version("1.0.0").description("My Node CLI");

program.action(() => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What's your name?",
      },
    ])
    .then((answers) => {
      console.log(chalk.green(`Hey there, ${answers.name}!`));
      ingest();
    });
});

program.parse(process.argv);
