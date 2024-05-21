---
title: Web standards make us more accessible
summary: Quick note on Interop, the browser initiative for interoperability and how it focus on accessibility in 2024
createdAt: 2024-05-21T12:29:53.108-04:00
draft: true
tags:
  - a11y
  - FrontendDevelopment
  - OpenWeb
  - WebDevelopment
  - Interop
---
> This is a late post for Global Accessibility Awareness Day (GAAD).

For a few years now, browser vendors gather together for something called "Interop" (here is the link for the 2024 edition: https://wpt.fyi/interop-2024).
This is a joint effort to make the web more _interoperable_, making things behave the same and in a predictable manner.

## The good parts

One of the things that I like most about Interop is that they don't look only to the shiny new features. There is also effort put on making existing and legacy features work in the same way across browsers.

That effort includes revisiting things like forms, text encoding, and mouse event. all things that we take for granted but _used to have_ very slight differences between browsers.

## The star of the show

One of the focus areas in 2024 is _accessibility_!

It includes:
- Roles and announcing them consistently and correctly
- SVG content
- Forms
- More forms
- Even more forms

## Why does it matter?

Standards give us a goal to strive for. Having robust standards, with sensible and accessible defaults makes developer lives easier, and by consequence, user lives easier.

When the world is hostile to your existence, having some support and thought put into your needs is a good thing. It takes some weight out of our backs.

## We are getting there!

I'm excited to read the support across the board be of [90% and improving](https://wpt.fyi/interop-2024)!

![A screenshot of the Interop Dashboard for 2024, containing the header and first line of a table. The header reads, from left to right: "Active Focus Areas"; The icon for Chrome Canary; The icon for Edge Dev; The icon for Firefox Nightly; The Icon for Safari Technology Preview; "Interop". The first line reads: "Accessibility"; 95.3% for Chrome; 94.4% for Edge; 96.7% for Firefox; 92.8% for Safari; 90.2% for Interop.](assets/interop-a11y.png)

## What does that mean for me?

For me, as a developer, not having to worry that some browser and screen reader combination do a weird thing makes testing easier and less time consuming. It makes me feel confident that I'm delivering a product that is accessible and doesn't exclude people.

We should all be writing our code in an accessible way, it _helps everyone_! Including _you_ when you don't have your glasses on, or when you are cooking and have greasy hands, or when you are on the subway and the connection is spotty.

And to close this post, here is a #protip use accessible patterns when developing complex interactions: https://www.w3.org/WAI/ARIA/apg/patterns/