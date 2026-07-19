# MILLRAT Pack! preview

This repository contains a static homepage preview created exclusively for MILLRAT Studio. It is structured so the approved design can later be translated into a custom Shopify Online Store theme.

> **Preview and ownership notice**
>
> This repository is a preview created exclusively for MILLRAT Studio. It is not the final production website or Shopify theme. All MILLRAT names, logos, artwork, photography, game assets, copy and other intellectual property are owned by MILLRAT Studio and their respective creators. Nothing in this repository may be reused, resold, redistributed or treated as licensed for another project.

## Preview scope

- One expanded, responsive homepage
- Four-game overview and detailed game sections
- Functional “What should we play?” chooser
- Founder story, play contexts, FAQ and official campaign calls to action
- Plain HTML, modular CSS and vanilla JavaScript
- No framework, backend, paid app or build step

## Local preview

Run any basic static server from the repository root, for example:

```sh
python3 -m http.server 8000
```

Then visit `http://127.0.0.1:8000/`.

## Publishing

The site is designed for GitHub Pages using `main` as the publishing branch and `/` as the source directory. It does not use GitHub Actions, workflow files, deployment artifacts or Releases.

## Documentation

- [Asset sources](ASSET_SOURCES.md)
- [Shopify porting map](SHOPIFY_PORTING.md)

All rights reserved. No open-source licence is granted.
