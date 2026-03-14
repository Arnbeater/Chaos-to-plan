# Chaos-to-plan

En lille webapp, hvor du smider løse noter ind, og appen strukturerer dem til:

- mål
- leverancer
- tidslinje
- risici
- næste skridt

## Hvad er "motoren" lige nu?

Appen bruger en **regelbaseret systematiseringsmotor** (ikke LLM endnu):

1. Noter splittes i linjer/sætninger.
2. Hver linje scores mod kategorier via vægtede nøgleord (fx `deadline`, `risiko`, `leverance`).
3. Ekstra signaler (datoer, ansvar, måltal) justerer scoren.
4. Højeste score bestemmer kategori.
5. Manglende sektioner får system-forslag (fx manglende tidslinje/risiko).

Det betyder: mere end bare "tekst i bidder" — den forsøger faktisk at strukturere indhold og udfylde oplagte huller.

## Mangler vi baggrundsdata/algoritme?

**Ikke nødvendigt for MVP**, men næste niveau er:

- **LLM-backend** (OpenAI/Anthropic) med fast JSON-output for højere kvalitet.
- **Domæneskabeloner** (fx marketing, produkt, interne projekter) for bedre relevans.
- **Feedback-loop** hvor bruger kan rette kategorisering, og regler/prompt forbedres.

## Kør lokalt

```bash
python3 -m http.server 4173
```

Åbn derefter `http://localhost:4173` i din browser.

## Deploy på Vercel

### Hurtigst (via Vercel dashboard)
1. Push repo til GitHub.
2. Gå til Vercel → **Add New Project**.
3. Importér `Chaos-to-plan` repo.
4. Framework preset: **Other** (ingen build command nødvendig).
5. Klik **Deploy**.

### Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

Repoet indeholder `vercel.json`, så deploy kører som statisk site med clean URLs og basis security headers.
