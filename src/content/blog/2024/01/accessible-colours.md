---
title: Making colours more accessible
summary: Sharing a problem I got at work and how I solved it
image: ./assets/rainbow-eye.jpg
imageAlt: AI generates image of an eye with a radial gradient of a rainbow on it's iris
createdAt: 2024-01-29
tags:
  - a11y
  - colors
  - design
  - CSS
  - BuildInTheOpen
  - BuildingInPublic
  - FrontendDevelopment
---
There was an interesting problem at work the other day. In short we have a dynamic list of things to display on the screen, all of them have a dotted border and coloured text.

Those colours are picked dynamically from a cycling list of colours. But not all of them have enough contrast with the background and some are really hard to see.

How to fix that?

## WCAG to the rescue!

The [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG22/), WCAG for short, say that:

> The visual presentation of [text](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html#dfn-text) and [images of text](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html#dfn-image-of-text) has a [contrast ratio](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html#dfn-contrast-ratio) of at least 4.5:1.

Here is the full reference: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

Basically it says that the contrast between the colour used for text and borders has to have a contrast of 4.1 against the background colour.

## Engineering a solution

As I didn't want to manually check all colours and still wanted to pick between similar hues, I went out to gather a list of colours and check their contrasts. That was made possible thanks to [color.js](https://colorjs.io/) that provides some handy functions to calculate colour contrast.

I used two criteria to check for the contrast:
1. WCAG 2.2 contrast algorithm.
2.  Accessible Perceptual Contrast Algorithm (APCA), the fancy new algorithm that will be used for WCAG 3.

Then was just a matter of listing out the colours and picking them.

## Picking colours

To generate the final list of colours I used a simple HTML `<form>` element with checkboxes representing all of the colours on the list, the ones that were not selected were styled to show only the colours hexadecimal code.

After that I set some pre-selection criteria, so all colours with a contrast of at least 5 on WCAG and 50 on APCA were pre-selected, all others were not.

Here is the end result:

<iframe height="300" style="width: 100%;" scrolling="no" title="Color contrast list checking" src="https://codepen.io/madcampos/embed/preview/abMVLXm?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true" referrerpolicy="no-referrer" sandbox="allow-forms allow-scripts allow-same-origin">
  See the Pen <a href="https://codepen.io/madcampos/pen/abMVLXm">
  Color contrast list checking</a> by Marco Campos (<a href="https://codepen.io/madcampos">@madcampos</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>