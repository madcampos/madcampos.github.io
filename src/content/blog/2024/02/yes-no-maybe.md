---
title: Yes, no, maybe 🎱
createdAt: 2024-02-05
summary: A study on intermediate state checkboxes and how to handle state in react.
draft: true
tags:
  - BuildingInPublic
  - BuildInTheOpen
  - coding
  - FrontendDevelopment
  - web
---
The other day I was working on a problem that required [intermediate state checkboxes](https://developer.mozilla.org/en-US/docs/Web/CSS/:indeterminate).

Now that is not something we need everyday and can be tricky to work with. But I'm here to exercise my favourite sport: **bash on react!** 🏏

## "Lifting the state"

React's response when you have to access data from a child component is to ["lift the state up"](https://react.dev/learn/sharing-State-between-components). But that can become problematic really fast.

When you lift the state up, you are basically telling react that it should re-render everything from that component down, even if there is no state change on the children and you are only _reading_ that bit of data not _writing_ to it.

React's rendering system does not have granular control on small changes and will re-render everything, even if no changes have happened, which causes performance issues. This is more pronounced on slow devices or large lists.

## Web components to the rescue

This is where the mental from web components shine. As each component is responsible for it's own state and is a [best practice](https://web.dev/articles/custom-elements-best-practices#aim-to-keep-primitive-data-attributes-and-properties-in-sync,-reflecting-from-property-to-attribute,-and-vice-versa) to expose it to the parent. You can just read the property on the HTML element and that will give you the answer, no need to re-render anything.

Another interesting fact is that even if you change the child components, it will not update the parent. If you change the parent, it will not trigger re-rendering of the children. This separation of concerns can be made more explicit with the use of `<slot>`s.

## Redux, signals, and friends

One potential solution to this problem is using redux or signals. I particularly don't like redux because it adds too much complexity for a case that, while not trivial, does not justify the complexity added.

The other solution would be signals, but that is just a react-ism of [standard events](https://developer.mozilla.org/en-US/docs/Web/API/Event). You can actually even use [custom events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) _reliably_ since Internet Explorer 10 days, but react just ignores all that...

## Show & Tell

Here I'm going to give examples of the following methods:
- React with state lifted
- React with signals
- Web components with properties
- Web components with custom events
