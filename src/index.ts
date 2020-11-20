import chalk from "chalk";
import * as fs from "fs";
import glob from "glob";
import { TASK_CHECK } from "hardhat/builtin-tasks/task-names";
import { task } from "hardhat/config";
import * as path from "path";
import prettier from "prettier";

function getSolidityFiles(sourcesPath: string): string[] {
  const solidityFilesGlob = path.join(sourcesPath, "**/*.sol");
  const solidityFiles = glob.sync(solidityFilesGlob);

  return solidityFiles;
}

async function getOptions(configFile: string): Promise<prettier.Options> {
  const prettierOptions = await prettier.resolveConfig(configFile);

  const options = prettierOptions ?? {
    plugins: ["prettier-plugin-solidity"],
  };

  return options;
}

task("format", async (_, hre) => {
  const solidityFiles = getSolidityFiles(hre.config.paths.sources);

  console.log(
    `Formatting ${solidityFiles.length} file${
      solidityFiles.length > 1 ? "s" : ""
    }`
  );

  const options = await getOptions(hre.config.paths.configFile);

  for (const solidityFile of solidityFiles) {
    const content = fs.readFileSync(solidityFile).toString();

    const formatted = prettier.format(content, {
      ...options,
      filepath: solidityFile,
    });

    const relativePath = path.relative(hre.config.paths.root, solidityFile);
    if (content !== formatted) {
      console.log(relativePath);
      fs.writeFileSync(solidityFile, formatted);
    } else {
      console.log(chalk.gray(relativePath));
    }
  }
});

task(TASK_CHECK, async (_, hre, runSuper) => {
  const solidityFiles = getSolidityFiles(hre.config.paths.sources);

  const nonFormattedFiles: string[] = [];

  const options = await getOptions(hre.config.paths.configFile);

  for (const solidityFile of solidityFiles) {
    const content = fs.readFileSync(solidityFile).toString();

    const isFormatted = prettier.check(content, {
      ...options,
      filepath: solidityFile,
    });

    if (!isFormatted) {
      nonFormattedFiles.push(solidityFile);
    }
  }

  if (nonFormattedFiles.length > 0) {
    for (const nonFormattedFile of nonFormattedFiles) {
      const relativePath = path.relative(
        hre.config.paths.root,
        nonFormattedFile
      );

      console.log(
        chalk.red(
          `File ${relativePath} is not formatted. Run the format task to fix it.`
        )
      );
    }

    process.exit(1);
  }

  console.log(`All files are correctly formatted`);

  return runSuper();
});
