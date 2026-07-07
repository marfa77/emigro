import assert from "node:assert/strict";
import {
  sanitizeSnsUtenteText,
  validateSnsUtenteCopy,
} from "../lib/community-notes/sns-editorial";

const bad = "Номер SNS (utente) даёт доступ к государственной системе здравоохранения.";
const fixed = sanitizeSnsUtenteText(bad);
assert.ok(fixed.changed);
assert.equal(validateSnsUtenteCopy([fixed.text]).length, 0);

assert.ok(validateSnsUtenteCopy(["SNS (numero de utente) — шаг 2"]).length > 0);
assert.ok(
  validateSnsUtenteCopy([
    "Запишитесь в centro de saúde → número de utente; при ВНЖ и NIF — покрытие по правилам SNS.",
  ]).length === 0
);

console.log("sns-editorial checks ok");
