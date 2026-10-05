export type ComoSourceAsset = {
  id: string;
  fileTitle: string;
  output: string;
  expectedLicense: RegExp;
};

export const COMO_MEDIA_MANIFEST: ComoSourceAsset[] = [
  { id: "san-martino", fileTitle: "File:Griante San Martino.JPG", output: "hiking-san-martino.webp", expectedLicense: /CC BY-SA 3\.0/i },
  { id: "monte-grona", fileTitle: "File:Cima del Monte Grona 1.736 m s.l.m, vista da sud con betulle autunnali - 2015-10-25, Plesio (Como).JPG", output: "hiking-monte-grona.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "monte-crocione", fileTitle: "File:Panorama dal Pizzo della Croce (6).jpg", output: "hiking-monte-crocione.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "sacro-monte", fileTitle: "File:Sacro Monte di Ossuccio (Como) 02.jpg", output: "hiking-greenway-ossuccio.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "madesimo-larici", fileTitle: "File:ITA — Lombardia — Provincia di Sondrio — Madesimo — Larici (Talstation) 2020.JPG", output: "madesimo-larici.webp", expectedLicense: /CC BY 3\.0 DE/i },
  // File:Madesimo piste.jpg is CC BY-SA 3.0 but only 800 px wide.
  { id: "madesimo-piste", fileTitle: "File:In ovovia a Madesimo.jpg", output: "madesimo-piste.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "madesimo-groppera", fileTitle: "File:Groppera e Canalone di Madesimo - panoramio.jpg", output: "madesimo-groppera.webp", expectedLicense: /CC BY-SA 3\.0/i },
  { id: "madesimo-motta", fileTitle: "File:Mountain view, Alpe Motta-Madesimo, Italy.jpg", output: "madesimo-alpe-motta.webp", expectedLicense: /CC BY-SA 4\.0/i },
  // Panoramio file is CC BY 3.0 but shows a fog-bound reservoir with no roadway.
  { id: "madesimo-road", fileTitle: "File:Strada Statale 36 Passo dello Spluga (2025-08-28 1).jpg", output: "madesimo-ss36.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "ferry-lario", fileTitle: "File:Ferry Lario on Lake Como (Cadenabbia) - June 2020.jpg", output: "ferry-cadenabbia-traghetto.webp", expectedLicense: /CC BY 3\.0/i },
  { id: "ferry-triangle", fileTitle: "File:Bellagio and Lake Como from Menaggio-Varenna ferry.jpg", output: "ferry-central-triangle.webp", expectedLicense: /CC BY-SA 3\.0/i },
  { id: "ferry-bellagio", fileTitle: "File:Bellagio - Lario Ferry on Lake Como.jpg", output: "ferry-bellagio-lario.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "villa-carlotta", fileTitle: "File:Villa Carlotta, Tremezzo, Lake Como-2.jpg", output: "attraction-villa-carlotta.webp", expectedLicense: /CC BY 2\.0/i },
  // File:Villa Balbianello.jpg is CC BY 2.0 but only 989 px wide.
  { id: "villa-balbianello", fileTitle: "File:Villa del Balbianello Lago di Como featured in Casino Royale and in Star Wars (20063743160).jpg", output: "attraction-balbianello.webp", expectedLicense: /CC BY-SA 2\.0/i },
  // File:Villa Monastero Vista sul Lago di Como.jpg is CC BY-SA 4.0 but only 960 px wide.
  { id: "villa-monastero", fileTitle: "File:Sea facing side of Villa Monastero, Varenna.jpg", output: "attraction-villa-monastero.webp", expectedLicense: /CC BY-SA 3\.0/i },
  // Perledo panorama is CC BY-SA 4.0 but too hazy to identify the island.
  { id: "isola-comacina", fileTitle: "File:IsolaComacinaPanorama1.jpg", output: "attraction-isola-comacina.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "varenna", fileTitle: "File:Varenna - Coast, hotel Olivedo.jpg", output: "attraction-varenna.webp", expectedLicense: /CC BY-SA 4\.0/i },
];
