if(!self.define){let e,i={};const l=(l,s)=>(l=new URL(l+".js",s).href,i[l]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=l,e.onload=i,document.head.appendChild(e)}else e=l,importScripts(l),i()})).then((()=>{let e=i[l];if(!e)throw new Error(`Module ${l} didn’t register its module`);return e})));self.define=(s,d)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let c={};const n=e=>l(e,o),r={module:{uri:o},exports:c,require:n};i[o]=Promise.all(s.map((e=>r[e]||n(e)))).then((e=>(d(...e),c)))}}define(["./workbox-27b29e6f"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/base-20980c93.css",revision:null},{url:"assets/index-4c0e7e56.css",revision:null},{url:"assets/index-7328d0d2.css",revision:null},{url:"assets/index-ba89750f.css",revision:null},{url:"assets/index-d266dcc2.css",revision:null},{url:"blog/2023/05/hello-world/index.html",revision:"c7235ebdb298e3ef97e6867b4d495c27"},{url:"blog/2023/05/index.html",revision:"40dc2dbc9c62603ebde0fed426f06b45"},{url:"blog/2023/06/blog-structure/index.html",revision:"3b46791407aa4d68c20528706bb8252d"},{url:"blog/2023/06/index.html",revision:"d7961b5423822c700d5aced969abe327"},{url:"blog/2023/06/web-components-basics/index.html",revision:"1f632547483919bcb03bb60d0f54ce98"},{url:"blog/2023/06/xml-is-not-dead/index.html",revision:"74a559772fdb8c9f4591dd0502dddbc1"},{url:"blog/2023/07/index.html",revision:"288d173560e135ab3ab913c087a0e1cf"},{url:"blog/2023/07/tabs-web-component/index.html",revision:"4324ae3893d56fadb4ea2e0d6d6ffa7f"},{url:"blog/2023/index.html",revision:"a20db4cfdb622570c7c7143bacce72ed"},{url:"blog/BreakIntoTech/index.html",revision:"cc26dbd5642e90b448c819f1f275408a"},{url:"blog/BuildingInPublic/index.html",revision:"036310d94fffada59b2eaf3a97e8ec6b"},{url:"blog/BuildInTheOpen/index.html",revision:"51d02208c80f5bc85d3567f2a77e8077"},{url:"blog/coding/index.html",revision:"9940fba03b3b30df77d1f00b601a5ebb"},{url:"blog/CSS/index.html",revision:"94cef705a147384ffa2afe930d2a443c"},{url:"blog/FrontendDevelopment/index.html",revision:"cf3a4caae656e7985ecedd2d1b3f5c8b"},{url:"blog/html/index.html",revision:"af9b9874cb7f0e439b7d1e363d514bd9"},{url:"blog/index.html",revision:"3fe435390fc6d33a42bd48dd16cda097"},{url:"blog/JavaScript/index.html",revision:"a1185a67cb5c168f23992ecc0b2c2c3f"},{url:"blog/LearnToCode/index.html",revision:"c25f0f4a44eb43cc64196697a803c143"},{url:"blog/meta/index.html",revision:"213ace5cab649b611ab78eaa110fe363"},{url:"blog/TS/index.html",revision:"ae54f4d49c2a18ea6a853c15c7309207"},{url:"blog/TypeScript/index.html",revision:"1d6ac834dd2ce651aac1c3c283d5b3fd"},{url:"blog/vite/index.html",revision:"450cc81da6a2cba7b27b7d90d060e3c2"},{url:"blog/web-components/index.html",revision:"df2e0340b060a5bfc22ef8a911afc98f"},{url:"blog/web/index.html",revision:"3508ca3ab33c32e80274e9e4dd128277"},{url:"blog/XML/index.html",revision:"ad27239fd4a9f04f364f550b7dff63c9"},{url:"css/xml-changelog.css",revision:"4c4cf398129e0aba4072390854381e32"},{url:"css/xml-feed.css",revision:"87d9f0bdc7143017e0d9c7bf8307cefe"},{url:"index.html",revision:"0252ab90c32a8b33820ef012de177b3b"},{url:"projects/fallout-walkthrough/assets/index-28115afa.css",revision:null},{url:"projects/fallout-walkthrough/assets/main-b7ac311d.js",revision:null},{url:"projects/fallout-walkthrough/index.html",revision:"01e1fa991067bd8718826dafc66a49cf"},{url:"projects/fallout-walkthrough/registerSW.js",revision:"6cd7cecc48633ef1f6668f36ec06837b"},{url:"projects/fallout-walkthrough/sw.js",revision:"bd7dd4febac07a6f70638e13e5c68de3"},{url:"projects/fallout-walkthrough/workbox-31af20fe.js",revision:null},{url:"projects/index.html",revision:"ab4ddced58a1951839944c2ec0af38c5"},{url:"projects/oldwebtext/css/base.css",revision:"67bae88bc12a759fed67131919bdc338"},{url:"projects/oldwebtext/index.html",revision:"ea83799a3c52f31168280201b28cc33f"},{url:"projects/oldwebtext/js/default-decorators.json.proxy.js",revision:"ef650e293d911a0896526887d1d9728b"},{url:"projects/oldwebtext/js/default-styles.json.proxy.js",revision:"63563f29a66c7efeeb35e0dd54e61680"},{url:"projects/oldwebtext/js/lib.js",revision:"336ed3bc88ff56889c70a04a1c39b9b5"},{url:"projects/oldwebtext/js/main.js",revision:"3f01d5fe9f8ca89a290c7417c4385552"},{url:"projects/oldwebtext/meta/env.js",revision:"b7fa1faa90d201b7e3f0c327fc9e7061"},{url:"projects/oldwebtext/sw.js",revision:"b36ffc040e8658e3929addcc7d1e8222"},{url:"talks/index.html",revision:"d6302a0a2372c397a50b608a2e3c1c9c"},{url:"talks/tojs-web-components/demo.html",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"talks/tojs-web-components/index.html",revision:"606166c6567efa9146038fbd1d3f9c4e"},{url:"icons/favicon.svg",revision:"47e812a2020a01fbe1250fdf4e1628b2"},{url:"icons/transparent/manifest-icon-192.png",revision:"8e62bb2626cdd73c77c1383fd0aa14f4"},{url:"icons/transparent/manifest-icon-512.png",revision:"39665b507b73b4ccf2a65f2be95a40a6"},{url:"icons/maskable/manifest-icon-192.png",revision:"fd2f47973196d430dee7ef6385a5131e"},{url:"icons/maskable/manifest-icon-512.png",revision:"1e1b99d3686113d962b9b5b0e36ba84d"},{url:"manifest.webmanifest",revision:"aef25dd53754309d1ac9377d7176ad93"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
