var Qo=Object.create;var Wt=Object.defineProperty;var Go=Object.getOwnPropertyDescriptor;var Te=(s,t)=>(t=Symbol[s])?t:Symbol.for("Symbol."+s),ot=s=>{throw TypeError(s)};var Me=(s,t,e)=>t in s?Wt(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var Ae=(s,t)=>Wt(s,"name",{value:t,configurable:!0});var U=s=>[,,,Qo(s?.[Te("metadata")]??null)],Le=["class","method","getter","setter","accessor","field","value","get","set"],ct=s=>s!==void 0&&typeof s!="function"?ot("Function expected"):s,Yo=(s,t,e,o,n)=>({kind:Le[s],name:t,metadata:o,addInitializer:r=>e._?ot("Already initialized"):n.push(ct(r||null))}),Zo=(s,t)=>Me(t,Te("metadata"),s[3]),u=(s,t,e,o)=>{for(var n=0,r=s[t>>1],i=r&&r.length;n<i;n++)t&1?r[n].call(e):o=r[n].call(e,o);return o},f=(s,t,e,o,n,r)=>{var i,a,l,c,b,d=t&7,S=!!(t&8),v=!!(t&16),F=d>3?s.length+1:d?S?1:2:0,Ce=Le[d+5],ke=d>3&&(s[F-1]=[]),Jo=s[F]||(s[F]=[]),P=d&&(!v&&!S&&(n=n.prototype),d<5&&(d>3||!v)&&Go(d<4?n:{get[e](){return g(this,r)},set[e](k){return St(this,r,k)}},e));d?v&&d<4&&Ae(r,(d>2?"set ":d>1?"get ":"")+e):Ae(n,e);for(var jt=o.length-1;jt>=0;jt--)c=Yo(d,e,l={},s[3],Jo),d&&(c.static=S,c.private=v,b=c.access={has:v?k=>Xo(n,k):k=>e in k},d^3&&(b.get=v?k=>(d^1?g:x)(k,n,d^4?r:P.get):k=>k[e]),d>2&&(b.set=v?(k,qt)=>St(k,n,qt,d^4?r:P.set):(k,qt)=>k[e]=qt)),a=(0,o[jt])(d?d<4?v?r:P[Ce]:d>4?void 0:{get:P.get,set:P.set}:n,c),l._=1,d^4||a===void 0?ct(a)&&(d>4?ke.unshift(a):d?v?r=a:P[Ce]=a:n=a):typeof a!="object"||a===null?ot("Object expected"):(ct(i=a.get)&&(P.get=i),ct(i=a.set)&&(P.set=i),ct(i=a.init)&&ke.unshift(i));return d||Zo(s,n),P&&Wt(n,e,P),v?d^4?r:P:n},z=(s,t,e)=>Me(s,typeof t!="symbol"?t+"":t,e),Bt=(s,t,e)=>t.has(s)||ot("Cannot "+e),Xo=(s,t)=>Object(t)!==t?ot('Cannot use the "in" operator on this value'):s.has(t),g=(s,t,e)=>(Bt(s,t,"read from private field"),e?e.call(s):t.get(s)),h=(s,t,e)=>t.has(s)?ot("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(s):t.set(s,e),St=(s,t,e,o)=>(Bt(s,t,"write to private field"),o?o.call(s,e):t.set(s,e),e),x=(s,t,e)=>(Bt(s,t,"access private method"),e);var Re=["base-reset","component","theme-base","theme-component"];function ts(s){let t=new Set;try{for(let e of s.cssRules)if(e instanceof CSSStyleRule)for(let o=0;o<e.style.length;o++)t.add(e.style[o])}catch{}return[...t].sort()}function Pe(s){let t=s.shadowRoot;return t?t.adoptedStyleSheets.map((o,n)=>({layer:n<Re.length?Re[n]:`layer-${n}`,properties:ts(o)})):[]}var es=1;function D(s){let t=s.getAttribute("data-dui-id");if(t)return`[data-dui-id="${t}"]`;let e=String(es++);return s.setAttribute("data-dui-id",e),`[data-dui-id="${e}"]`}function He(s){if(s.id)return`#${s.id}`;let t=[],e=s;for(;e&&e!==document.body&&e!==document.documentElement;){let o=e.tagName.toLowerCase();if(e.id){t.unshift(`#${CSS.escape(e.id)}`);break}let n=e.parentElement;if(n){let r=n.querySelectorAll(`:scope > ${o}`);if(r.length>1){let i=Array.from(r).indexOf(e)+1;t.unshift(`${o}:nth-of-type(${i})`)}else t.unshift(o)}else{let r=e.getRootNode();if(r instanceof ShadowRoot&&r.host){t.unshift(o),e=r.host;continue}t.unshift(o)}if(e=n,t.length>6)break}return t.join(" > ")}function Kt(){let s=[];function t(e){for(let o of e.querySelectorAll("*"))o.tagName.toLowerCase().startsWith("dui-")&&o.shadowRoot&&s.push(o),o.shadowRoot&&t(o.shadowRoot)}return t(document),s}function os(s){let t=s.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);if(t){let[,e,o,n]=t;return`#${[e,o,n].map(i=>Number(i).toString(16).padStart(2,"0")).join("")}`}if(/^#[0-9a-f]{3,8}$/i.test(s.trim()))return s.trim()}function ss(s){let t=Object.getPrototypeOf(s);for(;t&&t!==HTMLElement.prototype;){if(t.constructor.name&&t.constructor.name!=="")return t.constructor.name;t=Object.getPrototypeOf(t)}return"Unknown"}function ns(s){let e=s.constructor.elementProperties;if(!e)return[];let o=[];for(let[n,r]of e){if(typeof n=="symbol")continue;let i=s[n],a=r.type?.name??typeof i,l=r.reflect??!1,c=r.attribute!==void 0?r.attribute:l?n:!1;o.push({name:n,value:i,type:a,reflect:l,attribute:c})}return o}function rs(s){let t=s.shadowRoot;if(!t)return[];let e=new Set;for(let r of t.adoptedStyleSheets)try{for(let i of r.cssRules)if(i instanceof CSSStyleRule){let l=i.cssText.matchAll(/var\(\s*(--[\w-]+)/g);for(let c of l)e.add(c[1])}}catch{}let o=getComputedStyle(s),n=[];for(let r of[...e].sort()){let i=o.getPropertyValue(r).trim();if(!i)continue;let a={name:r,specified:r,computed:i},l=os(i);l&&(a.hex=l),n.push(a)}return n}function is(s){let t=[],e=new Set;for(let r of s.attributes)if(r.name.startsWith("on")){let i=r.name.slice(2);e.has(i)||(e.add(i),t.push({name:i,source:"attribute"}))}let o=window.getEventListeners;if(typeof o=="function")try{let r=o(s);for(let i of Object.keys(r))e.has(i)||(e.add(i),t.push({name:i,source:"addEventListener"}))}catch{}let n=Object.getPrototypeOf(s);for(;n&&n!==HTMLElement.prototype;){let r=Object.getOwnPropertyDescriptors(n);for(let[,i]of Object.entries(r))if(typeof i.value=="function"){let l=i.value.toString().matchAll(/new\s+CustomEvent\(["']([\w-]+)["']/g);for(let c of l)e.has(c[1])||(e.add(c[1]),t.push({name:c[1],source:"dispatches"}))}n=Object.getPrototypeOf(n)}return t.sort((r,i)=>r.name.localeCompare(i.name))}function as(s){let t=s.shadowRoot;if(!t)return[];let e=t.querySelectorAll("slot");return Array.from(e).map(o=>({name:o.name||"(default)",assignedNodes:o.assignedNodes({flatten:!0}).length}))}function cs(s){let t=s.shadowRoot;if(!t)return[];let e=t.querySelectorAll("[part]"),o=[];for(let n of e){let r=n.getAttribute("part");if(r)for(let i of r.split(/\s+/))o.push({name:i,tagName:n.tagName.toLowerCase()})}return o}function ls(s){let t=s.shadowRoot;if(!t)return"(no shadow root)";let e=t.children.length,o=t.querySelectorAll("slot").length,n=t.querySelectorAll("[part]").length;return`${e} children, ${o} slots, ${n} parts`}function q(s){return{tagName:s.tagName.toLowerCase(),className:ss(s),selector:D(s),path:He(s),events:is(s),properties:ns(s),tokens:rs(s),styleLayers:Pe(s),slots:as(s),parts:cs(s),shadowSummary:ls(s)}}function Ne(){let s=[],t=new Set,e=Kt();for(let n of e)t.add(n.tagName.toLowerCase());let o=["accordion","accordion-item","alert-dialog","alert-dialog-popup","avatar","badge","breadcrumb","breadcrumb-item","breadcrumb-link","breadcrumb-page","breadcrumb-separator","breadcrumb-ellipsis","button","calendar","center","checkbox","checkbox-group","collapsible","combobox","command","command-input","command-item","command-list","command-group","command-empty","command-separator","command-shortcut","data-table","dialog","dialog-popup","dropzone","field","hstack","icon","input","link","menu","menu-item","menubar","number-field","page-inset","popover","popover-popup","portal","preview-card","preview-card-popup","progress","radio","radio-group","scroll-area","select","separator","sidebar","sidebar-content","sidebar-footer","sidebar-group","sidebar-group-label","sidebar-header","sidebar-inset","sidebar-menu","sidebar-menu-button","sidebar-menu-item","sidebar-provider","sidebar-separator","sidebar-trigger","slider","spinner","switch","tab","tabs","tabs-indicator","tabs-list","tabs-panel","textarea","toggle","toggle-group","toolbar","tooltip","tooltip-popup","trunc","vstack"];for(let n of o){let r=`dui-${n}`;customElements.get(r)&&t.add(r)}for(let n of[...t].sort()){let r=customElements.get(n);if(!r)continue;let i={tagName:n,properties:[],slots:[],parts:[]},a=r.elementProperties;if(a)for(let[l,c]of a)typeof l!="symbol"&&i.properties.push({name:l,type:c.type?.name??"unknown",default:void 0,reflect:c.reflect??!1,attribute:c.attribute!==void 0?c.attribute:c.reflect?l:!1});try{let l=document.createElement(n);if(document.createDocumentFragment().appendChild(l),l.shadowRoot){let b=l.shadowRoot.querySelectorAll("slot");i.slots=Array.from(b).map(S=>S.name||"(default)");let d=l.shadowRoot.querySelectorAll("[part]");for(let S of d){let v=S.getAttribute("part");v&&i.parts.push(...v.split(/\s+/))}}}catch{}s.push(i)}return s}function Oe(){let s=Kt();return{timestamp:new Date().toISOString(),themeMode:document.documentElement.dataset.theme??"unknown",componentCount:s.length,components:s.map(q),catalog:Ne()}}function wt(s){let t=document.querySelector(s);return t||Ue(document,s)}function Ue(s,t){for(let e of s.querySelectorAll("*"))if(e.shadowRoot){let o=e.shadowRoot.querySelector(t);if(o)return o;let n=Ue(e.shadowRoot,t);if(n)return n}return null}var Vt=class{#t=[];#o=1;#e=new Set;add(t,e,o,n){let r={id:this.#o++,timestamp:new Date().toISOString(),action:t,target:e,params:o,undoable:!!n,_undo:n};return this.#t.push(r),this.#s(r),r}entries(){return this.#t.map(({_undo:t,...e})=>e)}undo(){for(let t=this.#t.length-1;t>=0;t--){let e=this.#t[t];if(e.undoable&&e._undo)return e._undo(),this.#t.splice(t,1),!0}return!1}get count(){return this.#t.length}clear(){this.#t=[]}subscribe(t){this.#e.add(t)}unsubscribe(t){this.#e.delete(t)}#s(t){let e={...t};delete e._undo;for(let o of this.#e)try{o(e)}catch{}}},y=new Vt;function Q(s){let t=wt(s);return t||{ok:!1,error:`Element not found: "${s}"`,selector:s,inspection:null}}function ze(s){return s.tagName.toLowerCase().startsWith("dui-")?s.shadowRoot?null:`No shadow root on <${s.tagName.toLowerCase()}>`:`Not a DUI component: <${s.tagName.toLowerCase()}>`}function st(s){return{ok:!0,selector:D(s),inspection:q(s)}}function G(s,t){return{ok:!1,error:t,selector:s,inspection:null}}function De(s,t,e){let o=Q(s);if(!(o instanceof HTMLElement))return o;let n=ze(o);if(n)return G(s,n);let i=o.constructor.elementProperties;if(!i||!i.has(t)){let l=i?[...i.keys()].filter(c=>typeof c=="string").join(", "):"none";return G(s,`Unknown property "${t}" on <${o.tagName.toLowerCase()}>. Available: ${l}`)}let a=o[t];return o[t]=e,y.add("setProp",D(o),{prop:t,value:e,oldValue:a},()=>{o[t]=a}),st(o)}function Et(s,t){if(!s.startsWith("--"))return G(":root",`Token name must start with "--": "${s}"`);let e=document.documentElement.style.getPropertyValue(s);return document.documentElement.style.setProperty(s,t),y.add("setToken",s,{value:t,oldValue:e},()=>{e?document.documentElement.style.setProperty(s,e):document.documentElement.style.removeProperty(s)}),{ok:!0,selector:":root",inspection:null}}function Ct(s,t,e){let o=Q(s);if(!(o instanceof HTMLElement))return o;if(!t.startsWith("--"))return G(s,`Token name must start with "--": "${t}"`);let n=o.style.getPropertyValue(t);return o.style.setProperty(t,e),y.add("setComponentToken",D(o),{name:t,value:e,oldValue:n},()=>{n?o.style.setProperty(t,n):o.style.removeProperty(t)}),st(o)}function Ie(s,t,e){let o=Q(s);if(!(o instanceof HTMLElement))return o;let n=ze(o);if(n)return G(s,n);let r=t===""||t==="(default)",i=[];if(r){for(let c of Array.from(o.childNodes))c instanceof HTMLElement&&c.getAttribute("slot")||i.push(c.cloneNode(!0));for(let c of Array.from(o.childNodes))c instanceof HTMLElement&&c.getAttribute("slot")||c.remove()}else for(let c of Array.from(o.children))c.getAttribute("slot")===t&&(i.push(c.cloneNode(!0)),c.remove());let a=document.createElement("template");a.innerHTML=e;let l=Array.from(a.content.childNodes);if(!r)for(let c of l)c instanceof HTMLElement&&c.setAttribute("slot",t);return o.append(...l),y.add("setSlotContent",D(o),{slotName:t,html:e},()=>{if(r)for(let c of Array.from(o.childNodes))c instanceof HTMLElement&&c.getAttribute("slot")||c.remove();else for(let c of Array.from(o.children))c.getAttribute("slot")===t&&c.remove();o.append(...i)}),st(o)}function je(s,t,e,o,n){let r=Q(s);if(!(r instanceof HTMLElement))return r;if(!customElements.get(e))return G(s,`"${e}" is not a registered custom element. Did you register it with applyTheme()?`);let i=document.createElement(e);if(o){let c=i.constructor.elementProperties;for(let[b,d]of Object.entries(o)){if(c&&!c.has(b)){let S=[...c.keys()].filter(v=>typeof v=="string").join(", ");return G(s,`Unknown property "${b}" on <${e}>. Available: ${S}`)}i[b]=d}}n&&(i.innerHTML=n),r.insertAdjacentElement(t,i);let a=D(i);return y.add("insertComponent",a,{parentSelector:s,position:t,tag:e,props:o,slotContent:n},()=>{i.remove()}),st(i)}function qe(s){let t=Q(s);if(!(t instanceof HTMLElement))return t;let e=t.parentElement,o=t.nextSibling,n=t.outerHTML;return t.remove(),y.add("removeComponent",s,{removedHtml:n},()=>{let r=document.createElement("template");r.innerHTML=n;let i=r.content.firstElementChild;i&&e&&e.insertBefore(i,o)}),e&&e.tagName.toLowerCase().startsWith("dui-")?st(e):{ok:!0,selector:e?D(e):s,inspection:null}}function We(s,t,e){let o=Q(s);if(!(o instanceof HTMLElement))return o;let n=Q(t);if(!(n instanceof HTMLElement))return n;let r=o.parentElement,i=o.nextSibling;return n.insertAdjacentElement(e,o),y.add("moveComponent",D(o),{from:s,to:t,position:e},()=>{r&&r.insertBefore(o,i)}),st(o)}var H={};function kt(){let s=y.entries(),t=[];for(let e of s)switch(e.action){case"setToken":{let o=H.tokens??"(unknown tokens file)";t.push({file:o,changeType:"token",description:`Change ${e.target} to ${e.params.value}`,tokenName:e.target,tokenValue:e.params.value});break}case"setComponentToken":{let o=Be(e.target),n=o&&H.themeStyles?.[o]?H.themeStyles[o]:H.page??"(unknown page file)";t.push({file:n,changeType:"token",description:`Set ${e.params.name} = ${e.params.value} on ${e.target}`,tokenName:e.params.name,tokenValue:e.params.value,selector:e.target});break}case"setProp":{let o=H.page??"(unknown page file)";t.push({file:o,changeType:"prop",description:`Set ${e.params.prop} = ${JSON.stringify(e.params.value)} on ${e.target}`,selector:e.target,propName:e.params.prop,propValue:e.params.value});break}case"insertComponent":{let o=H.page??"(unknown page file)",n=e.params.tag,r=e.params.props,i=e.params.slotContent,a=`<${n}`;if(r)for(let[l,c]of Object.entries(r))typeof c=="boolean"&&c?a+=` ${l}`:typeof c=="string"?a+=` ${l}="${c}"`:a+=` .${l}=\${${JSON.stringify(c)}}`;i?a+=`>${i}</${n}>`:a+=`></${n}>`,t.push({file:o,changeType:"template",description:`Insert <${n}> ${e.params.position} ${e.params.parentSelector}`,html:a,selector:e.params.parentSelector});break}case"removeComponent":{let o=H.page??"(unknown page file)";t.push({file:o,changeType:"template",description:`Remove element at ${e.target}`,selector:e.target});break}case"moveComponent":{let o=H.page??"(unknown page file)";t.push({file:o,changeType:"template",description:`Move ${e.target} to ${e.params.position} ${e.params.to}`,selector:e.target});break}case"setSlotContent":{let o=H.page??"(unknown page file)";t.push({file:o,changeType:"template",description:`Replace slot "${e.params.slotName}" content on ${e.target}`,html:e.params.html,selector:e.target});break}case"editThemeCSS":{let o=Be(e.target),n=o&&H.themeStyles?.[o]?H.themeStyles[o]:"(unknown theme style file)";t.push({file:n,changeType:"theme-style",description:`Edit theme CSS for ${e.target}`,selector:e.target});break}}return t}function Be(s){let t=s.match(/\b(dui-[\w-]+)/);return t?t[1]:null}window.__dui_inspect=s=>{if(s){let t=wt(s);return t?t.shadowRoot?q(t):{error:`No shadow root on: "${s}"`}:{error:`Element not found: "${s}"`}}return Oe()};window.__dui_mutate={setProp:De,setToken:Et,setComponentToken:Ct,setSlotContent:Ie,insertComponent:je,removeComponent:qe,moveComponent:We};window.__dui_changelog={entries:()=>y.entries(),undo:()=>y.undo(),clear:()=>y.clear(),count:()=>y.count};window.__dui_export=()=>kt();window.__dui_observe=s=>(y.subscribe(s),()=>y.unsubscribe(s));var At=globalThis,Tt=At.ShadowRoot&&(At.ShadyCSS===void 0||At.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ft=Symbol(),Ke=new WeakMap,lt=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==Ft)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Tt&&t===void 0){let o=e!==void 0&&e.length===1;o&&(t=Ke.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&Ke.set(e,t))}return t}toString(){return this.cssText}},Ve=s=>new lt(typeof s=="string"?s:s+"",void 0,Ft),N=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((o,n,r)=>o+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+s[r+1],s[0]);return new lt(e,s,Ft)},Fe=(s,t)=>{if(Tt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let o=document.createElement("style"),n=At.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o)}},Jt=Tt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let o of t.cssRules)e+=o.cssText;return Ve(e)})(s):s;var{is:ps,defineProperty:ds,getOwnPropertyDescriptor:us,getOwnPropertyNames:hs,getOwnPropertySymbols:ms,getPrototypeOf:fs}=Object,Mt=globalThis,Je=Mt.trustedTypes,gs=Je?Je.emptyScript:"",bs=Mt.reactiveElementPolyfillSupport,pt=(s,t)=>s,dt={toAttribute(s,t){switch(t){case Boolean:s=s?gs:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Lt=(s,t)=>!ps(s,t),Qe={attribute:!0,type:String,converter:dt,reflect:!1,useDefault:!1,hasChanged:Lt};Symbol.metadata??=Symbol("metadata"),Mt.litPropertyMetadata??=new WeakMap;var W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Qe){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let o=Symbol(),n=this.getPropertyDescriptor(t,o,e);n!==void 0&&ds(this.prototype,t,n)}}static getPropertyDescriptor(t,e,o){let{get:n,set:r}=us(this.prototype,t)??{get(){return this[e]},set(i){this[e]=i}};return{get:n,set(i){let a=n?.call(this);r?.call(this,i),this.requestUpdate(t,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Qe}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;let t=fs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){let e=this.properties,o=[...hs(e),...ms(e)];for(let n of o)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[o,n]of e)this.elementProperties.set(o,n)}this._$Eh=new Map;for(let[e,o]of this.elementProperties){let n=this._$Eu(e,o);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let n of o)e.unshift(Jt(n))}else t!==void 0&&e.push(Jt(t));return e}static _$Eu(t,e){let o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Fe(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){let o=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,o);if(n!==void 0&&o.reflect===!0){let r=(o.converter?.toAttribute!==void 0?o.converter:dt).toAttribute(e,o.type);this._$Em=t,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){let o=this.constructor,n=o._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let r=o.getPropertyOptions(n),i=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:dt;this._$Em=n;let a=i.fromAttribute(e,r.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(t,e,o,n=!1,r){if(t!==void 0){let i=this.constructor;if(n===!1&&(r=this[t]),o??=i.getPropertyOptions(t),!((o.hasChanged??Lt)(r,e)||o.useDefault&&o.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,o))))return;this.C(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:n,wrapped:r},i){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,i??e??this[t]),r!==!0||i!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,r]of o){let{wrapped:i}=r,a=this[n];i!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,r,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[pt("elementProperties")]=new Map,W[pt("finalized")]=new Map,bs?.({ReactiveElement:W}),(Mt.reactiveElementVersions??=[]).push("2.1.2");var ee=globalThis,Ge=s=>s,Rt=ee.trustedTypes,Ye=Rt?Rt.createPolicy("lit-html",{createHTML:s=>s}):void 0,so="$lit$",J=`lit$${Math.random().toFixed(9).slice(2)}$`,no="?"+J,ys=`<${no}>`,X=document,ht=()=>X.createComment(""),mt=s=>s===null||typeof s!="object"&&typeof s!="function",oe=Array.isArray,vs=s=>oe(s)||typeof s?.[Symbol.iterator]=="function",Qt=`[ 	
\f\r]`,ut=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ze=/-->/g,Xe=/>/g,Y=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),to=/'/g,eo=/"/g,ro=/^(?:script|style|textarea|title)$/i,se=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=se(1),tn=se(2),en=se(3),tt=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),oo=new WeakMap,Z=X.createTreeWalker(X,129);function io(s,t){if(!oe(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ye!==void 0?Ye.createHTML(t):t}var xs=(s,t)=>{let e=s.length-1,o=[],n,r=t===2?"<svg>":t===3?"<math>":"",i=ut;for(let a=0;a<e;a++){let l=s[a],c,b,d=-1,S=0;for(;S<l.length&&(i.lastIndex=S,b=i.exec(l),b!==null);)S=i.lastIndex,i===ut?b[1]==="!--"?i=Ze:b[1]!==void 0?i=Xe:b[2]!==void 0?(ro.test(b[2])&&(n=RegExp("</"+b[2],"g")),i=Y):b[3]!==void 0&&(i=Y):i===Y?b[0]===">"?(i=n??ut,d=-1):b[1]===void 0?d=-2:(d=i.lastIndex-b[2].length,c=b[1],i=b[3]===void 0?Y:b[3]==='"'?eo:to):i===eo||i===to?i=Y:i===Ze||i===Xe?i=ut:(i=Y,n=void 0);let v=i===Y&&s[a+1].startsWith("/>")?" ":"";r+=i===ut?l+ys:d>=0?(o.push(c),l.slice(0,d)+so+l.slice(d)+J+v):l+J+(d===-2?a:v)}return[io(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},ft=class s{constructor({strings:t,_$litType$:e},o){let n;this.parts=[];let r=0,i=0,a=t.length-1,l=this.parts,[c,b]=xs(t,e);if(this.el=s.createElement(c,o),Z.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=Z.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(let d of n.getAttributeNames())if(d.endsWith(so)){let S=b[i++],v=n.getAttribute(d).split(J),F=/([.?@])?(.*)/.exec(S);l.push({type:1,index:r,name:F[2],strings:v,ctor:F[1]==="."?Yt:F[1]==="?"?Zt:F[1]==="@"?Xt:rt}),n.removeAttribute(d)}else d.startsWith(J)&&(l.push({type:6,index:r}),n.removeAttribute(d));if(ro.test(n.tagName)){let d=n.textContent.split(J),S=d.length-1;if(S>0){n.textContent=Rt?Rt.emptyScript:"";for(let v=0;v<S;v++)n.append(d[v],ht()),Z.nextNode(),l.push({type:2,index:++r});n.append(d[S],ht())}}}else if(n.nodeType===8)if(n.data===no)l.push({type:2,index:r});else{let d=-1;for(;(d=n.data.indexOf(J,d+1))!==-1;)l.push({type:7,index:r}),d+=J.length-1}r++}}static createElement(t,e){let o=X.createElement("template");return o.innerHTML=t,o}};function nt(s,t,e=s,o){if(t===tt)return t;let n=o!==void 0?e._$Co?.[o]:e._$Cl,r=mt(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(s),n._$AT(s,e,o)),o!==void 0?(e._$Co??=[])[o]=n:e._$Cl=n),n!==void 0&&(t=nt(s,n._$AS(s,t.values),n,o)),t}var Gt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:o}=this._$AD,n=(t?.creationScope??X).importNode(e,!0);Z.currentNode=n;let r=Z.nextNode(),i=0,a=0,l=o[0];for(;l!==void 0;){if(i===l.index){let c;l.type===2?c=new gt(r,r.nextSibling,this,t):l.type===1?c=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(c=new te(r,this,t)),this._$AV.push(c),l=o[++a]}i!==l?.index&&(r=Z.nextNode(),i++)}return Z.currentNode=X,n}p(t){let e=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},gt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,n){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),mt(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(X.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:o}=t,n=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=ft.createElement(io(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===n)this._$AH.p(e);else{let r=new Gt(n,this),i=r.u(this.options);r.p(e),this.T(i),this._$AH=r}}_$AC(t){let e=oo.get(t.strings);return e===void 0&&oo.set(t.strings,e=new ft(t)),e}k(t){oe(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,o,n=0;for(let r of t)n===e.length?e.push(o=new s(this.O(ht()),this.O(ht()),this,this.options)):o=e[n],o._$AI(r),n++;n<e.length&&(this._$AR(o&&o._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let o=Ge(t).nextSibling;Ge(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},rt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,n,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=m}_$AI(t,e=this,o,n){let r=this.strings,i=!1;if(r===void 0)t=nt(this,t,e,0),i=!mt(t)||t!==this._$AH&&t!==tt,i&&(this._$AH=t);else{let a=t,l,c;for(t=r[0],l=0;l<r.length-1;l++)c=nt(this,a[o+l],e,l),c===tt&&(c=this._$AH[l]),i||=!mt(c)||c!==this._$AH[l],c===m?t=m:t!==m&&(t+=(c??"")+r[l+1]),this._$AH[l]=c}i&&!n&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Yt=class extends rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},Zt=class extends rt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},Xt=class extends rt{constructor(t,e,o,n,r){super(t,e,o,n,r),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??m)===tt)return;let o=this._$AH,n=t===m&&o!==m||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==m&&(o===m||n);n&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},te=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}};var $s=ee.litHtmlPolyfillSupport;$s?.(ft,gt),(ee.litHtmlVersions??=[]).push("3.3.2");var ao=(s,t,e)=>{let o=e?.renderBefore??t,n=o._$litPart$;if(n===void 0){let r=e?.renderBefore??null;o._$litPart$=n=new gt(t.insertBefore(ht(),r),r,void 0,e??{})}return n._$AI(s),n};var ne=globalThis,E=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ao(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return tt}};E._$litElement$=!0,E.finalized=!0,ne.litElementHydrateSupport?.({LitElement:E});var _s=ne.litElementPolyfillSupport;_s?.({LitElement:E});(ne.litElementVersions??=[]).push("4.2.2");var I=s=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(s,t)}):customElements.define(s,t)};var Ss={attribute:!0,type:String,converter:dt,reflect:!1,hasChanged:Lt},ws=(s=Ss,t,e)=>{let{kind:o,metadata:n}=e,r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),o==="setter"&&((s=Object.create(s)).wrapped=!0),r.set(e.name,s),o==="accessor"){let{name:i}=e;return{set(a){let l=t.get.call(this);t.set.call(this,a),this.requestUpdate(i,l,s,!0,a)},init(a){return a!==void 0&&this.C(i,void 0,s,a),a}}}if(o==="setter"){let{name:i}=e;return function(a){let l=this[i];t.call(this,a),this.requestUpdate(i,l,s,!0,a)}}throw Error("Unsupported decorator location: "+o)};function A(s){return(t,e)=>typeof e=="object"?ws(s,t,e):((o,n,r)=>{let i=n.hasOwnProperty(r);return n.constructor.createProperty(r,o),i?Object.getOwnPropertyDescriptor(n,r):void 0})(s,t,e)}function w(s){return A({...s,state:!0,attribute:!1})}var co,lo,po,uo,ho,T,re,ie,ae;ho=[I("dui-inspector-overlay")];var B=class extends(uo=E,po=[A({type:Boolean,reflect:!0})],lo=[w()],co=[w()],uo){constructor(){super(...arguments);h(this,re,u(T,8,this,!1)),u(T,11,this);h(this,ie,u(T,12,this,null)),u(T,15,this);h(this,ae,u(T,16,this,"")),u(T,19,this)}highlight(e){this._rect=e.getBoundingClientRect(),this._tagName=e.tagName.toLowerCase(),this.visible=!0}hide(){this.visible=!1,this._rect=null}render(){if(!this._rect)return p`${m}`;let{top:e,left:o,width:n,height:r}=this._rect;return p`
      <div
        class="border"
        style="top:${e}px;left:${o}px;width:${n}px;height:${r}px"
      >
        <span class="label">${this._tagName}</span>
      </div>
    `}};T=U(uo),re=new WeakMap,ie=new WeakMap,ae=new WeakMap,f(T,4,"visible",po,B,re),f(T,4,"_rect",lo,B,ie),f(T,4,"_tagName",co,B,ae),B=f(T,0,"InspectorOverlayElement",ho,B),z(B,"styles",N`
    :host {
      position: fixed;
      pointer-events: none;
      z-index: 99998;
      display: none;
    }

    :host([visible]) {
      display: block;
    }

    .border {
      position: fixed;
      border: 2px solid oklch(0.65 0.2 250);
      border-radius: 4px;
      background: oklch(0.65 0.2 250 / 0.08);
    }

    .label {
      position: absolute;
      top: -22px;
      left: -2px;
      background: oklch(0.65 0.2 250);
      color: white;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 3px 3px 0 0;
      white-space: nowrap;
      line-height: 16px;
    }
  `),u(T,1,B);var mo,fo,go,it,ce,Ht,bo;go=[I("dui-inspector-panel")];var et=class extends(fo=E,mo=[A({attribute:!1})],fo){constructor(){super(...arguments);h(this,Ht);h(this,ce,u(it,8,this,null)),u(it,11,this)}render(){if(!this.data)return p`${m}`;let e=this.data;return p`
      <div class="body">
        <!-- Path & Selector -->
        <div class="selector-row">
          Path: <code>${e.path}</code>
        </div>
        <div class="selector-row">
          Selector: <code>${e.selector}</code>
        </div>

        <!-- Properties -->
        <details open>
          <summary>Properties <span class="count">${e.properties.length}</span></summary>
          ${e.properties.length?p`<div class="section-content">
                ${e.properties.map(o=>p`
                    <div class="row">
                      <span class="row-name">${o.name}</span>
                      <span class="row-value">${x(this,Ht,bo).call(this,o.value)}</span>
                      <span class="row-type">${o.type}</span>
                    </div>
                  `)}
              </div>`:p`<div class="empty">No properties</div>`}
        </details>

        <!-- CSS Parts -->
        <details open>
          <summary>CSS Parts <span class="count">${e.parts.length}</span></summary>
          ${e.parts.length?p`<div class="section-content">
                ${e.parts.map(o=>p`
                    <div class="row">
                      <span class="row-name">::part(${o.name})</span>
                      <span class="row-meta">&lt;${o.tagName}&gt;</span>
                    </div>
                  `)}
              </div>`:p`<div class="empty">No parts</div>`}
        </details>

        <!-- Slots -->
        <details>
          <summary>Slots <span class="count">${e.slots.length}</span></summary>
          ${e.slots.length?p`<div class="section-content">
                ${e.slots.map(o=>p`
                    <div class="row">
                      <span class="row-name">${o.name}</span>
                      <span class="row-meta">${o.assignedNodes} nodes</span>
                    </div>
                  `)}
              </div>`:p`<div class="empty">No slots</div>`}
        </details>

        <!-- Shadow Summary -->
        <div class="shadow-summary">${e.shadowSummary}</div>
      </div>
    `}};it=U(fo),ce=new WeakMap,Ht=new WeakSet,bo=function(e){return e===void 0?"undefined":e===null?"null":typeof e=="string"?`"${e}"`:String(e)},f(it,4,"data",mo,et,ce),et=f(it,0,"InspectorPanelElement",go,et),z(et,"styles",N`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    /* Sections */
    details {
      border-bottom: 1px solid #313244;
    }

    summary {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #a6adc8;
      list-style: none;
      user-select: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary::before {
      content: "▸";
      margin-right: 6px;
      font-size: 10px;
      transition: transform 0.15s ease;
    }

    details[open] > summary::before {
      transform: rotate(90deg);
    }

    summary .count {
      margin-left: auto;
      color: #585b70;
      font-weight: 400;
    }

    .section-content {
      padding: 4px 14px 10px;
    }

    /* Table rows */
    .row {
      display: flex;
      padding: 3px 0;
      gap: 8px;
      align-items: baseline;
    }

    .row-name {
      color: #cba6f7;
      flex-shrink: 0;
      min-width: 0;
    }

    .row-value {
      color: #a6e3a1;
      word-break: break-all;
      min-width: 0;
    }

    .row-type {
      color: #585b70;
      font-size: 10px;
      margin-left: auto;
      flex-shrink: 0;
    }

    .row-meta {
      color: #585b70;
      font-size: 10px;
      flex-shrink: 0;
    }

    .empty {
      color: #585b70;
      font-style: italic;
      padding: 4px 14px 10px;
    }

    .shadow-summary {
      padding: 4px 14px 10px;
      color: #6c7086;
    }

    .selector-row {
      padding: 4px 14px 8px;
      color: #585b70;
      font-size: 11px;
      border-bottom: 1px solid #313244;
      word-break: break-all;
    }

    .selector-row code {
      color: #89b4fa;
    }

    /* Event source badge */
    .event-source {
      font-size: 9px;
      color: #585b70;
      background: #313244;
      padding: 1px 4px;
      border-radius: 2px;
      flex-shrink: 0;
    }
  `),u(it,1,et);var yo,vo,xo,$o,_o,M,le,pe,de,j,So,wo,Nt;_o=[I("dui-inspector-token-editor")];var K=class extends($o=E,xo=[A({attribute:!1})],vo=[A({type:String})],yo=[w()],$o){constructor(){super(...arguments);h(this,j);h(this,le,u(M,8,this,null)),u(M,11,this);h(this,pe,u(M,12,this,"")),u(M,15,this);h(this,de,u(M,16,this,"global")),u(M,19,this)}render(){if(!this.data)return p`<div class="empty">Select a component</div>`;let e=this.data.tokens;if(e.length===0)return p`<div class="empty">No tokens</div>`;let o=e.filter(r=>r.hex),n=e.filter(r=>!r.hex);return p`
      <div class="scope-toggle">
        <button
          class="scope-btn"
          ?data-active=${this._scope==="global"}
          @click=${()=>this._scope="global"}
        >Global</button>
        <button
          class="scope-btn"
          ?data-active=${this._scope==="instance"}
          @click=${()=>this._scope="instance"}
        >This instance</button>
      </div>

      <div class="body">
        ${o.length>0?p`
              <div class="section-label">Colors</div>
              ${o.map(r=>x(this,j,So).call(this,r))}
            `:m}

        ${n.length>0?p`
              <div class="section-label">Other</div>
              ${n.map(r=>x(this,j,wo).call(this,r))}
            `:m}
      </div>
    `}};M=U($o),le=new WeakMap,pe=new WeakMap,de=new WeakMap,j=new WeakSet,So=function(e){return p`
      <div class="token-row">
        <span class="swatch" style="background:${e.hex}"></span>
        <span class="token-name">${e.name}</span>
        <input
          type="color"
          class="color-input"
          .value=${e.hex??"#000000"}
          @change=${o=>x(this,j,Nt).call(this,e.name,o.target.value)}
        />
        <input
          type="text"
          class="token-input"
          .value=${e.computed}
          @change=${o=>x(this,j,Nt).call(this,e.name,o.target.value)}
        />
      </div>
    `},wo=function(e){return p`
      <div class="token-row">
        <span class="token-name">${e.name}</span>
        <input
          type="text"
          class="token-input"
          .value=${e.computed}
          @change=${o=>x(this,j,Nt).call(this,e.name,o.target.value)}
        />
      </div>
    `},Nt=function(e,o){this._scope==="global"?Et(e,o):Ct(this.selector,e,o),this.dispatchEvent(new CustomEvent("token-changed",{bubbles:!0,composed:!0}))},f(M,4,"data",xo,K,le),f(M,4,"selector",vo,K,pe),f(M,4,"_scope",yo,K,de),K=f(M,0,"TokenEditorPanelElement",_o,K),z(K,"styles",N`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .scope-toggle {
      display: flex;
      padding: 8px 14px;
      gap: 8px;
      border-bottom: 1px solid #313244;
    }

    .scope-btn {
      background: none;
      border: 1px solid #45475a;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .scope-btn[data-active] {
      background: oklch(0.65 0.2 250);
      border-color: oklch(0.65 0.2 250);
      color: white;
    }

    .token-row {
      display: flex;
      align-items: center;
      padding: 6px 14px;
      gap: 8px;
      border-bottom: 1px solid #313244 / 0.5;
    }

    .token-row:hover {
      background: #181825;
    }

    .token-name {
      color: #cba6f7;
      font-size: 11px;
      flex: 1;
      min-width: 0;
      word-break: break-all;
    }

    .token-input {
      background: #181825;
      border: 1px solid #45475a;
      color: #cdd6f4;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 3px;
      width: 120px;
      flex-shrink: 0;
    }

    .token-input:focus {
      outline: none;
      border-color: oklch(0.65 0.2 250);
    }

    .color-input {
      width: 24px;
      height: 24px;
      padding: 0;
      border: 1px solid #45475a;
      border-radius: 3px;
      cursor: pointer;
      flex-shrink: 0;
      background: none;
    }

    .color-input::-webkit-color-swatch-wrapper {
      padding: 2px;
    }

    .color-input::-webkit-color-swatch {
      border: none;
      border-radius: 2px;
    }

    .swatch {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 2px;
      border: 1px solid #45475a;
      flex-shrink: 0;
    }

    .empty {
      color: #585b70;
      font-style: italic;
      padding: 12px 14px;
    }

    .section-label {
      padding: 8px 14px 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #585b70;
      border-bottom: 1px solid #313244;
    }
  `),u(M,1,K);function Ho(s){let t=[],e=s.split(/(?<=\})\s*/);for(let o of e){let n=o.trim();if(!n)continue;let r=n.match(/^([^{]+)\{([^}]*)\}$/s);if(r){let i=r[1].trim(),a=r[2].trim();t.push(`${i} {`);let l=a.split(";").filter(c=>c.trim());for(let c of l)t.push(`  ${c.trim()};`);t.push("}"),t.push("")}else t.push(n)}return t.join(`
`).trim()}function Eo(s){let e=Ho(s).split(`
`),o=[];for(let n of e)o.push(p`<div class="code-line">${Es(n)}</div>`);return o}function Es(s){let t=s.trim();if(!t)return p`<br>`;if(t==="}")return p`<span class="hl-brace">${s}</span>`;if(t.endsWith("{")){let o=s.match(/^\s*/)?.[0]??"",n=t.slice(0,-1).trim();return p`${o}<span class="hl-selector">${n}</span> <span class="hl-brace">{</span>`}let e=t.match(/^([\w-]+)\s*:\s*(.+)$/);if(e){let o=s.match(/^\s*/)?.[0]??"",n=e[1],r=e[2],i=r.endsWith(";");i&&(r=r.slice(0,-1));let a=n.startsWith("--"),l=Cs(r);return p`${o}<span class="${a?"hl-custom-prop":"hl-property"}">${n}</span><span class="hl-punctuation">: </span>${l}${i?p`<span class="hl-punctuation">;</span>`:m}`}return p`${s}`}function Cs(s){let t=[],e=s;for(;e;){let o=e.indexOf("var(");if(o===-1){t.push(p`<span class="hl-value">${e}</span>`);break}o>0&&t.push(p`<span class="hl-value">${e.slice(0,o)}</span>`);let n=0,r=o+4;for(;r<e.length;r++)if(e[r]==="("&&n++,e[r]===")"){if(n===0){r++;break}n--}let i=e.slice(o,r);t.push(p`<span class="hl-var">${i}</span>`),e=e.slice(r)}return p`${t}`}var Co,ko,Ao,To,Mo,Lo,Ro,Po,$,ue,he,me,fe,ge,be,bt,O,ye,No,Oo,Uo;Po=[I("dui-inspector-style-editor")];var L=class extends(Ro=E,Lo=[A({attribute:!1})],Mo=[A({attribute:!1})],To=[w()],Ao=[w()],ko=[w()],Co=[w()],Ro){constructor(){super(...arguments);h(this,O);h(this,ue,u($,8,this,null)),u($,11,this);h(this,he,u($,12,this,null)),u($,15,this);h(this,me,u($,16,this,"")),u($,19,this);h(this,fe,u($,20,this,!1)),u($,23,this);h(this,ge,u($,24,this,"")),u($,27,this);h(this,be,u($,28,this,null)),u($,31,this);h(this,bt,e=>{if(e.key==="Tab"){e.preventDefault();let o=e.target,n=o.selectionStart,r=o.selectionEnd;o.value=o.value.substring(0,n)+"  "+o.value.substring(r),o.selectionStart=o.selectionEnd=n+2}})}render(){if(!this.data||!this.targetElement)return p`<div class="empty">Select a component</div>`;let e=this.data.styleLayers;return p`
      <div class="body">
        ${e.map((o,n)=>{let r=o.layer==="theme-component",i=r,a=x(this,O,ye).call(this,n);return p`
            <details class="layer" ?open=${i}>
              <summary>
                ${o.layer}
                ${r?p`<span class="editable-badge">editable</span>`:p`<span class="readonly-badge">read-only</span>`}
              </summary>
              ${this._editingLayer===n?p`<textarea
                    class="css-editor"
                    .value=${Ho(a)}
                    @change=${l=>x(this,O,No).call(this,n,l.target.value)}
                    @blur=${()=>{this._editingLayer=null}}
                    @keydown=${g(this,bt)}
                    spellcheck="false"
                  ></textarea>`:a?p`<div
                      class="code-block ${r?"editable-code resizable":""}"
                      @dblclick=${r?()=>{this._editingLayer=n}:m}
                    >${Eo(a)}${r?p`<button class="edit-btn" @click=${()=>{this._editingLayer=n}}>Edit</button>`:m}</div>`:r?p`<div class="code-block editable-code resizable" @dblclick=${()=>{this._editingLayer=n}}><span class="code-empty">(empty)</span><button class="edit-btn" @click=${()=>{this._editingLayer=n}}>Edit</button></div>`:p`<div class="code-block"><span class="code-empty">(empty)</span></div>`}
            </details>
          `})}

        <!-- User overrides layer -->
        <details class="layer" open>
          <summary>
            user overrides
            <span class="editable-badge">editable</span>
          </summary>
          ${this._hasUserOverride&&this._editingLayer==="user"?p`<textarea
                class="css-editor"
                .value=${this._userOverrideCSS}
                @change=${o=>x(this,O,Uo).call(this,o.target.value)}
                @blur=${()=>{this._editingLayer=null}}
                @keydown=${g(this,bt)}
                spellcheck="false"
              ></textarea>`:this._hasUserOverride?p`<div class="code-block editable-code" @dblclick=${()=>{this._editingLayer="user"}}>
                ${this._userOverrideCSS.trim()?Eo(this._userOverrideCSS):p`<span class="code-empty">(empty)</span>`}
                <button class="edit-btn" @click=${()=>{this._editingLayer="user"}}>Edit</button>
              </div>`:p`<button class="add-override-btn" @click=${x(this,O,Oo)}>
                + Add custom CSS override
              </button>`}
        </details>

        ${this._errorMessage?p`<div class="error-msg">${this._errorMessage}</div>`:m}
      </div>
    `}};$=U(Ro),ue=new WeakMap,he=new WeakMap,me=new WeakMap,fe=new WeakMap,ge=new WeakMap,be=new WeakMap,bt=new WeakMap,O=new WeakSet,ye=function(e){let o=this.targetElement?.shadowRoot;if(!o)return"";let n=o.adoptedStyleSheets[e];if(!n)return"";try{return Array.from(n.cssRules).map(r=>r.cssText).join(`
`)}catch{return"(cross-origin \u2014 cannot read)"}},No=function(e,o){let n=this.targetElement?.shadowRoot;if(!n)return;let r=n.adoptedStyleSheets[e],i=x(this,O,ye).call(this,e);try{let a=new CSSStyleSheet;a.replaceSync(o);let l=[...n.adoptedStyleSheets];l[e]=a,n.adoptedStyleSheets=l,this._errorMessage="",y.add("editThemeCSS",this.data?.selector??"",{layerIndex:e,oldCSS:i,newCSS:o},()=>{let c=[...n.adoptedStyleSheets];c[e]=r,n.adoptedStyleSheets=c}),this.dispatchEvent(new CustomEvent("style-changed",{bubbles:!0,composed:!0}))}catch(a){this._errorMessage=`CSS parse error: ${a.message}`}},Oo=function(){this._hasUserOverride=!0,this._userOverrideCSS=`:host {
  
}`},Uo=function(e){let o=this.targetElement?.shadowRoot;if(o){this._userOverrideCSS=e;try{let n=new CSSStyleSheet;n.replaceSync(e);let r=this.data?.styleLayers.length??0,i=[...o.adoptedStyleSheets];i.length>r?i[i.length-1]=n:i.push(n),o.adoptedStyleSheets=i,this._errorMessage="",y.add("editUserOverride",this.data?.selector??"",{css:e}),this.dispatchEvent(new CustomEvent("style-changed",{bubbles:!0,composed:!0}))}catch(n){this._errorMessage=`CSS parse error: ${n.message}`}}},f($,4,"data",Lo,L,ue),f($,4,"targetElement",Mo,L,he),f($,4,"_userOverrideCSS",To,L,me),f($,4,"_hasUserOverride",Ao,L,fe),f($,4,"_errorMessage",ko,L,ge),f($,4,"_editingLayer",Co,L,be),L=f($,0,"StyleEditorPanelElement",Po,L),z(L,"styles",N`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    /* Collapsible layer sections */
    details.layer {
      border-bottom: 1px solid #313244;
    }

    details.layer > summary {
      display: flex;
      align-items: center;
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #a6adc8;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      list-style: none;
    }

    details.layer > summary::-webkit-details-marker {
      display: none;
    }

    details.layer > summary::before {
      content: "▸";
      font-size: 10px;
      margin-right: 4px;
      transition: transform 0.15s ease;
      flex-shrink: 0;
    }

    details.layer[open] > summary::before {
      transform: rotate(90deg);
    }

    details.layer > summary .editable-badge {
      font-size: 9px;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
      color: #a6e3a1;
      background: oklch(0.4 0.1 140 / 0.2);
      padding: 1px 5px;
      border-radius: 3px;
    }

    details.layer > summary .readonly-badge {
      font-size: 9px;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
      color: #585b70;
      padding: 1px 5px;
    }

    /* Syntax-highlighted code block */
    .code-block {
      background: #11111b;
      font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
      font-size: 11px;
      line-height: 1.6;
      padding: 8px 14px;
      border-top: 1px solid #313244;
      overflow-x: auto;
      max-height: 200px;
      overflow-y: auto;
    }

    .code-block.resizable {
      resize: vertical;
      max-height: none;
      height: 600px;
    }

    .code-line {
      white-space: pre;
    }

    /* Syntax highlighting colors (Catppuccin Mocha) */
    .hl-selector {
      color: #89b4fa; /* blue */
    }

    .hl-property {
      color: #89dceb; /* sky */
    }

    .hl-custom-prop {
      color: #cba6f7; /* mauve */
    }

    .hl-value {
      color: #a6e3a1; /* green */
    }

    .hl-var {
      color: #f9e2af; /* yellow */
    }

    .hl-punctuation {
      color: #6c7086; /* overlay0 */
    }

    .hl-brace {
      color: #6c7086; /* overlay0 */
    }

    .code-empty {
      color: #585b70;
      font-style: italic;
    }

    .editable-code {
      position: relative;
      cursor: text;
    }

    .editable-code:hover {
      background: #181825;
    }

    .edit-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      background: #313244;
      border: none;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 3px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.1s ease;
    }

    .editable-code:hover .edit-btn {
      opacity: 1;
    }

    .edit-btn:hover {
      background: oklch(0.65 0.2 250);
      color: white;
    }

    /* Editable textarea */
    .css-editor {
      background: #11111b;
      color: #cdd6f4;
      font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
      font-size: 11px;
      line-height: 1.6;
      padding: 8px 14px;
      border: none;
      border-top: 1px solid #313244;
      width: 100%;
      min-height: 100px;
      resize: vertical;
      box-sizing: border-box;
      tab-size: 2;
    }

    .css-editor:focus {
      outline: none;
      background: #181825;
    }

    .empty {
      color: #585b70;
      font-style: italic;
      padding: 12px 14px;
    }

    .add-override-btn {
      display: block;
      margin: 8px 14px;
      background: none;
      border: 1px dashed #45475a;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      width: calc(100% - 28px);
      text-align: center;
    }

    .add-override-btn:hover {
      border-color: oklch(0.65 0.2 250);
      color: oklch(0.65 0.2 250);
    }

    .error-msg {
      color: #f38ba8;
      font-size: 10px;
      padding: 4px 14px;
    }
  `),u($,1,L);function ve(s){for(;s;){if(s instanceof HTMLElement&&s.tagName.toLowerCase().startsWith("dui-")&&!s.tagName.toLowerCase().startsWith("dui-inspector")&&s.shadowRoot)return s;if(s.parentElement)s=s.parentElement;else if(s.getRootNode().host)s=s.getRootNode().host;else break}return null}var zo,Do,Io,jo,qo,Wo,Bo,Ko,_,xe,$e,_e,Se,we,Ee,V,yt,vt,C,Vo,Ot,xt,$t,_t,zt,Ut,at,Dt,It,Fo;Ko=[I("dui-inspector")];var R=class extends(Bo=E,Wo=[w()],qo=[w()],jo=[w()],Io=[w()],Do=[w()],zo=[w()],Bo){constructor(){super(...arguments);h(this,C);h(this,xe,u(_,8,this,!1)),u(_,11,this);h(this,$e,u(_,12,this,null)),u(_,15,this);h(this,_e,u(_,16,this,null)),u(_,19,this);h(this,Se,u(_,20,this,"inspect")),u(_,23,this);h(this,we,u(_,24,this,0)),u(_,27,this);h(this,Ee,u(_,28,this,!1)),u(_,31,this);h(this,V,null);h(this,yt,()=>{this._changeCount=y.count});h(this,vt,e=>{if(e.shiftKey&&e.ctrlKey&&!e.metaKey&&e.key==="I"){e.preventDefault(),this._active?x(this,C,Ot).call(this):x(this,C,Vo).call(this);return}e.key==="Escape"&&this._active&&(e.preventDefault(),this._inspectionData?(this._inspectionData=null,this._selectedElement=null):x(this,C,Ot).call(this))});h(this,xt,e=>{let o=e.composedPath()[0],n=ve(o);n&&n!==this._selectedElement?g(this,V)?.highlight(n):n||g(this,V)?.hide()});h(this,$t,e=>{let o=e.composedPath()[0],n=ve(o);n&&(e.preventDefault(),e.stopPropagation(),this._selectedElement=n,this._inspectionData=q(n),g(this,V)?.highlight(n))});h(this,_t,e=>{let o=e.composedPath()[0],n=ve(o);n&&(this._selectedElement=n,this._inspectionData=q(n),g(this,V)?.highlight(n))});h(this,zt,()=>{this._inspectionData=null,this._selectedElement=null});h(this,at,()=>{this._selectedElement&&(this._inspectionData=q(this._selectedElement))});h(this,Dt,()=>{y.undo(),this._changeCount=y.count,g(this,at).call(this)});h(this,It,async()=>{let e=kt(),o=JSON.stringify(e,null,2);try{await navigator.clipboard.writeText(o),this._showCopiedToast=!0,setTimeout(()=>{this._showCopiedToast=!1},2e3)}catch(n){console.error("Failed to copy to clipboard:",n)}})}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",g(this,vt)),y.subscribe(g(this,yt))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",g(this,vt)),y.unsubscribe(g(this,yt)),x(this,C,Ot).call(this)}firstUpdated(){St(this,V,this.renderRoot.querySelector("dui-inspector-overlay"))}render(){return p`
      <dui-inspector-overlay></dui-inspector-overlay>

      ${this._inspectionData?x(this,C,Fo).call(this):m}

      ${this._active&&!this._inspectionData?p`<div class="activation-badge">Inspector Active — click a DUI component</div>`:m}

      ${this._showCopiedToast?p`<div class="copied-toast">Changeset copied ✓</div>`:m}
    `}};_=U(Bo),xe=new WeakMap,$e=new WeakMap,_e=new WeakMap,Se=new WeakMap,we=new WeakMap,Ee=new WeakMap,V=new WeakMap,yt=new WeakMap,vt=new WeakMap,C=new WeakSet,Vo=function(){this._active=!0,document.addEventListener("mousemove",g(this,xt),!0),document.addEventListener("pointerdown",g(this,$t),!0),document.addEventListener("focusin",g(this,_t),!0)},Ot=function(){this._active=!1,this._inspectionData=null,this._selectedElement=null,g(this,V)?.hide(),document.removeEventListener("mousemove",g(this,xt),!0),document.removeEventListener("pointerdown",g(this,$t),!0),document.removeEventListener("focusin",g(this,_t),!0)},xt=new WeakMap,$t=new WeakMap,_t=new WeakMap,zt=new WeakMap,Ut=function(e){this._activeTab=e},at=new WeakMap,Dt=new WeakMap,It=new WeakMap,Fo=function(){let e=this._inspectionData;return p`
      <div class="panel-shell">
        <!-- Header -->
        <div class="header">
          <div class="header-info">
            <span class="tag-name">&lt;${e.tagName}&gt;</span>
            <span class="class-name">${e.className}</span>
          </div>
          <button class="close-btn" @click=${g(this,zt)}>&times;</button>
        </div>

        <!-- Tab bar -->
        <div class="tab-bar">
          <button
            class="tab-btn"
            ?data-active=${this._activeTab==="inspect"}
            @click=${()=>x(this,C,Ut).call(this,"inspect")}
          >Inspect</button>
          <button
            class="tab-btn"
            ?data-active=${this._activeTab==="tokens"}
            @click=${()=>x(this,C,Ut).call(this,"tokens")}
          >Tokens</button>
          <button
            class="tab-btn"
            ?data-active=${this._activeTab==="styles"}
            @click=${()=>x(this,C,Ut).call(this,"styles")}
          >Styles</button>
        </div>

        <!-- Tab content -->
        <div class="tab-content">
          ${this._activeTab==="inspect"?p`<dui-inspector-panel .data=${e}></dui-inspector-panel>`:m}
          ${this._activeTab==="tokens"?p`<dui-inspector-token-editor
                .data=${e}
                .selector=${e.selector}
                @token-changed=${g(this,at)}
              ></dui-inspector-token-editor>`:m}
          ${this._activeTab==="styles"?p`<dui-inspector-style-editor
                .data=${e}
                .targetElement=${this._selectedElement}
                @style-changed=${g(this,at)}
              ></dui-inspector-style-editor>`:m}
        </div>

        <!-- Toolbar -->
        <div class="toolbar">
          <button
            class="toolbar-btn"
            @click=${g(this,It)}
            ?disabled=${this._changeCount===0}
          >Copy changes</button>
          <button
            class="toolbar-btn"
            @click=${g(this,Dt)}
            ?disabled=${this._changeCount===0}
          >Undo</button>
          <span
            class="change-count"
            ?data-has-changes=${this._changeCount>0}
          >${this._changeCount} change${this._changeCount!==1?"s":""}</span>
        </div>
      </div>
    `},f(_,4,"_active",Wo,R,xe),f(_,4,"_selectedElement",qo,R,$e),f(_,4,"_inspectionData",jo,R,_e),f(_,4,"_activeTab",Io,R,Se),f(_,4,"_changeCount",Do,R,we),f(_,4,"_showCopiedToast",zo,R,Ee),R=f(_,0,"InspectorViewElement",Ko,R),z(R,"styles",N`
    :host {
      display: contents;
    }

    .panel-shell {
      position: fixed;
      top: 0;
      right: 0;
      width: 360px;
      height: 100dvh;
      background: #1e1e2e;
      color: #cdd6f4;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #181825;
      border-bottom: 1px solid #313244;
      flex-shrink: 0;
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .tag-name {
      font-size: 14px;
      font-weight: 700;
      color: #89b4fa;
    }

    .class-name {
      font-size: 11px;
      color: #6c7086;
    }

    .close-btn {
      background: none;
      border: none;
      color: #6c7086;
      cursor: pointer;
      font-size: 18px;
      padding: 4px;
      line-height: 1;
    }

    .close-btn:hover {
      color: #cdd6f4;
    }

    /* Tabs */
    .tab-bar {
      display: flex;
      background: #181825;
      border-bottom: 1px solid #313244;
      flex-shrink: 0;
    }

    .tab-btn {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: #6c7086;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 8px 12px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .tab-btn:hover {
      color: #a6adc8;
    }

    .tab-btn[data-active] {
      color: #89b4fa;
      border-bottom-color: #89b4fa;
    }

    /* Tab content */
    .tab-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: #181825;
      border-top: 1px solid #313244;
      flex-shrink: 0;
    }

    .toolbar-btn {
      background: none;
      border: 1px solid #45475a;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 4px;
      cursor: pointer;
    }

    .toolbar-btn:hover {
      border-color: oklch(0.65 0.2 250);
      color: oklch(0.65 0.2 250);
    }

    .toolbar-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }

    .change-count {
      margin-left: auto;
      font-size: 10px;
      color: #585b70;
    }

    .change-count[data-has-changes] {
      color: #f9e2af;
    }

    .activation-badge {
      position: fixed;
      bottom: 12px;
      left: 12px;
      background: oklch(0.65 0.2 250);
      color: white;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      z-index: 99997;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .copied-toast {
      position: fixed;
      bottom: 12px;
      right: 380px;
      background: #a6e3a1;
      color: #1e1e2e;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      z-index: 99997;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
  `),u(_,1,R);var ks=document.createElement("dui-inspector");document.body.appendChild(ks);
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
