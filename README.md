# Swiss town locator

A website to test and train your knowledge of the location of Swiss towns.
The user is prompted with the name of a town and clicks on the map to guess its location.

**Live:** <https://townsinswitzerlandlocator.netlify.app/>

---

## Deployment

Hosted on [Netlify](https://www.netlify.com/), which builds and deploys automatically
on every push to `main` (no build step — the site is served straight from the repo root).

## Features
- Difficulty selector: choose how many towns to cycle through (default 20, up to all 2100)
- Responsive table: coordinates column hidden below 1200 px, population column hidden below 700 px

## City data

`assets/cards/cards.xml` contains all **2100 Swiss municipalities** (Gemeinden) with official population,
WGS84 coordinates, and canton — sourced from the
[GeoNames Switzerland dump](https://download.geonames.org/export/dump/CH.zip) (CC-BY),
which mirrors the official BFS Gemeindeverzeichnis.
The file is committed to the repo; no script needs to be run.

## Todo
- Location is still iffy!