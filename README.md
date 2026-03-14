# Chaos-to-plan

En lille webapp, hvor du smider løse noter ind, og appen strukturerer dem til:

- mål
- leverancer
- tidslinje
- risici
- næste skridt

## Kør lokalt

```bash
python3 -m http.server 4173
```

Åbn derefter `http://localhost:4173` i din browser.

## Hvordan virker den?

- Du skriver rå noter i tekstfeltet.
- Når du klikker **Strukturer noter**, forsøger appen at kategorisere hver linje via nøgleord.
- Hvis en note ikke matcher et nøgleord, fordeles den i en fast fallback-rækkefølge.
