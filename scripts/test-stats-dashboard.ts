import assert from "node:assert/strict";
import { classifyDashboardSurface } from "@/lib/analytics/dashboard/surface";
import { classifyGscSurface } from "@/lib/analytics/dashboard/search-console";
import { classifyThreadsAccount } from "@/lib/analytics/dashboard/portfolio";
import { percentDelta } from "@/components/admin/stats/DashboardVisuals";

assert.equal(classifyDashboardSurface("portugal.emigro.online", "/"), "portugal");
assert.equal(classifyDashboardSurface("spain.emigro.online", "/notes/x"), "spain");
assert.equal(classifyDashboardSurface("www.emigro.online", "/satellite/italy/notes/x"), "italy");
assert.equal(classifyDashboardSurface("www.emigro.online", "/ru/invest"), "core");

assert.equal(classifyGscSurface("https://thailand.emigro.online/notes/dtv"), "thailand");
assert.equal(classifyGscSurface("https://www.emigro.online/ru/wizard"), "core");
assert.equal(classifyGscSurface("/satellite/portugal/notes/aima"), "portugal");

assert.equal(classifyThreadsAccount("emigro_threads_investment"), "emigro_invest");
assert.equal(classifyThreadsAccount("emigro_threads"), "emigro_assist");
assert.equal(classifyThreadsAccount(null), "emigro_assist");

assert.equal(percentDelta(120, 100), 20);
assert.equal(percentDelta(80, 100), -20);
assert.equal(percentDelta(0, 0), 0);
assert.equal(percentDelta(1, 0), null);

console.log("stats dashboard tests: ok");
