import type { InvestCountrySlug } from "@/lib/investment/golden-visa-2026";

export type InvestFaqItem = { question: string; answer: string };

export type InvestEnCountryCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  aiDescription: string;
  suits: string[];
  notSuits: string[];
  ruByNote: string;
  steps: string[];
  faq: InvestFaqItem[];
  /** Existing RU pillar / programme page for readers who want depth. */
  ruGuidePath: string;
};

export const INVEST_EN_HUB = {
  title: "Investment Residency 2026: Golden Visas Compared | Emigro",
  description:
    "Which golden visa fits your passport and budget? Portugal, Italy, Greece, UAE, Thailand & more — official rules, checked Oct 2026. Free route match.",
  h1: "Investment residency in 2026: profile first, programme second",
  intro:
    "Eight investment-residence programmes, one dated table and official sources. Tell us your budget, passport and goal — we show which programmes are actually open to you before you talk to a fund or a broker.",
  aiDescription:
    "Emigro EN investment residency hub (checked 2026-10-14): Portugal ARI €500K funds only (real estate removed 2023, citizenship 10y since 19.05.2026); Italy Investor Visa €250K–€2M, suspended for RU/BY; Greece €250K/€400K/€800K, RU/BY suspended; Spain golden visa closed 03.04.2025; Thailand LTR US$500K + US$1M assets; UAE AED 2M property; Hungary €250K fund / €1M donation; Malta MPRP. Screening only, not legal advice.",
} as const;

export const INVEST_EN_COUNTRY: Record<InvestCountrySlug, InvestEnCountryCopy> = {
  portugal: {
    title: "Portugal Golden Visa 2026: €500K Funds, 10-Year Rule",
    description:
      "The fund route from €500,000, what was abolished, and the new 10-year citizenship rule (Lei Orgânica 1/2026). Official sources. Free route match.",
    h1: "Portugal Golden Visa (ARI) 2026: €500K fund route",
    intro:
      "Portugal's ARI is still open, but it is no longer a property visa. Since October 2023 the realistic route for most families is €500,000 in qualifying Portuguese funds — and since 19 May 2026 citizenship takes 10 years for non-EU/CPLP nationals.",
    aiDescription:
      "Portugal ARI 2026: €500K qualifying non-real-estate funds (≥5-year maturity, ≥60% in Portuguese companies); company €500K + 5 jobs; research €500K; culture €250K. Real estate and €1.5M capital transfer removed 10/2023. Citizenship 10 yrs (7 EU/CPLP) under Lei Orgânica 1/2026 from 19.05.2026.",
    suits: [
      "You want an EU residence permit without moving full-time in year one.",
      "You can hold €500,000 in a regulated fund for at least five years.",
      "Your source of funds is documented and bankable in the EU.",
    ],
    notSuits: [
      "You want to buy an apartment and get a visa — property no longer qualifies.",
      "You need an EU passport in five years — the new rule is 10 years for most non-EU/CPLP nationals.",
      "You cannot tolerate a five-year lock-up or fund risk.",
    ],
    ruByNote:
      "Russian and Belarusian passports are not excluded by the ARI law, but banks and funds apply enhanced AML and source-of-funds checks. Expect more questions and longer onboarding; some funds decline RU/BY investors.",
    steps: [
      "Check the passport, budget and family composition against the ARI routes (free match below).",
      "Get a Portuguese NIF and open a bank account; document the source of funds.",
      "Subscribe to a qualifying fund (≥5-year maturity, ≥60% in Portuguese companies) and keep the proof.",
      "File the ARI application with AIMA; attend biometrics when scheduled.",
      "Keep the investment and the minimum stay for each renewal; plan citizenship on the 10-year clock.",
    ],
    faq: [
      {
        question: "Is the Portugal golden visa open in 2026?",
        answer:
          "Yes. ARI still accepts applications, but real estate and the €1.5M capital transfer were removed in October 2023. The main route is €500,000 in qualifying Portuguese funds; company creation, research and culture routes also exist.",
      },
      {
        question: "What is the minimum investment?",
        answer:
          "€500,000 for the fund, company-creation and research routes; €250,000 for the cultural-heritage route, which is rarely practical for private investors. Fees and lawyer costs come on top.",
      },
      {
        question: "Can Russian or Belarusian citizens apply?",
        answer:
          "The ARI law does not exclude them. In practice banks and funds run enhanced AML and source-of-funds checks, and some funds decline RU/BY investors — check this before committing money.",
      },
      {
        question: "How long to Portuguese citizenship via golden visa in 2026?",
        answer:
          "Lei Orgânica 1/2026, in force since 19 May 2026, requires 10 years of legal residence for most non-EU/CPLP nationals (7 for EU and CPLP), counted from the first permit's issue date. Nationality applications filed by 18 May 2026 keep the old 5-year rule.",
      },
      {
        question: "How long does processing take?",
        answer:
          "There is no reliable official service level. AIMA backlogs have historically stretched ARI decisions well beyond a year, so plan the fund lock-up and family timeline with that buffer.",
      },
      {
        question: "Do I need to live in Portugal?",
        answer:
          "No full-time residence is needed to keep ARI, but there is a short minimum-stay requirement per permit period. Citizenship, by contrast, counts years of legal residence, so the 10-year clock matters more than the stay minimum.",
      },
    ],
    ruGuidePath: "/ru/portugal/programs/portugal-golden-visa",
  },
  italy: {
    title: "Italy Investor Visa 2026: €250K, €500K, €2M Routes",
    description:
      "Startup €250K, company €500K, bonds €2M, donation €1M. Process and RU/BY suspension explained with official sources. Free route match.",
    h1: "Italy Investor Visa 2026: thresholds and eligibility",
    intro:
      "Italy's Investor Visa is not a property programme: it rewards capital put into Italian startups, companies, government bonds or philanthropy. The visa is issued after a ministry committee approves the investment plan — and it is suspended for Russian and Belarusian citizens.",
    aiDescription:
      "Italy Investor Visa 2026 (art. 26-bis TUI): €250K innovative startup, €500K Italian company, €2M government bonds, €1M philanthropy; investment held 2 years. Suspended for RU/BY citizens incl. dual nationals. Real estate does not qualify.",
    suits: [
      "You want to build or back an Italian business, not buy property.",
      "Your passport is not Russian or Belarusian (including dual nationality).",
      "You can keep the investment for at least two years.",
    ],
    notSuits: [
      "You hold an RU or BY passport — the programme is suspended for you.",
      "You expect property to qualify — it does not.",
      "You need a passport soon — citizenship follows the general residence rule.",
    ],
    ruByNote:
      "The Investor Visa is officially suspended for Russian and Belarusian citizens, and the suspension also covers dual nationals. Do not plan a startup or bond investment on this route with an RU/BY passport.",
    steps: [
      "Confirm passport eligibility (RU/BY excluded) and choose the asset class.",
      "Prepare the investment plan and proof of funds for the online nulla osta application.",
      "Get committee approval, then apply for the visa at the Italian consulate.",
      "Make the investment within three months of arrival and apply for the permesso di soggiorno.",
      "Hold the investment for at least two years to renew.",
    ],
    faq: [
      {
        question: "Is the Italy golden visa open in 2026?",
        answer:
          "Yes for most nationalities, through the Investor Visa portal run by the Ministry of Enterprises. It is suspended for Russian and Belarusian citizens.",
      },
      {
        question: "What is the minimum investment?",
        answer:
          "€250,000 in an innovative startup; €500,000 in an Italian company or VC fund; €1,000,000 in philanthropy; €2,000,000 in Italian government bonds. Real estate does not qualify.",
      },
      {
        question: "Can Russian or Belarusian citizens apply?",
        answer:
          "No. The programme is suspended for RU/BY citizens, including people who also hold another passport.",
      },
      {
        question: "How long until citizenship?",
        answer:
          "There is no investor shortcut. Citizenship follows the general naturalisation rule for non-EU nationals, usually around 10 years of legal residence — we are re-verifying this row against the official text.",
      },
      {
        question: "How long does processing take?",
        answer:
          "The ministry committee reviews the nulla osta first; the consular visa and the residence permit follow. Budget several months end-to-end and check the official portal for current times.",
      },
      {
        question: "Do I need to live in Italy?",
        answer:
          "The visa leads to a residence permit, and renewals depend on keeping the investment. Citizenship counts real legal residence, so living elsewhere slows the passport clock.",
      },
    ],
    ruGuidePath: "/ru/italy/programs/italy-investor-visa",
  },
  spain: {
    title: "Spain Golden Visa Ended (April 2025): Alternatives",
    description:
      "Spain abolished its golden visa on 3 April 2025. Here are the residence routes that still work for investors and wealthy families.",
    h1: "Spain's golden visa is closed — what works instead",
    intro:
      "Spain stopped accepting new golden visa applications on 3 April 2025 (Ley Orgánica 1/2025). Buying property, funds or deposits no longer opens an investor residence permit. Investors and wealthy families now use non-lucrative residence, the digital nomad visa, entrepreneur residence — or another EU programme.",
    aiDescription:
      "Spain golden visa abolished 03.04.2025 (LO 1/2025, BOE-A-2025-76). Alternatives: non-lucrative residence (no work, ~400% IPREM), digital nomad visa, entrepreneur residence; Portugal ARI fund route as an EU alternative.",
    suits: [
      "You want to live in Spain and can show passive income (non-lucrative).",
      "You work remotely for foreign clients or an employer (digital nomad visa).",
      "You plan an innovative business in Spain (entrepreneur residence).",
    ],
    notSuits: [
      "You want residence by buying property — that route is closed.",
      "You do not want to live in Spain — the alternatives require real residence.",
    ],
    ruByNote:
      "Not applicable to the closed golden visa. For the alternatives, RU and BY citizens usually start at a Spanish consulate in their country of legal residence; non-lucrative residence is not converted from a tourist stay.",
    steps: [
      "Pick the alternative that matches your income: passive (non-lucrative), remote work (nomad) or business (entrepreneur).",
      "Check the income threshold and documents for that route.",
      "File at the consulate (non-lucrative) or via UGE / the consulate (nomad, entrepreneur).",
      "Register in Spain and get your TIE card after arrival.",
    ],
    faq: [
      {
        question: "Is Spain golden visa closed?",
        answer:
          "Yes. Ley Orgánica 1/2025 (BOE-A-2025-76) ended new golden visa applications from 3 April 2025. Property, funds and deposits no longer open an investor residence permit.",
      },
      {
        question: "What is the minimum investment now?",
        answer:
          "There is none — the investor route is closed. The historical threshold was €500,000 in property; it no longer applies to new applications.",
      },
      {
        question: "Can Russian or Belarusian citizens get Spanish residence another way?",
        answer:
          "They can apply for non-lucrative, digital nomad or entrepreneur residence if they meet the conditions, usually starting at a consulate where they legally reside.",
      },
      {
        question: "How long until Spanish citizenship?",
        answer:
          "Generally 10 years of legal residence for RU/BY/UA/KZ nationals (2 years applies only to Ibero-American and a few other nationalities), plus DELE A2 and CCSE exams.",
      },
      {
        question: "What is the closest EU alternative to Spain's golden visa?",
        answer:
          "Portugal's ARI fund route from €500,000 is the closest investment-only option in Iberia, though it no longer accepts property and the citizenship clock is now 10 years for most non-EU nationals.",
      },
    ],
    ruGuidePath: "/ru/guides/vnj-ispaniya-2026",
  },
  greece: {
    title: "Greece Golden Visa 2026: €250K, €400K, €800K Rules",
    description:
      "Location-based thresholds and the €250K conversion exception explained. Checked Oct 2026. Free route match.",
    h1: "Greece Golden Visa 2026: thresholds by area",
    intro:
      "Greece still sells residence through real estate, but €250,000 is now the exception, not the rule. Most buyers face €400,000 or €800,000 depending on the area — and new applications by Russian and Belarusian nationals remain suspended.",
    aiDescription:
      "Greece Golden Visa 2026 (Law 5038/2023 art. 100 as amended by 5100/2024): €800K Attica/Thessaloniki/Mykonos/Santorini/large islands; €400K elsewhere (single property ≥120 m²); €250K only for conversion to residential or listed-building restoration. New RU/BY applications suspended since 2022 (confirmed by Ministry Circular 1 of 21.04.2026).",
    suits: [
      "You want EU residence through property and can meet the area threshold.",
      "You do not need to live in Greece full time.",
      "Your passport is not RU or BY (the main investor's nationality decides).",
    ],
    notSuits: [
      "You hold only an RU or BY passport — new applications are suspended.",
      "Your budget is €250,000 and the property is not a conversion or listed restoration.",
      "You plan to work in Greece on this permit — it does not include a work right.",
    ],
    ruByNote:
      "New Golden Visa applications by Russian and Belarusian nationals, including family members, have been suspended since April 2022. The Ministry of Migration's Circular 1 of 21 April 2026 confirms the suspension continues. Renewals of permits issued earlier are processed; a change of permit purpose counts as a new application.",
    steps: [
      "Check the area threshold (€800K / €400K / €250K exception) for the exact property.",
      "Get a Greek AFM tax number and a bank account; document the source of funds.",
      "Buy the property (single unit ≥120 m² for the €400K tier) and register it.",
      "Apply for the permanent residence permit for investors and give biometrics.",
      "Keep the property to renew the permit every five years.",
    ],
    faq: [
      {
        question: "Is the Greece golden visa open in 2026?",
        answer:
          "Yes for most nationalities, with area-based thresholds of €800,000, €400,000 and a narrow €250,000 exception. New RU/BY applications are suspended.",
      },
      {
        question: "What is the minimum investment?",
        answer:
          "€250,000 only for converting commercial property to residential or restoring a listed building. Otherwise €400,000 (one property of at least 120 m²) or €800,000 in Attica, Thessaloniki, Mykonos, Santorini and islands with over 3,100 inhabitants.",
      },
      {
        question: "Can Russian or Belarusian citizens apply?",
        answer:
          "Not on an RU or BY passport: new applications remain suspended (since 2022, confirmed by Ministry of Migration Circular 1 of 21.04.2026). The suspension also covers family members on the application.",
      },
      {
        question: "How long until citizenship?",
        answer:
          "Greek citizenship generally requires 7 years of legal residence plus language and civics tests; golden visa time spent outside Greece does not build a strong case. We are re-verifying this row.",
      },
      {
        question: "Do I need to live in Greece?",
        answer:
          "No minimum stay is required to keep the golden visa itself, but the permit does not give the right to work, and citizenship needs real residence.",
      },
    ],
    ruGuidePath: "/ru/greece/programs/greece-golden-visa",
  },
  thailand: {
    title: "Thailand LTR Visa 2026: Wealthy Global Citizen ($500K)",
    description:
      "$500K Thai investment + $1M assets, 10-year visa. How LTR differs from Thailand Privilege. Official BOI source.",
    h1: "Thailand LTR & Privilege: programmes aren't interchangeable",
    intro:
      "Thailand has no citizenship-by-investment and no golden visa in the EU sense. The LTR Wealthy Global Citizen visa gives 10 years for US$500,000 invested in Thailand plus US$1M of global assets; Thailand Privilege is a paid membership; buying a condo alone gives neither.",
    aiDescription:
      "Thailand LTR Wealthy Global Citizen 2026 (BOI): US$500K invested in Thai bonds/company/property + US$1M global assets, US$50K insurance or US$100K deposit, 10-year visa (5+5). Not a citizenship route. Thailand Privilege is a non-refundable membership, not LTR.",
    suits: [
      "You can show US$1M of global assets and invest US$500K in Thailand.",
      "You want a long-stay visa, not a passport.",
      "You prefer to keep the capital in an asset rather than pay a membership fee.",
    ],
    notSuits: [
      "You expect a condo purchase alone to give a visa.",
      "You need a path to citizenship.",
      "Your assets are not yet in your own name.",
    ],
    ruByNote:
      "RU and BY citizens are not excluded from LTR in the BOI rules we checked; banks and brokers may still apply their own checks. We are re-verifying this row.",
    steps: [
      "Check the asset (US$1M) and investment (US$500K) tests and the insurance option.",
      "Make the qualifying Thai investment in your own name.",
      "Apply for BOI endorsement on the LTR portal.",
      "Collect the LTR visa at a Thai embassy or in Thailand.",
    ],
    faq: [
      {
        question: "Is the Thailand golden visa open in 2026?",
        answer:
          "The closest equivalent, the LTR Wealthy Global Citizen visa, is open through the Board of Investment. Thailand Privilege is a separate paid membership.",
      },
      {
        question: "What is the minimum investment?",
        answer:
          "US$500,000 invested in Thailand (government bonds, a company, VC/PE or property) plus US$1M of global assets, and either US$50,000 health insurance or a US$100,000 deposit.",
      },
      {
        question: "Can Russian or Belarusian citizens apply?",
        answer:
          "The BOI rules do not exclude them. Expect standard KYC on the source of the US$1M assets; we are re-verifying this row.",
      },
      {
        question: "How long until citizenship?",
        answer:
          "LTR is not a citizenship route. It is a 10-year visa (5+5) with work-permit and tax features for some categories.",
      },
      {
        question: "Does buying a condo give a Thai visa?",
        answer:
          "No. Property can be part of the US$500K Thai investment for LTR, but on its own it does not replace the asset test, insurance and BOI endorsement.",
      },
    ],
    ruGuidePath: "/ru/thailand",
  },
  uae: {
    title: "UAE Golden Visa via Property (AED 2M) in 2026",
    description:
      "10-year UAE residence through AED 2M property: rules, off-plan, mortgages. Free route match.",
    h1: "UAE Golden Visa through property (AED 2M)",
    intro:
      "The UAE gives a 10-year Golden Residence to owners of property worth at least AED 2,000,000, registered in their name. Mortgages through an approved local bank and off-plan purchases from approved developers can qualify; below AED 2M you are looking at shorter property visas, not Golden.",
    aiDescription:
      "UAE Golden Residence via property 2026 (ICP): AED 2,000,000 registered ownership; approved-bank mortgage and approved off-plan can qualify; below AED 2M = 2-year property visa, not Golden. Not a citizenship route.",
    suits: [
      "You want a 10-year residence with no minimum stay.",
      "You plan to own UAE property worth AED 2M or more.",
      "You want a tax-friendly base, not an EU passport.",
    ],
    notSuits: [
      "You need an EU status or a path to citizenship.",
      "Your budget is below AED 2M and you expect a Golden visa.",
    ],
    ruByNote:
      "We have not found an RU/BY exclusion in the ICP rules, but banks, developers and payment routes apply their own checks. This row is being verified.",
    steps: [
      "Check that the property value (or combined properties) reaches AED 2M.",
      "Verify the broker's asking price against DLD sales data before paying.",
      "Complete the purchase and get the title deed in your name.",
      "Apply for the Golden Residence through ICP / GDRFA with the DLD documents.",
    ],
    faq: [
      {
        question: "Is the UAE golden visa open in 2026?",
        answer: "Yes. Property owners with AED 2,000,000 or more of registered property can apply for the 10-year Golden Residence.",
      },
      {
        question: "What is the minimum investment?",
        answer:
          "AED 2,000,000 of property registered in the applicant's name. Approved-bank mortgages and off-plan purchases from approved developers can qualify under the ICP/DLD checklist.",
      },
      {
        question: "Can Russian or Belarusian citizens apply?",
        answer:
          "We have not found a nationality exclusion in the ICP rules; banking and payment checks are the practical hurdle. This row is being verified.",
      },
      {
        question: "How long until citizenship?",
        answer: "The Golden Residence is not a citizenship route; UAE naturalisation is exceptional and not tied to property.",
      },
      {
        question: "Do I need to live in the UAE?",
        answer: "No minimum stay is required to keep the Golden Residence, unlike standard residence visas.",
      },
    ],
    ruGuidePath: "/ru/guides/kupit-nedvizhimost-dubaj-rossiyane-2026-visa-banki-dld",
  },
  hungary: {
    title: "Hungary Guest Investor Programme 2026",
    description:
      "Hungary's guest investor residence: €250K fund or €1M donation, and why the €500K property option was withdrawn. Free route match.",
    h1: "Hungary Guest Investor programme",
    intro:
      "Hungary's Guest Investor programme gives a 10-year residence permit for €250,000 in units of an approved real-estate fund (held at least five years) or a €1M donation to a university. A direct €500,000 property option was announced but withdrawn before launch.",
    aiDescription:
      "Hungary Guest Investor 2026 (OIF): €250K MNB-registered real-estate fund units held ≥5 years, or €1M donation to a higher-education institution; 10-year permit; national permanent residence possible after 3 years. €500K direct property route withdrawn before launch (Gazette 20.12.2024).",
    suits: [
      "You want an EU residence permit with a fund rather than a flat.",
      "You can lock €250,000 for at least five years.",
      "You want family members to be able to work.",
    ],
    notSuits: [
      "You want to buy an apartment for residence — the property route was withdrawn.",
      "You need full liquidity within five years.",
    ],
    ruByNote:
      "We have not confirmed an RU/BY exclusion for Guest Investor; fund managers and banks run their own checks. This row is being verified.",
    steps: [
      "Choose an approved fund registered with the Hungarian National Bank.",
      "Apply for the guest investor visa and enter Hungary.",
      "Complete the €250,000 fund subscription (or the €1M donation).",
      "Apply for the residence permit within 30 days of first entry.",
    ],
    faq: [
      {
        question: "Is the Hungary golden visa open in 2026?",
        answer: "Yes, as the Guest Investor programme: €250,000 in approved real-estate fund units or a €1M university donation.",
      },
      {
        question: "What is the minimum investment?",
        answer: "€250,000 in units of an MNB-registered real-estate fund, held for at least five years.",
      },
      {
        question: "Can I buy property instead of fund units?",
        answer:
          "No. A €500,000 direct property option was due on 1 January 2025 but was withdrawn in December 2024, before launch.",
      },
      {
        question: "Can Russian or Belarusian citizens apply?",
        answer: "We have not confirmed an exclusion; this row is being verified against OIF.",
      },
      {
        question: "How long until permanent residence or citizenship?",
        answer:
          "Guest Investor holders can apply for a national permanent residence card after three years. Citizenship timing is being verified.",
      },
    ],
    ruGuidePath: "/ru/hungary/programs/hungary-guest-investor",
  },
  malta: {
    title: "Malta Permanent Residence (MPRP) 2026",
    description: "Malta MPRP: property, contribution and timeline explained. Free route match.",
    h1: "Malta Permanent Residence Programme (MPRP)",
    intro:
      "Malta's MPRP gives permanent residence straight away for a package of assets, housing, a government contribution and fees. It is not a passport programme, and applications from Russia and Belarus are currently not eligible (Residency Malta FAQ).",
    aiDescription:
      "Malta MPRP 2026 (L.N. 146/2025): €500K assets incl. €150K liquid; property ≥€375K or lease ≥€14K/yr; €60K admin, €37K contribution, €2K donation; immediate permanent residence; RU/BY currently not eligible; PR ≠ citizenship.",
    suits: [
      "You want EU permanent residence without a minimum stay.",
      "You can fund the full family package, not just the €500K asset test.",
    ],
    notSuits: [
      "You hold an RU or BY passport.",
      "You expect a passport after a few years without living in Malta.",
    ],
    ruByNote:
      "Residency Malta currently does not accept MPRP applications from Russian and Belarusian nationals. We are re-verifying the official notice.",
    steps: [
      "Confirm passport eligibility and the full package cost for the family.",
      "Appoint a licensed Maltese agent.",
      "Pay the admin fee and submit the application with due diligence documents.",
      "After approval, buy or lease the property, pay the contribution and donation.",
    ],
    faq: [
      {
        question: "Is the Malta golden visa open in 2026?",
        answer: "MPRP is open to most nationalities, but not to Russian and Belarusian citizens at the moment.",
      },
      {
        question: "What is the minimum investment?",
        answer:
          "Assets of €500,000 (€150,000 liquid), plus a property purchase from €375,000 or a lease from €14,000 a year, a €60,000 admin fee, a €37,000 contribution and a €2,000 donation. We are re-verifying the current fee schedule.",
      },
      {
        question: "Can Russian or Belarusian citizens apply?",
        answer: "No — Residency Malta does not currently accept RU/BY applications.",
      },
      {
        question: "Does MPRP lead to citizenship?",
        answer:
          "MPRP gives permanent residence, not a passport. Naturalisation requires real residence in Malta and is a separate process.",
      },
      {
        question: "Do I need to live in Malta?",
        answer: "There is no minimum stay to keep MPRP status, but you must keep the qualifying property or lease.",
      },
    ],
    ruGuidePath: "/ru/malta/programs/malta-mprp",
  },
};

export const INVEST_EN_HUB_FAQ: InvestFaqItem[] = [
  {
    question: "Which golden visas are still open in 2026?",
    answer:
      "Portugal (funds only), Italy (not for RU/BY), Greece (not for RU/BY), Hungary (fund or donation), Malta MPRP (not for RU/BY), the UAE (AED 2M property) and Thailand LTR. Spain closed its golden visa on 3 April 2025.",
  },
  {
    question: "Which golden visas are open to Russian passports?",
    answer:
      "Portugal (ARI) and Thailand (LTR) do not exclude RU/BY citizens by law, though banks and funds run enhanced source-of-funds checks. Italy suspended its Investor Visa for RU/BY; Greece and Malta currently do not accept new RU/BY applications (Greek ministry circular of 21.04.2026; Residency Malta FAQ). The UAE and Hungary are being verified.",
  },
  {
    question: "What is the cheapest golden visa in 2026?",
    answer:
      "On paper Hungary (€250,000 fund units), Italy (€250,000 startup) and Greece (€250,000 conversion exception) start lowest. In practice Greece's €250K tier is narrow and Italy is closed to RU/BY, so the realistic floor depends on your passport.",
  },
  {
    question: "Does buying property still give EU residence?",
    answer:
      "Among the EU programmes we track, Greece is the only one where buying property is itself the qualifying investment. Malta MPRP requires buying or renting a home on top of government contributions. Portugal removed property in 2023, Spain closed its golden visa in 2025 and Hungary withdrew its property option before launch.",
  },
  {
    question: "Is this legal advice?",
    answer:
      "No. Emigro compares migration features of investment programmes with official sources and dates. Rules change — verify with the official source and a licensed lawyer before moving money.",
  },
];
