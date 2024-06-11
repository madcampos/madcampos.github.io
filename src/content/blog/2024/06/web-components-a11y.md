---
title: Web Components Accessibility
summary: A summary of what tools and accessibility there is for web components
image: 
imageAlt: 
createdAt: 2024-06-07T11:13:08.054-04:00
draft: true
tags:
  - a11y
  - Accessibility
  - coding
  - web-components
  - WebDevelopment
  - FrontendDevelopment
---
Yesterday I woke up to a notification on Slack, tagging me to answer a question:

> How accessible are web components?

After a very long answer, I decided to turn _that_ content into _this_ content. The following post it an expanded version of my comment.

## To Shadow DOM or not to Shadow DOM?

Let's recap a little bit on the basics of web components...

The Shadow DOM is a way to encapsulate and hide the implementation of your components, much like the `video` and `audio` tags have controls like play and pause buttons and a seek bar, web components can also have "hidden parts" that are there but not exposed to the page. You only have one single tag on the page and not a bunch of things for all the parts _inside_ that tag.

You can read more about web components on those two posts:

- [Web Component: A (Not So) Gentle Introduction](https://madcampos.dev/blog/2023/06/web-components-basics/)
- [Tabs, Tabs, Tabs](https://madcampos.dev/blog/2023/07/tabs-web-component/)

Okay, back to the Shadow DOM, you can either use it, or not. Below are two examples, the first without a Shadow DOM and the second one with it (using [Declarative Shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom)).

```html
<component-without-shadow>
	<h1>A rogue H1 appears in the wrong place!</h1>
	<button type="button">Click Me!</button>
	<p>Some extra text to the component</p>
</component-without-shadow>
```

```html
<component-with-shadow>
	<template shadowrootmode="open">
		<h1>A rogue H1 appears in the wrong place!</h1>
		<button type="button">Click Me!</button>
		<p>Some extra text to the component</p>
	</template>
</component-with-shadow>
```

Both examples will handle the button focus as expected and show the button focus on the accessibility tree. But the one with the Shadow DOM will not add the `h1` and `p` tags to the accessibility tree.

So, let's answer this first part about accessibility with a quote: 

>"It depends"
>-- Senior Developer

Okay, _how_ does it depends? If you only care about focusability, it will be just fine, maybe a little bit weird though.

However, if you want to expose more information to the accessibility tree, then the next solutions are what you are looking for.

## The first rule of ARIA...

As everyone know, the first rule of ARIA is: don't use ARIA!

Oh, you didn't? Shame

(add gif for GOT shame sene)

Jokes aside, using any of the `aria-*` attributes will _OVERWRITE_ the default attributes for that element, and break expectations, and make it confusing to users. It is better to have a shitty experience that still works than an experience that doesn't work and is shitty on top of that.

Okay, with that out of the way, unfortunately until as recently as March 2023 the only way to make a web component anything other than a `role=generic` element was to add a `role` attribute and all the needed `aria-*` attributes related to that role.

This works, but is not pretty... Back to our original question, one way to make web component accessible is add the needed ARIA attributes to the component.

Here is an example on how to do that from inside the component:

```typescript
export class SemiAccessibleComponent extends HTMLElement {
	constructor() {
		super();

		this.attachShadow();
		this.shadowRoot.innerHtml = 'Content from inside a custom region';

		this.setAttribute('role', 'region');
		this.setAttribute('aria-label', 'Custom region from a web component');
	}
}

customElements.define('semi-accessible-component', SemiAccessibleComponent);
```

You can also do this from html:

```html
<semi-accessible-component role="region" aria-label="Custom region from a web component">
	<template shadowrootmode="open">
		Content from inside a custom region
	</template>
</semi-accessible-component>
```
