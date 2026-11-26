-- SEO patch for community_notes row exists in prod only (no TS editorial seed).
-- Apply in production after deploy; do not run from agent against prod DB.
update community_notes
set
  seo_title = 'Portale Immigrazione Milano 2026: kit e stato',
  seo_description = 'Portale Immigrazione digitale 2026: kit postale Poste, stato pratica permesso, Questura Milano. Non confondere con Sportello Unico lavoro.',
  quick_answer = 'Dopo il visto D, controllate lo stato del permesso su portaleimmigrazione.it con codici della ricevuta Poste. Il kit giallo si consegna in Sportello Amico (guida poste.it). Questura Milano: convocazione impronte. Emigro: /notes/permesso-questura-milano-2026.',
  updated_at = now()
where slug = 'portale-immigrazione-digitale-milano-2026';