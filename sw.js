if(!self.define){let e,n={};const i=(i,s)=>(i=new URL(i+".js",s).href,n[i]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=n,document.head.appendChild(e)}else e=i,importScripts(i),n()})).then((()=>{let e=n[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,c)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(n[r])return;let o={};const t=e=>i(e,r),a={module:{uri:r},exports:o,require:t};n[r]=Promise.all(s.map((e=>a[e]||t(e)))).then((e=>(c(...e),o)))}}define(["./workbox-10fbb8e3"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-e78e5211.css",revision:null},{url:"index.html",revision:"659528f2588eba5c666cf8ddc1279e73"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/favicon.svg",revision:"56a008e9bd60b006c94e9e858ffe47b6"},{url:"icons/transparent/manifest-icon-192.png",revision:"54d4a318ac1905ff9a8ba2225e1f4d2c"},{url:"icons/transparent/manifest-icon-512.png",revision:"e8fd8063d47b702aabef64e86fe8382c"},{url:"icons/maskable/manifest-icon-192.png",revision:"315685ef304a4a0830a51af99d6c3d40"},{url:"icons/maskable/manifest-icon-512.png",revision:"52c0d0bf3233a23c0c440da6d89d0d39"},{url:"manifest.webmanifest",revision:"622473a8067effbd46734c6334c2ead9"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/madcampos.dev\/.*/iu,new e.CacheFirst({cacheName:"app-cache",plugins:[new e.ExpirationPlugin({maxAgeSeconds:2592e3,maxEntries:100})]}),"GET"),e.registerRoute(/^(?!https:\/\/madcampos.dev\/).*/iu,new e.NetworkOnly,"GET")}));
