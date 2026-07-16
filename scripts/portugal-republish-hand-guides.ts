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
  "portugal:publish-first-month-checklist",
];

async function main() {
  const failed: string[] = [];
  for (const script of SCRIPTS) {
    console.log(`\n=== ${script} ===`);
    try {
      execSync(`npm run ${script}`, { stdio: "inherit", cwd: process.cwd() });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[republish] ${script} failed: ${msg.slice(0, 200)}`);
      failed.push(script);
    }
  }
  if (failed.length) {
    console.error(`\n[republish] finished with ${failed.length} failures: ${failed.join(", ")}`);
    process.exit(1);
  }
  console.log("\n[republish] all hand guides done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
