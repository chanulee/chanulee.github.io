(self.webpackChunkchanwoo_gatsby_221117=self.webpackChunkchanwoo_gatsby_221117||[]).push([[395],{3723:function(e,t,r){"use strict";r.d(t,{L:function(){return p},M:function(){return v},P:function(){return E},S:function(){return O},_:function(){return o},a:function(){return s},b:function(){return c},g:function(){return d},h:function(){return i}});var a=r(7294),n=(r(2369),r(5697)),l=r.n(n);function s(){return s=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},s.apply(this,arguments)}function o(e,t){if(null==e)return{};var r,a,n={},l=Object.keys(e);for(a=0;a<l.length;a++)t.indexOf(r=l[a])>=0||(n[r]=e[r]);return n}const i=()=>"undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype;function c(e,t,r,a,n){return void 0===n&&(n={}),s({},r,{loading:a,shouldLoad:e,"data-main-image":"",style:s({},n,{opacity:t?1:0})})}function d(e,t,r,a,n,l,o,i){const c={};l&&(c.backgroundColor=l,"fixed"===r?(c.width=a,c.height=n,c.backgroundColor=l,c.position="relative"):("constrained"===r||"fullWidth"===r)&&(c.position="absolute",c.top=0,c.left=0,c.bottom=0,c.right=0)),o&&(c.objectFit=o),i&&(c.objectPosition=i);const d=s({},e,{"aria-hidden":!0,"data-placeholder-image":"",style:s({opacity:t?0:1,transition:"opacity 500ms linear"},c)});return d}const u=["children"],m=function(e){let{layout:t,width:r,height:n}=e;return"fullWidth"===t?a.createElement("div",{"aria-hidden":!0,style:{paddingTop:n/r*100+"%"}}):"constrained"===t?a.createElement("div",{style:{maxWidth:r,display:"block"}},a.createElement("img",{alt:"",role:"presentation","aria-hidden":"true",src:"data:image/svg+xml;charset=utf-8,%3Csvg height='"+n+"' width='"+r+"' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E",style:{maxWidth:"100%",display:"block",position:"static"}})):null},p=function(e){let{children:t}=e,r=o(e,u);return a.createElement(a.Fragment,null,a.createElement(m,s({},r)),t,null)},f=["src","srcSet","loading","alt","shouldLoad"],h=["fallback","sources","shouldLoad"],g=function(e){let{src:t,srcSet:r,loading:n,alt:l="",shouldLoad:i}=e,c=o(e,f);return a.createElement("img",s({},c,{decoding:"async",loading:n,src:i?t:void 0,"data-src":i?void 0:t,srcSet:i?r:void 0,"data-srcset":i?void 0:r,alt:l}))},C=function(e){let{fallback:t,sources:r=[],shouldLoad:n=!0}=e,l=o(e,h);const i=l.sizes||(null==t?void 0:t.sizes),c=a.createElement(g,s({},l,t,{sizes:i,shouldLoad:n}));return r.length?a.createElement("picture",null,r.map((e=>{let{media:t,srcSet:r,type:l}=e;return a.createElement("source",{key:t+"-"+l+"-"+r,type:l,media:t,srcSet:n?r:void 0,"data-srcset":n?void 0:r,sizes:i})})),c):c};var y;g.propTypes={src:n.string.isRequired,alt:n.string.isRequired,sizes:n.string,srcSet:n.string,shouldLoad:n.bool},C.displayName="Picture",C.propTypes={alt:n.string.isRequired,shouldLoad:n.bool,fallback:n.exact({src:n.string.isRequired,srcSet:n.string,sizes:n.string}),sources:n.arrayOf(n.oneOfType([n.exact({media:n.string.isRequired,type:n.string,sizes:n.string,srcSet:n.string.isRequired}),n.exact({media:n.string,type:n.string.isRequired,sizes:n.string,srcSet:n.string.isRequired})]))};const w=["fallback"],E=function(e){let{fallback:t}=e,r=o(e,w);return t?a.createElement(C,s({},r,{fallback:{src:t},"aria-hidden":!0,alt:""})):a.createElement("div",s({},r))};E.displayName="Placeholder",E.propTypes={fallback:n.string,sources:null==(y=C.propTypes)?void 0:y.sources,alt:function(e,t,r){return e[t]?new Error("Invalid prop `"+t+"` supplied to `"+r+"`. Validation failed."):null}};const v=function(e){return a.createElement(a.Fragment,null,a.createElement(C,s({},e)),a.createElement("noscript",null,a.createElement(C,s({},e,{shouldLoad:!0}))))};v.displayName="MainImage",v.propTypes=C.propTypes;const x=function(e,t,r){for(var a=arguments.length,n=new Array(a>3?a-3:0),s=3;s<a;s++)n[s-3]=arguments[s];return e.alt||""===e.alt?l().string.apply(l(),[e,t,r].concat(n)):new Error('The "alt" prop is required in '+r+'. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html')},b={image:l().object.isRequired,alt:x},k=["as","image","style","backgroundColor","className","class","onStartLoad","onLoad","onError"],L=["style","className"],N=new Set;let S,F;const R=function(e){let{as:t="div",image:n,style:l,backgroundColor:c,className:d,class:u,onStartLoad:m,onLoad:p,onError:f}=e,h=o(e,k);const{width:g,height:C,layout:y}=n,w=function(e,t,r){const a={};let n="gatsby-image-wrapper";return"fixed"===r?(a.width=e,a.height=t):"constrained"===r&&(n="gatsby-image-wrapper gatsby-image-wrapper-constrained"),{className:n,"data-gatsby-image-wrapper":"",style:a}}(g,C,y),{style:E,className:v}=w,x=o(w,L),b=(0,a.useRef)(),R=(0,a.useMemo)((()=>JSON.stringify(n.images)),[n.images]);u&&(d=u);const T=function(e,t,r){let a="";return"fullWidth"===e&&(a='<div aria-hidden="true" style="padding-top: '+r/t*100+'%;"></div>'),"constrained"===e&&(a='<div style="max-width: '+t+'px; display: block;"><img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg height=\''+r+"' width='"+t+"' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E\" style=\"max-width: 100%; display: block; position: static;\"></div>"),a}(y,g,C);return(0,a.useEffect)((()=>{S||(S=Promise.all([r.e(774),r.e(223)]).then(r.bind(r,8223)).then((e=>{let{renderImageToString:t,swapPlaceholderImage:r}=e;return F=t,{renderImageToString:t,swapPlaceholderImage:r}})));const e=b.current.querySelector("[data-gatsby-image-ssr]");if(e&&i())return e.complete?(null==m||m({wasCached:!0}),null==p||p({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)):(null==m||m({wasCached:!0}),e.addEventListener("load",(function t(){e.removeEventListener("load",t),null==p||p({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)}))),void N.add(R);if(F&&N.has(R))return;let t,a;return S.then((e=>{let{renderImageToString:r,swapPlaceholderImage:o}=e;b.current&&(b.current.innerHTML=r(s({isLoading:!0,isLoaded:N.has(R),image:n},h)),N.has(R)||(t=requestAnimationFrame((()=>{b.current&&(a=o(b.current,R,N,l,m,p,f))}))))})),()=>{t&&cancelAnimationFrame(t),a&&a()}}),[n]),(0,a.useLayoutEffect)((()=>{N.has(R)&&F&&(b.current.innerHTML=F(s({isLoading:N.has(R),isLoaded:N.has(R),image:n},h)),null==m||m({wasCached:!0}),null==p||p({wasCached:!0}))}),[n]),(0,a.createElement)(t,s({},x,{style:s({},E,l,{backgroundColor:c}),className:v+(d?" "+d:""),ref:b,dangerouslySetInnerHTML:{__html:T},suppressHydrationWarning:!0}))},T=(0,a.memo)((function(e){return e.image?(0,a.createElement)(R,e):null}));T.propTypes=b,T.displayName="GatsbyImage";const _=["src","__imageData","__error","width","height","aspectRatio","tracedSVGOptions","placeholder","formats","quality","transformOptions","jpgOptions","pngOptions","webpOptions","avifOptions","blurredOptions","breakpoints","outputPixelDensities"],I=function(e,t){for(var r=arguments.length,a=new Array(r>2?r-2:0),n=2;n<r;n++)a[n-2]=arguments[n];return"fullWidth"!==e.layout||"width"!==t&&"height"!==t||!e[t]?l().number.apply(l(),[e,t].concat(a)):new Error('"'+t+'" '+e[t]+" may not be passed when layout is fullWidth.")},P=new Set(["fixed","fullWidth","constrained"]),A={src:l().string.isRequired,alt:x,width:I,height:I,sizes:l().string,layout:e=>{if(void 0!==e.layout&&!P.has(e.layout))return new Error("Invalid value "+e.layout+'" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".')}},O=(Z=T,function(e){let{src:t,__imageData:r,__error:n}=e,l=o(e,_);return n&&console.warn(n),r?a.createElement(Z,s({image:r},l)):(console.warn("Image not loaded",t),null)});var Z;O.displayName="StaticImage",O.propTypes=A},2369:function(e){"use strict";const t=(e,t)=>{if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");t=Object.assign({pascalCase:!1},t);if(e=Array.isArray(e)?e.map((e=>e.trim())).filter((e=>e.length)).join("-"):e.trim(),0===e.length)return"";if(1===e.length)return t.pascalCase?e.toUpperCase():e.toLowerCase();return e!==e.toLowerCase()&&(e=(e=>{let t=!1,r=!1,a=!1;for(let n=0;n<e.length;n++){const l=e[n];t&&/[a-zA-Z]/.test(l)&&l.toUpperCase()===l?(e=e.slice(0,n)+"-"+e.slice(n),t=!1,a=r,r=!0,n++):r&&a&&/[a-zA-Z]/.test(l)&&l.toLowerCase()===l?(e=e.slice(0,n-1)+"-"+e.slice(n-1),a=r,r=!1,t=!0):(t=l.toLowerCase()===l&&l.toUpperCase()!==l,a=r,r=l.toUpperCase()===l&&l.toLowerCase()!==l)}return e})(e)),e=e.replace(/^[_.\- ]+/,"").toLowerCase().replace(/[_.\- ]+(\w|$)/g,((e,t)=>t.toUpperCase())).replace(/\d+(\w|$)/g,(e=>e.toUpperCase())),r=e,t.pascalCase?r.charAt(0).toUpperCase()+r.slice(1):r;var r};e.exports=t,e.exports.default=t},2549:function(e,t,r){"use strict";var a=r(7294),n=r(1883),l=r(8721),s=r(7565),o=r.n(s),i=r(5227),c=r.n(i),d=r(3717),u=r.n(d),m=r(1957),p=r.n(m),f=r(8563),h=r.n(f);t.Z=function(e){let{className:t}=e;return a.createElement("footer",{className:"w-full h-[378px] px-xxl4 pt-xxl3 grid grid-cols-12 gap-x-l bg-black "+t},a.createElement("div",{className:"col-span-4 flex flex-col"},a.createElement("h3",{className:"mb-xs H3 text-white"},"Chanwoo Lee"),a.createElement("p",{className:"Subtitle text-white"},"Positive Impact of Technology on the real world via Design")),a.createElement("div",{className:"col-span-4 flex flex-col"},a.createElement("hr",{className:"w-full mb-xs stroke-white stroke-1"}),a.createElement("p",{className:"mb-l body text-white"},"MENU"),a.createElement("div",{className:"w-full flex flex-col"},[["/projects","Projects"],["/approach","Approach"],["/about","About"]].map((e=>a.createElement(n.rU,{to:e[0],key:(0,l.Z)()},a.createElement("div",{className:"w-full flex justify-between items-center"},a.createElement("p",{className:"H4 text-white"},e[1]),a.createElement(o(),{className:"fill-white"}))))))),a.createElement("div",{className:"col-span-4 flex flex-col"},a.createElement("hr",{className:"w-full mb-xs stroke-white stroke-1"}),a.createElement("p",{className:"mb-l body text-white"},"Get in touch"),a.createElement("p",{className:"mb-l body text-white"},"hellochanu@gmail.com"),a.createElement("div",{className:"w-full flex flex-row gap-x-m"},[["https://www.linkedin.com/in/chanulee/",c()],["https://www.instagram.com/chanu.kyle.lee/",u()],["https://vimeo.com/chanulee",p()],["https://twitter.com/krevony",h()]].map((e=>{const[t,r]=e;return a.createElement("a",{href:t,target:"_blank",key:(0,l.Z)()},a.createElement(r,null))})))))}},2862:function(e,t,r){"use strict";var a=r(7294),n=(r(1883),r(3547)),l=r(7565),s=r.n(l);t.Z=function(e){let{className:t,href:r,blank:l=!1,noArrow:o=!1,children:i}=e;return a.createElement("a",{href:r,target:l?"_blank":"_self"},a.createElement(n.Z,{className:t},i,!o&&a.createElement(s(),{className:"ml-xs fill-black"})))}},7706:function(e,t,r){"use strict";var a=r(7294),n=r(1883),l=r(8721);t.Z=function(e){let{className:t,transparent:r=!1}=e;const s=r?"text-white":"text-black";return a.createElement("nav",{className:"w-full h-[95px] px-xxl4 py-xl flex flex-row justify-between bg-transparent "+t},a.createElement("a",{className:"H4 "+s,href:(0,n.dq)("/")},"CHANWOO LEE"),a.createElement("div",{className:"flex gap-x-xl"},[["/projects","PROJECTS"],["/approach","APPROACH"],["/about","ABOUT"]].map((e=>a.createElement("a",{className:"H4 hover:underline "+s,href:(0,n.dq)(e[0]),key:(0,l.Z)()},e[1])))))}},3547:function(e,t,r){"use strict";var a=r(7294);t.Z=function(e){let{className:t,primary:r=!1,children:n}=e;return a.createElement("div",{className:t+" px-l py-xs flex items-center rounded-l "+(r?"bg-blue text-white":"bg-grey")},n)}},3717:function(e,t,r){var a=r(7294);function n(e){return a.createElement("svg",e,[a.createElement("title",{key:0},"Vector-1"),a.createElement("g",{id:"Symbols",stroke:"none",strokeWidth:"1",fill:"none",fillRule:"evenodd",key:1},a.createElement("g",{id:"desktop/footer",transform:"translate(-976.000000, -178.000000)",fill:"#FFFFFF",fillRule:"nonzero"},a.createElement("g",{id:"Group-5",transform:"translate(936.000000, 178.000000)"},a.createElement("g",{id:"Vector-1",transform:"translate(40.022996, 0.000000)"},a.createElement("path",{d:"M8.00095147,11.999976 C8.00095147,9.79092 9.79135774,7.999656 12.0004737,7.999656 C14.2096377,7.999656 16.0009515,9.79092 16.0009515,11.999976 C16.0009515,14.209032 14.2096377,16.000296 12.0004737,16.000296 C9.79135774,16.000296 8.00095147,14.209032 8.00095147,11.999976 Z M5.83836943,11.999976 C5.83836943,15.403176 8.59716189,18.161832 12.0004737,18.161832 C15.4038336,18.161832 18.162578,15.403176 18.162578,11.999976 C18.162578,8.596776 15.4038336,5.838168 12.0004737,5.838168 C8.59716189,5.838168 5.83836943,8.596776 5.83836943,11.999976 Z M16.9664632,5.5938 C16.9663673,5.878632 17.0507041,6.15708 17.2088716,6.39396 C17.3669912,6.630792 17.5918414,6.815448 17.8549262,6.924552 C18.118011,7.033656 18.407529,7.062312 18.6869247,7.006824 C18.9662724,6.951384 19.2229288,6.814344 19.424416,6.613032 C19.6259033,6.41172 19.7631545,6.155208 19.8188034,5.875896 C19.8745002,5.596584 19.8461001,5.307048 19.737201,5.043864 C19.628302,4.78068 19.4438452,4.555704 19.2070497,4.3974048 C18.9703021,4.2390816 18.6919139,4.1545152 18.4070972,4.1544 L18.4065216,4.1544 C18.0247512,4.1545776 17.658668,4.306272 17.388675,4.576152 C17.1186341,4.846056 16.9667991,5.212056 16.9664632,5.5938 L16.9664632,5.5938 Z M7.15230628,21.767688 C5.98228891,21.714408 5.34635671,21.519528 4.92376116,21.354888 C4.36347304,21.136776 3.9637127,20.877 3.54340546,20.457288 C3.12310302,20.037576 2.86293019,19.638216 2.64577009,19.07796 C2.48103026,18.65556 2.28613931,18.019464 2.23295626,16.849512 C2.17477441,15.584664 2.16316011,15.204648 2.16316011,12.000072 C2.16316011,8.795496 2.17573388,8.416584 2.23295626,7.150632 C2.28623525,5.98068 2.4825654,5.345832 2.64577009,4.922184 C2.86388965,4.361952 3.1236787,3.962208 3.54340546,3.54192 C3.96313702,3.121632 4.36251357,2.861472 4.92376116,2.64432 C5.34616482,2.479584 5.98228891,2.284704 7.15230628,2.23152 C8.41721457,2.173344 8.79720996,2.161728 12.0004737,2.161728 C15.2037375,2.161728 15.5841167,2.174304 16.8501284,2.23152 C18.0201457,2.2848 18.6549745,2.48112 19.0786735,2.64432 C19.638952,2.861472 20.0387123,3.122208 20.4590052,3.54192 C20.879298,3.961632 21.138497,4.361952 21.356631,4.922184 C21.5213708,5.344584 21.7162857,5.98068 21.76944,7.150632 C21.8276314,8.416584 21.8392409,8.795496 21.8392409,12.000072 C21.8392409,15.204648 21.8276314,15.583608 21.76944,16.849512 C21.7161898,18.019464 21.5203154,18.655368 21.356631,19.07796 C21.138497,19.638216 20.8787224,20.03796 20.4590052,20.457288 C20.039288,20.876616 19.638952,21.136776 19.0786735,21.354888 C18.6562218,21.519624 18.0201457,21.714504 16.8501284,21.767688 C15.5851721,21.825864 15.2051767,21.83748 12.0004737,21.83748 C8.79577077,21.83748 8.41683078,21.825864 7.15230628,21.767688 L7.15230628,21.767688 Z M7.0529059,0.072672 C5.77538067,0.130848 4.90246107,0.333408 4.14007163,0.630048 C3.35053418,0.936384 2.68215773,1.34736 2.01425622,2.014176 C1.34635951,2.680992 0.936424071,3.3504 0.630072275,4.139904 C0.333420651,4.902696 0.130853987,5.775192 0.0726750183,7.052664 C0.0135365863,8.332152 0,8.74116 0,11.999976 C0,15.258792 0.0135365863,15.667848 0.0726750183,16.947336 C0.130853987,18.224904 0.333420651,19.097256 0.630072275,19.860072 C0.936424071,20.649096 1.34645546,21.319272 2.01425622,21.9858 C2.68206179,22.652328 3.35053418,23.062776 4.14007163,23.369976 C4.90390027,23.666616 5.77538067,23.869128 7.0529059,23.927304 C8.33311762,23.98548 8.7415611,23.999976 12.0004737,23.999976 C15.2594343,23.999976 15.6685015,23.98644 16.9480416,23.927304 C18.2256627,23.869128 19.0980546,23.666616 19.8609238,23.369976 C20.6499384,23.062776 21.3188281,22.652616 21.9867104,21.9858 C22.6545928,21.318984 23.0637079,20.649096 23.37088,19.860072 C23.667546,19.097256 23.8710961,18.224808 23.9282801,16.947336 C23.9864716,15.666888 24,15.258792 24,11.999976 C24,8.74116 23.9864716,8.332152 23.9282801,7.052664 C23.8701367,5.775096 23.667546,4.902216 23.37088,4.139904 C23.0637079,3.35088 22.6535373,2.682048 21.9867104,2.014176 C21.3198835,1.346304 20.6499384,0.936384 19.8618833,0.630048 C19.0980546,0.333408 18.2255668,0.129888 16.949001,0.072672 C15.6694609,0.014496 15.2603938,0 12.0014332,0 C8.74252056,0 8.33311762,0.013536 7.0529059,0.072672 Z",id:"Shape"})))))])}n.defaultProps={width:"25px",height:"24px",viewBox:"0 0 25 24",version:"1.1"},e.exports=n,n.default=n},5227:function(e,t,r){var a=r(7294);function n(e){return a.createElement("svg",e,[a.createElement("title",{key:0},"Shape"),a.createElement("g",{id:"Symbols",stroke:"none",strokeWidth:"1",fill:"none",fillRule:"evenodd",key:1},a.createElement("g",{id:"desktop/footer",transform:"translate(-936.000000, -178.000000)",fill:"#FFFFFF"},a.createElement("g",{id:"Subtract",transform:"translate(936.000000, 178.000000)"},a.createElement("path",{d:"M3.84,0 C1.7193744,0 0,1.7192592 0,3.84 L0,20.16 C0,22.280736 1.7193744,24 3.84,24 L20.16,24 C22.28064,24 24,22.280736 24,20.16 L24,3.84 C24,1.7192592 22.28064,0 20.16,0 L3.84,0 Z M7.296576,9.2856 L7.296576,20.096976 L3.7031232,20.096976 L3.7031232,9.2856 L7.296576,9.2856 Z M7.533264,5.942112 C7.533264,6.979584 6.753264,7.809744 5.5008,7.809744 L5.476896,7.8096 C4.2707808,7.8096 3.4912512,6.97944 3.4912512,5.942016 C3.4912512,4.880976 4.2946896,4.073904 5.524224,4.073904 C6.753264,4.073904 7.50984,4.880976 7.533264,5.942112 Z M12.878928,20.096976 L9.285456,20.096976 C9.285456,20.096976 9.332832,10.300176 9.285936,9.285936 L12.87936,9.285936 L12.87936,10.816272 C13.357008,10.079904 14.212032,9.032112 16.117968,9.032112 C18.481872,9.032112 20.254704,10.577328 20.254704,13.898064 L20.254704,20.096976 L16.661232,20.096976 L16.661232,14.313744 C16.661232,12.860256 16.14096,11.868864 14.841072,11.868864 C13.848288,11.868864 13.256736,12.537552 12.997488,13.183344 C12.951072,13.29528 12.922032,13.429008 12.904224,13.573824 C12.885024,13.727568 12.878928,13.893888 12.878928,14.060016 L12.878928,20.096976 Z",id:"Shape"}))))])}n.defaultProps={width:"24px",height:"24px",viewBox:"0 0 24 24",version:"1.1"},e.exports=n,n.default=n},7565:function(e,t,r){var a=r(7294);function n(e){return a.createElement("svg",e,[a.createElement("title",{key:0},"icons/rightarrow"),a.createElement("g",{id:"arrow_forward_FILL0_wght400_GRAD0_opsz24",transform:"translate(4.000000, 4.000000)",fill:"current",fillRule:"nonzero",key:1},a.createElement("polygon",{id:"Path",points:"8 16 6.575 14.6 12.175 9 0 9 0 7 12.175 7 6.575 1.4 8 0 16 8"}))])}n.defaultProps={width:"24px",height:"24px",viewBox:"0 0 24 24",version:"1.1"},e.exports=n,n.default=n},8563:function(e,t,r){var a=r(7294);function n(e){return a.createElement("svg",e,[a.createElement("title",{key:0},"Vector"),a.createElement("g",{id:"Symbols",stroke:"none",strokeWidth:"1",fill:"none",fillRule:"evenodd",key:1},a.createElement("g",{id:"desktop/footer",transform:"translate(-1053.000000, -178.000000)"},a.createElement("g",{id:"Vector",transform:"translate(1053.000000, 178.000000)"},[a.createElement("rect",{id:"Rectangle",x:"0",y:"0",width:"24",height:"24",key:0}),a.createElement("path",{d:"M22.8339385,5.10148407 C22.1075792,5.41378647 21.3439362,5.63126007 20.5618916,5.74852407 C20.9275216,5.68590807 21.4654925,5.02843287 21.6796335,4.76231127 C22.0049529,4.36089207 22.2529183,3.90264087 22.4108455,3.41083287 C22.4108455,3.37430967 22.4474085,3.32212887 22.4108455,3.29603607 C22.3924438,3.28598967 22.3717841,3.28072407 22.350788,3.28072407 C22.3297919,3.28072407 22.3091801,3.28598967 22.2907305,3.29603607 C21.4415656,3.75544407 20.5378205,4.10607927 19.6008757,4.33964727 C19.5682044,4.34961207 19.5334671,4.35050967 19.5003154,4.34223447 C19.4672117,4.33395927 19.4369427,4.31683287 19.4128236,4.29268407 C19.3398898,4.20592407 19.2613827,4.12400247 19.1777827,4.04743767 C18.7956248,3.70536567 18.3620578,3.42539607 17.8929368,3.21776727 C17.2596425,2.95820775 16.5756118,2.84579895 15.8924939,2.88902823 C15.2296514,2.93084967 14.5825199,3.10846695 13.991314,3.41083287 C13.4091407,3.72961527 12.8974509,4.16269527 12.4870421,4.68403767 C12.0553488,5.22063927 11.7437225,5.84337207 11.5730151,6.51035607 C11.4322884,7.14479607 11.4163371,7.80053847 11.5260261,8.44105047 C11.5260261,8.55063447 11.5260261,8.56628247 11.4320001,8.55063447 C7.70795535,8.00271447 4.65248495,6.68255607 2.15586149,3.84914967 C2.0461773,3.72391767 1.9887239,3.72391767 1.89993491,3.84914967 C0.813538177,5.49805527 1.34106394,8.10706647 2.69905986,9.39596247 C2.88186525,9.56813847 3.06989804,9.73513047 3.26837123,9.89165847 C2.64574323,9.84749847 2.03831698,9.67892247 1.48208854,9.39596247 C1.37762694,9.32809047 1.32017355,9.36461847 1.31495095,9.48985047 C1.30014317,9.66346647 1.30014317,9.83804247 1.31495095,10.0116585 C1.42393367,10.8437385 1.75215986,11.6319465 2.26606939,12.2957385 C2.77997892,12.9595305 3.46112694,13.4750025 4.23986117,13.7895465 C4.42969569,13.8707625 4.62750584,13.9320105 4.83006774,13.9721865 C4.25366478,14.0855625 3.66248769,14.1031785 3.08034324,14.0243625 C2.95499125,13.9982505 2.90798305,14.0661225 2.95499125,14.1861225 C3.7227806,16.2733545 5.38891949,16.9099305 6.61111341,17.2647465 C6.77826542,17.2908585 6.94541742,17.2908585 7.13342138,17.3326185 C7.13342138,17.3326185 7.13342138,17.3326185 7.1020954,17.3639145 C6.74170242,18.0213705 5.2844675,18.4649385 4.61592195,18.6945225 C3.39564506,19.1324265 2.09460286,19.2998025 0.803092979,19.1850345 C0.59939239,19.1536905 0.552385153,19.1589225 0.500154356,19.1850345 C0.447924039,19.2110985 0.500154356,19.2685065 0.557608232,19.3206825 C0.818760776,19.4928585 1.07991476,19.6442025 1.35151395,19.7903145 C2.16006552,20.2309065 3.01486616,20.5808745 3.90036339,20.8339305 C8.48620431,22.0966665 13.646584,21.1678665 17.0885988,17.7500265 C19.7941166,15.0679785 20.7447066,11.3683785 20.7447066,7.66354647 C20.7447066,7.52266647 20.9170956,7.43919447 21.0163106,7.36611927 C21.7008218,6.83330007 22.3042794,6.20405367 22.8078014,5.49805527 C22.8950049,5.39281527 22.9397357,5.25882327 22.9331534,5.12235447 C22.9331534,5.04408567 22.9331534,5.05973847 22.8339385,5.10148407 Z",id:"Path",fill:"#FFFFFF",fillRule:"nonzero",key:1})])))])}n.defaultProps={width:"24px",height:"24px",viewBox:"0 0 24 24",version:"1.1"},e.exports=n,n.default=n},1957:function(e,t,r){var a=r(7294);function n(e){return a.createElement("svg",e,[a.createElement("title",{key:0},"Vector-2"),a.createElement("g",{id:"Symbols",stroke:"none",strokeWidth:"1",fill:"none",fillRule:"evenodd",key:1},a.createElement("g",{id:"desktop/footer",transform:"translate(-1015.000000, -178.000000)"},a.createElement("g",{id:"Vector-2",transform:"translate(1015.000000, 178.000000)"},[a.createElement("rect",{id:"Rectangle",x:"0",y:"0",width:"24",height:"24",key:0}),a.createElement("path",{d:"M22.4682934,7.40762879 C22.3729702,9.37651199 20.9166481,12.072576 18.0999999,15.494352 C15.1878363,19.068768 12.7239898,20.855808 10.7084125,20.855808 C9.46032174,20.855808 8.40326188,19.767696 7.54050002,17.590656 C6.96390008,15.595104 6.38792473,13.599744 5.81152659,11.60424 C5.17044892,9.42839999 4.48309817,8.33908799 3.7482011,8.33908799 C3.58798694,8.33908799 3.02722776,8.65742399 2.0672112,9.29174399 L1.05943212,8.06574719 C2.11647756,7.18859519 3.15938306,6.31164479 4.18537158,5.43348479 C5.5951899,4.28299679 6.65352297,3.67797407 7.35883813,3.61680575 C9.02593793,3.46560095 10.051912,4.54159679 10.4370487,6.84500159 C10.8532231,9.33009599 11.1410666,10.87584 11.3030296,11.48088 C11.7834415,13.542624 12.3120915,14.572224 12.8897485,14.572224 C13.3380656,14.572224 14.0114783,13.903584 14.9094098,12.566352 C15.8064284,11.228736 16.2868884,10.211088 16.3517504,9.51196799 C16.4794086,8.35766399 15.9988046,7.77908159 14.9094098,7.77908159 C14.3966149,7.77908159 13.8679649,7.89051839 13.3241323,8.11076159 C14.3766758,4.85471039 16.3879771,3.27341519 19.3566909,3.3636536 C21.5575336,3.42461999 22.5950868,4.77254399 22.4682934,7.40762879 Z",id:"Path",fill:"#FFFFFF",fillRule:"nonzero",key:1})])))])}n.defaultProps={width:"24px",height:"24px",viewBox:"0 0 24 24",version:"1.1"},e.exports=n,n.default=n},8721:function(e,t,r){"use strict";r.d(t,{Z:function(){return c}});var a={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let n;const l=new Uint8Array(16);function s(){if(!n&&(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!n))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(l)}const o=[];for(let d=0;d<256;++d)o.push((d+256).toString(16).slice(1));function i(e,t=0){return(o[e[t+0]]+o[e[t+1]]+o[e[t+2]]+o[e[t+3]]+"-"+o[e[t+4]]+o[e[t+5]]+"-"+o[e[t+6]]+o[e[t+7]]+"-"+o[e[t+8]]+o[e[t+9]]+"-"+o[e[t+10]]+o[e[t+11]]+o[e[t+12]]+o[e[t+13]]+o[e[t+14]]+o[e[t+15]]).toLowerCase()}var c=function(e,t,r){if(a.randomUUID&&!t&&!e)return a.randomUUID();const n=(e=e||{}).random||(e.rng||s)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){r=r||0;for(let e=0;e<16;++e)t[r+e]=n[e];return t}return i(n)}}}]);
//# sourceMappingURL=3e11337fcf04970efaf373a1ecd75b34ea5b118b-56387e2b1bcd48eebf41.js.map