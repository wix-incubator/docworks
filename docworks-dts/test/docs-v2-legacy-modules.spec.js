const { readFromDir } = require("docworks-repo");
const docworksToDts = require("../lib/dts-repo");
const fsExtra = require("fs-extra");

describe("docs v2 legacy modules", async () => {
  test("docs v2 repo", async () => {
    let repo = await readFromDir("./test/docs-v2-test/wix-crm-backend");

    let dts = docworksToDts(repo.services);

    writeOutput("./test/output/index.d.ts", dts);

    expect(true).toBe(true);
  });
});

function writeOutput(outputFileName, fileContent) {
  return fsExtra.outputFile(outputFileName, fileContent);
}
