# MeviCar Next · Navi PWA

Cockpit-Navigation als installierbare Progressive Web App (Querformat / Vollbild).

## Live

**https://eskiya771.github.io/groktacho/**

## iPhone installieren

1. URL in **Safari** öffnen  
2. Teilen → **Zum Home-Bildschirm**  
3. Quer halten  

## Lokal testen

```bash
python3 -m http.server 8080
```

## Inhalt

| Datei | Beschreibung |
|--------|----------------|
| `index.html` | Navi-UI |
| `manifest.webmanifest` | PWA-Manifest (fullscreen, landscape) |
| `sw.js` | Service Worker (Offline) |
| `icons/` | App-Icons |
| `.github/workflows/deploy-pages.yml` | Auto-Deploy zu GitHub Pages |
