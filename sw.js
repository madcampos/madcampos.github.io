if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,o)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(i[d])return;let l={};const r=e=>n(e,d),c={module:{uri:d},exports:l,require:r};i[d]=Promise.all(s.map((e=>c[e]||r(e)))).then((e=>(o(...e),l)))}}define(["./workbox-7369c0e1"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/base-dc00ba71.css",revision:null},{url:"assets/blog-a9d8cae0.css",revision:null},{url:"blog/2023/05/hello-world/index.html",revision:"4fef98d039dc5ed3106c58e566ad280c"},{url:"blog/2023/05/index.html",revision:"cfaa67e5a7ab5f4dc86ea3b693ef7621"},{url:"blog/2023/index.html",revision:"ce630c2475ff6e08c705f36dd53394e0"},{url:"blog/buildintheopen/index.html",revision:"0cbde597769d8bf1ddb8d32e96c72194"},{url:"blog/coding/index.html",revision:"5b39f4f73616ae19c6614203d96cb7fe"},{url:"blog/index.html",revision:"945393d94423ce0dabaaf567774d34f6"},{url:"blog/meta/index.html",revision:"008d74e2f6a12da538a65db4c0f1eb0b"},{url:"blog/ts/index.html",revision:"a8f702fe4a579a1d0cc5cab07919836c"},{url:"blog/vite/index.html",revision:"4df61bcc98fc370d2fcb3bdc569c39a2"},{url:"index.html",revision:"4d8be92a581b3194aa47a8349b6b8cbf"},{url:"icons/favicon.svg",revision:"47e812a2020a01fbe1250fdf4e1628b2"},{url:"icons/transparent/manifest-icon-192.png",revision:"8e62bb2626cdd73c77c1383fd0aa14f4"},{url:"icons/transparent/manifest-icon-512.png",revision:"39665b507b73b4ccf2a65f2be95a40a6"},{url:"icons/maskable/manifest-icon-192.png",revision:"fd2f47973196d430dee7ef6385a5131e"},{url:"icons/maskable/manifest-icon-512.png",revision:"1e1b99d3686113d962b9b5b0e36ba84d"},{url:"manifest.webmanifest",revision:"46f146dde5bc736fb9550486a0a53437"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
