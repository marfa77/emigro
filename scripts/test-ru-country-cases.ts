import assert from "node:assert/strict";
import { ruCountryDative, ruCountryGenitive, ruCountryIn, ruCountryTo } from "../lib/ru-country-cases";

const IN_CASES: Record<string, string> = {
  Норвегия: "в Норвегии",
  Швеция: "в Швеции",
  Дания: "в Дании",
  Австрия: "в Австрии",
  Венгрия: "в Венгрии",
  Португалия: "в Португалии",
  Испания: "в Испании",
  Франция: "во Франции",
  Италия: "в Италии",
  Германия: "в Германии",
  Нидерланды: "в Нидерландах",
  Польша: "в Польше",
  Чехия: "в Чехии",
  Греция: "в Греции",
  Кипр: "на Кипре",
  Мальта: "на Мальте",
  Болгария: "в Болгарии",
  Хорватия: "в Хорватии",
  Словения: "в Словении",
  Эстония: "в Эстонии",
  Финляндия: "в Финляндии",
  Сербия: "в Сербии",
  Армения: "в Армении",
  Грузия: "в Грузии",
  Турция: "в Турции",
  Черногория: "в Черногории",
  Казахстан: "в Казахстане",
  ОАЭ: "в ОАЭ",
  ЮАР: "в ЮАР",
  Таиланд: "в Таиланде",
  Индонезия: "в Индонезии",
  "Индонезия / Бали": "в Индонезии и на Бали",
  Великобритания: "в Великобритании",
  Швейцария: "в Швейцарии",
  Скандинавия: "в Скандинавии",
  Вьетнам: "во Вьетнаме",
  Уругвай: "в Уругвае",
  Чили: "в Чили",
};

for (const [name, expected] of Object.entries(IN_CASES)) {
  assert.equal(ruCountryIn(name), expected, name);
}

assert.equal(ruCountryTo("Норвегия"), "в Норвегию");
assert.equal(ruCountryTo("Франция"), "во Францию");
assert.equal(ruCountryTo("Кипр"), "на Кипр");
assert.equal(ruCountryTo("Нидерланды"), "в Нидерланды");
assert.equal(ruCountryTo("ОАЭ"), "в ОАЭ");
assert.equal(ruCountryDative("Кипр"), "Кипру");
assert.equal(ruCountryDative("Норвегия"), "Норвегии");
assert.equal(ruCountryDative("Нидерланды"), "Нидерландам");
assert.equal(ruCountryGenitive("Мальта"), "Мальты");
assert.equal(ruCountryGenitive("Польша"), "Польши");
assert.equal(ruCountryGenitive("Таиланд"), "Таиланда");

console.log("ru-country-cases: ok");
