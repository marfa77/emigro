/**
 * Republish all hand-curated Portugal guides after voice updates.
 *
 *   npm run portugal:republish-hand-guides
 */
import { execSync } from "node:child_process";

const SCRIPTS = [
  "portugal:publish-vnj-renewal-guide",
  "portugal:publish-regions-guide",
  "portugal:publish-apartment-buying-guide",
  "portugal:publish-domestic-tourism-guide",
  "portugal:publish-porto-braga-rent-guide",
  "portugal:publish-norte-climate-guide",
  "portugal:publish-passport-guide",
  "portugal:publish-tolls-guide",
  "portugal:publish-meditsina-norte-guide",
  "portugal:publish-porto-braga-guide",
  "portugal:publish-land-build-guide",
  "portugal:publish-license-guide",
  "portugal:publish-car-guide",
  "portugal:publish-schools-guide",
];

async function main() {
  for (const script of SCRIPTS) {
    console.log(`\n=== ${script} ===`);
    execSync(`npm run ${script}`, { stdio: "inherit", cwd: process.cwd() });
  }
  console.log("\n[republish] all hand guides done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
