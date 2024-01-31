---
title: Noriture
status: ongoing
createdAt: 2022-08-08
updatedAt: 2024-01-20
version: 0.1.0
image: ./assets/40-noriture.png
imageAlt: An orange circle representing an orange slice with 4 segments, with the top right one being 3 curved lines representing the RSS symbol.
techStack:
  - GitHub Pages
  - Hono
  - IndexedDB
  - JavaScript
  - PWA
  - Vite
  - Vue
repository: https://github.com/madcampos/noriture/
---
This project is a prototype RSS feed reader. It uses [vue](https://vuejs.org/) for the frontend and [hono](https://hono.dev) for the backend.

It includes a parser for both RSS and Atom XML feeds, as well as for site metadata from different sources like favicons, web app manifest, or browser specific icons.

The server works as a simple reverse proxy to allow loading the XML file