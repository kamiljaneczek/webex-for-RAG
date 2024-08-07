#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { select, Separator } from "@inquirer/prompts";
import { ingest } from "../dist/commands/ingest.js";

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
