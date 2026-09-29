-- Work-in-Europe guide fact-check (2026-09-29): one figure → one official source → one verified date.

-- Poland EU Blue Card: MOS 2026 = 1.5 × PLN 8 903,56 (GUS avg 2025) × 12
update emigro_program_requirements
set value_text = '150% средней зарплаты 2025 (GUS PLN 8 903,56) — выше PLN 13 355,34/мес брутто, не менее PLN 160 264,08/год (заявки 2026)'
where id = '2451895e-886e-4efb-ab82-58375bdfcdce';

update emigro_program_sources
set source_url = 'https://www.mos.cudzoziemcy.gov.pl/kategorie-informacji/mozliwosci-legalizacji/spoza-ue-kontynuacja-pobytu/zezwolenie-czasowy/praca/niebieska-karta/',
    label_en = 'MOS (Urząd do Spraw Cudzoziemców) — Niebieska Karta UE',
    label_ru = 'MOS (UdSC) — Niebieska Karta UE',
    raw_excerpt = 'W przypadku wniosków składanych w 2026r. skumulowane wynagrodzenie brutto nie może wynosić mniej niż 160.264,08 zł, co oznacza otrzymywanie comiesięcznej kwoty brutto powyżej 13.355,34 zł. Wzór wyliczenia: 1,5 x 8903,56 zł x 12 m-cy.',
    last_verified = '2026-09-29'
where id = '3aa06ea0-db71-4e73-a383-1e5623619982';

update emigro_program_sources
set last_verified = '2026-09-29'
where id = '282576a3-d249-44b2-8a3e-599095d00721';

-- Netherlands HSM: IND required amounts 2026 (gross/month, excl. 8% holiday allowance)
update emigro_program_requirements
set value_text = 'HSM: €5 942/мес. брутто (30+); €4 357/мес. (до 30); сниженный €3 122/мес. (выпускники в течение 3 лет / orientation year). EU Blue Card NL — отдельный маршрут: €5 942; сниженный €4 754 (выпускники)'
where id = 'ddd86a4f-fce5-443e-8949-6919277f3fc5';

update emigro_program_sources
set source_url = 'https://ind.nl/en/required-amounts-income-requirements',
    label_en = 'IND — required amounts (income requirements)',
    label_ru = 'IND — требуемые суммы дохода',
    raw_excerpt = '2026 gross monthly: highly skilled migrant 30+ €5,942; under 30 €4,357; reduced criterion €3,122; EU Blue Card €5,942; reduced EU Blue Card €4,754.',
    last_verified = '2026-09-29'
where id = '5ee9fc0d-efe2-4041-8524-8d0a26e6d9ec';

-- Germany EU Blue Card: BMI Bekanntmachung BAnz AT 18.12.2025 B3
update emigro_program_requirements
set value_text = '€50 700/год (общий порог 2026); €45 934,20/год — дефицитные профессии (IT, инженерия, медицина и др.), выпускники (<3 лет) и IT-специалисты без диплома (3+ года опыта за 7 лет); для сниженного порога нужно согласие BA'
where id = '34ab34fb-f38f-4ee3-adb0-ba5e41507fe4';

update emigro_program_sources
set source_url = 'https://www.arbeitsagentur.de/vor-ort/zav/working-and-living-in-germany/newsletter-iss/03-2026/blaue-karte',
    label_en = 'Bundesagentur für Arbeit — Blaue Karte EU 2026',
    label_ru = 'Bundesagentur für Arbeit — Blue Card 2026',
    raw_excerpt = 'Mindestbruttojahresgehalt 2026: 50.700 Euro („große“ Blaue Karte). Mangelberufe und Berufseinsteigende: 45.934,20 Euro, Zustimmung der BA erforderlich. (BMI Bekanntmachung zu § 18g AufenthG, BAnz AT 18.12.2025 B3.)',
    last_verified = '2026-09-29'
where id = '3dd79ca2-d2ef-4a9b-98f9-1441968f530c';

-- France Talent salarié qualifié: service-public F16922
update emigro_program_requirements
set value_text = '€39 582/год брутто (salarié qualifié, 2026)'
where id = '5f45d52c-b4cc-401b-b0a8-e17b071c2253';

update emigro_program_sources
set source_url = 'https://www.service-public.fr/particuliers/vosdroits/F16922',
    raw_excerpt = 'Avoir un contrat de travail qui prévoit une rémunération brute annuelle supérieure ou égale à 39 582 €. (Carte bleue européenne: 59 373,00 € brut annuel.)',
    last_verified = '2026-09-29'
where id = 'd1eda5bb-4aae-42eb-a950-4aadc733aa3c';

-- Sweden work permit: transitional extensions use the PREVIOUS maintenance requirement, not 80%
update emigro_program_requirements
set value_text = 'SEK 34 470/мес. (90% медианы SCB) — для заявлений с 16.06.2026; правило 90% действует для решений с 01.06.2026. Продления разрешений по старым правилам, поданные 01.06–01.12.2026, — по прежнему требованию содержания (maintenance requirement)'
where id = '179b6326-18b7-4e5d-a6b5-bfac867f61f3';

update emigro_program_sources
set raw_excerpt = 'Salary must be at least 90% of the median salary (SEK 34,470 for applications received from 16 June 2026). Extensions of permits granted under the old rules, applied for 1 June–1 December 2026, must meet the previous maintenance requirement.',
    last_verified = '2026-09-29'
where id = '88f59d12-1411-46a5-bd73-08d63d52410e';

update emigro_program_sources
set last_verified = '2026-09-29'
where id = '8f47721c-cd5d-4466-8e1f-021507a11023';

-- Sweden EU Blue Card: 1.25 × average gross salary; SEK 53 625 since 15.07.2026
update emigro_program_requirements
set value_text = 'SEK 53 625/мес. брутто (1,25 × средняя зарплата, Medlingsinstitutet) — с 15.07.2026; контракт от 6 мес.'
where id = 'bea47194-bf63-4656-9b8a-6bd3c5d9ead9';

update emigro_program_sources
set raw_excerpt = 'The salary threshold corresponds to 1.25 times the average gross salary in Sweden published by the National Mediation Office. Since 15 July 2026, the salary threshold is SEK 53,625 per month.',
    last_verified = '2026-09-29'
where id = 'd4df84cc-40cb-4118-8ed8-febe22a914e0';
