const fs = require('fs');
const path = require('path');

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

class MissingTestReporter {
  constructor(globalConfig, reporterOptions, jestContext) {
    this._globalConfig = globalConfig;
    this._options = reporterOptions;
  }

  onRunStart(results, options) {
    const rootDir = path.resolve(__dirname, '..');
    const functionsDir = this._options.functionsDir || 'functions';
    const testsDir = this._options.testsDir || 'tests';
    const testSuffix = this._options.testSuffix || '.spec.js';

    const functionsDirPath = path.join(rootDir, functionsDir);
    const testsDirPath = path.join(rootDir, testsDir);

    if (!fs.existsSync(functionsDirPath)) {
      console.log(
        `\n${YELLOW}Diretório não encontrado: ${functionsDirPath}${RESET}\n`,
      );
      return;
    }

    const functionFiles = fs
      .readdirSync(functionsDirPath)
      .filter((file) => file.endsWith('.js'));

    if (functionFiles.length === 0) {
      console.log(
        `\n${DIM}Nenhum arquivo de função encontrado em ${functionsDir}/${RESET}\n`,
      );
      return;
    }

    const missingTests = [];

    for (const file of functionFiles) {
      const name = path.basename(file, '.js');
      const expectedTestFile = `${name}${testSuffix}`;
      const testFilePath = path.join(testsDirPath, expectedTestFile);

      if (!fs.existsSync(testFilePath)) {
        missingTests.push({ functionFile: file, expectedTestFile });
      }
    }

    if (missingTests.length > 0) {
      const maxLen = Math.max(
        ...missingTests.map(
          (m) =>
            `${functionsDir}/${m.functionFile}  →  ${testsDir}/${m.expectedTestFile}`
              .length,
        ),
        'Missing Test Files'.length,
      );
      const boxWidth = maxLen + 4;
      const horizontalLine = '─'.repeat(boxWidth);

      console.log('');
      console.log(`${RED}${BOLD}  ┌${horizontalLine}┐${RESET}`);
      console.log(
        `${RED}${BOLD}  │${'Existem arquivos de função sem testes correspondentes'.padEnd(boxWidth)}│${RESET}`,
      );
      console.log(`${RED}${BOLD}  ├${horizontalLine}┤${RESET}`);

      for (const { functionFile, expectedTestFile } of missingTests) {
        const line = `${functionsDir}/${functionFile}  →  ${testsDir}/${expectedTestFile}`;
        console.log(`${RED}  │  ${line.padEnd(boxWidth - 2)}│${RESET}`);
      }

      console.log(`${RED}${BOLD}  └${horizontalLine}┘${RESET}`);
      console.log('');
      console.log(
        `${RED}${BOLD} Existem ${missingTests.length} arquivos de função sem testes correspondentes.${RESET}`,
      );
      console.log('');

      throw new Error(
        `Existem arquivos de função sem testes correspondentes: ${missingTests.map((m) => m.functionFile).join(', ')}`,
      );
    }

    const boxWidth = 48;
    const message =
      'Todos os arquivos de função possuem testes correspondentes!';

    console.log('');
    console.log(
      `${GREEN} ${BOLD}  ${message.padEnd(boxWidth - 2)}${RESET}${GREEN} ${RESET}`,
    );
    console.log('');
  }
}

module.exports = MissingTestReporter;
