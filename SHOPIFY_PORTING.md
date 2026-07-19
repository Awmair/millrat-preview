# Shopify porting map

The preview deliberately mirrors Shopify Online Store theme architecture without including Liquid or Shopify-specific runtime code yet.

## Proposed theme structure

| Preview area | Shopify implementation |
|---|---|
| Sticky header | `sections/header.liquid` inside `sections/header-group.json` |
| Hero | `sections/millrat-hero.liquid` with image picker, eyebrow, heading, copy and CTA settings |
| Play-context strip | `sections/play-context-strip.liquid` with repeatable text blocks |
| Lineup overview | `sections/game-lineup.liquid` with image picker and four game blocks |
| Game chooser | `sections/game-chooser.liquid` with game blocks and the existing vanilla JavaScript |
| Game showcases | Four instances of `sections/game-feature.liquid`, or one section with four repeatable game blocks, including the animated rules accordion |
| Play contexts | `sections/image-with-play-contexts.liquid` |
| Founder story | `sections/founder-story.liquid` |
| Unboxing | `sections/unboxing-feature.liquid` |
| Kickstarter status | `sections/campaign-status.liquid` with the official Kickstarter card embed and deadline setting |
| FAQ | `sections/faq.liquid` with question blocks |
| Final CTA and questions form | `sections/campaign-cta.liquid` using Shopify’s native contact-form Liquid tag |
| Footer | `sections/footer.liquid` inside `sections/footer-group.json` |

The homepage becomes `templates/index.json`, listing these sections in the approved order.

## Chooser migration

The chooser’s game records currently live in `assets/js/main.js`. In Shopify:

1. Represent each game as a section block.
2. Add settings for title, anchor, minimum players, maximum players, duration, category, category label and image.
3. Render those settings into a JSON script element inside the section.
4. Read that JSON from the existing vanilla JavaScript.
5. Preserve the current filtering, deterministic tie-breaking, result display, focus transfer and reduced-motion handling.

No app or backend is required.

## Contact form migration

The GitHub preview demonstrates the form layout and validation without pretending to send data. In Shopify, wrap the same Name, Email and Question fields in Shopify’s native contact-form Liquid tag so submissions use the store’s contact system without a third-party form service.

## Theme settings

Move the CSS custom properties from `assets/css/styles.css` into Shopify theme settings:

- Studio and game colours
- Display and body fonts
- Button colours and shape
- Paper texture intensity
- Border width, corner radius and shadow depth
- Desktop and mobile spacing

Per-section settings should override global defaults when required. Images should use Shopify `image_picker` settings and `image_url` filters rather than remote URLs.

## Product integration

The preview links to the current Kickstarter campaign. When MILLRAT Pack! exists as a Shopify product:

- Add a product-picker setting to CTA-bearing sections.
- Replace campaign CTAs with the selected product URL or product form.
- Keep the chooser’s recommendation focused on a game, while its purchase action points to the complete MILLRAT Pack! product.
- Do not create separate product claims for individual games unless MILLRAT Studio later sells them separately.

## Portability boundaries

- Semantic HTML is already section-scoped through `data-section` attributes.
- Styling is centralized, responsive and free from framework dependencies.
- JavaScript uses no packages or build tooling.
- Motion uses CSS keyframes, hover states, native pointer events and small `IntersectionObserver` helpers; the magnetic CTAs, fanning game cards, section wipes, scroll trail, image tilt, moving strip, accordion steps and chooser celebration can move directly into Shopify theme assets without an app.
- Reduced-motion preferences soften or slow the decorative motion while preserving the continuous campaign strip and visible content.
- External campaign images must be replaced with originals supplied by MILLRAT Studio.
- No account, checkout, search or customer logic is simulated in the preview.
