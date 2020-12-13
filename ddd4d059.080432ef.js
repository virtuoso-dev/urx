(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{100:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return d}));var a=n(0),r=n.n(a);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function m(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=r.a.createContext({}),p=function(e){var t=r.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return r.a.createElement(u.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},b=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,s=e.originalType,o=e.parentName,u=m(e,["components","mdxType","originalType","parentName"]),c=p(n),b=a,d=c["".concat(o,".").concat(b)]||c[b]||l[b]||s;return n?r.a.createElement(d,i(i({ref:t},u),{},{components:n})):r.a.createElement(d,i({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=n.length,o=new Array(s);o[0]=b;var i={};for(var m in t)hasOwnProperty.call(t,m)&&(i[m]=t[m]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var u=2;u<s;u++)o[u]=n[u];return r.a.createElement.apply(null,o)}return r.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"},122:function(e,t,n){"use strict";var a=n(0),r={name:"urx-example",version:"1.0.0",description:"urx example",keywords:["typescript","react","starter"],main:"src/index.tsx",dependencies:{"@virtuoso.dev/urx":"latest","@virtuoso.dev/react-urx":"latest",react:"^16.12.0","react-dom":"^16.12.0","react-scripts":"3.3.0"},devDependencies:{"@types/react":"16.9.19","@types/react-dom":"16.9.5",typescript:"3.7.5"},scripts:{start:"react-scripts start",build:"react-scripts build",test:"react-scripts test --env=jsdom",eject:"react-scripts eject"},browserslist:[">0.2%","not dead","not ie <= 11","not op_mini all"]};function s(e){var t=e.target.parentElement.nextElementSibling.querySelector(".prism-code").innerText;fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({files:{"package.json":{content:r},"src/example.tsx":{content:t},"src/index.tsx":{content:'\nimport * as React from "react";\nimport { render } from "react-dom";\n\nimport App from "./example";\n\nconst rootElement = document.getElementById("root");\nrender(<App />, rootElement);\n'},"public/index.html":{content:'<div id="root"></div>'}}})}).then((function(e){return e.json()})).then((function(e){window.open("https://codesandbox.io/s/"+e.sandbox_id+"?file=/src/example.tsx","_blank")}))}t.a=function(){return a.createElement("div",{style:{position:"relative",zIndex:2}},a.createElement("button",{className:"open-in-sandbox",onClick:s},"Open in Sandbox"))}},96:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return m})),n.d(t,"rightToc",(function(){return u})),n.d(t,"default",(function(){return c}));var a=n(3),r=n(7),s=(n(0),n(100)),o=n(122),i={id:"urx-by-example",title:"urx by example",sidebar_label:"urx by Example"},m={unversionedId:"urx-by-example",id:"urx-by-example",isDocsHomePage:!1,title:"urx by example",description:"Before diving deeper, let's accomplish a small victory with a simple, end-to-end practical walkthrough.",source:"@site/docs/urx-by-example.md",slug:"/urx-by-example",permalink:"/docs/urx-by-example",editUrl:"https://github.com/virtuoso-dev/urx/edit/master/packages/docs/docs/docs/urx-by-example.md",version:"current",sidebar_label:"urx by Example",sidebar:"docs",previous:{title:"Get Started with urx",permalink:"/docs/get-started"},next:{title:"Thinking in Systems",permalink:"/docs/thinking-in-systems"}},u=[{value:"Build a Stream System",id:"build-a-stream-system",children:[]},{value:"Testing a System",id:"testing-a-system",children:[]},{value:"System to React Component",id:"system-to-react-component",children:[]},{value:"Putting it all Together",id:"putting-it-all-together",children:[]}],p={rightToc:u};function c(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(s.b)("wrapper",Object(a.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(s.b)("p",{className:"lead"},"Before diving deeper, let's accomplish a small victory with a simple, end-to-end practical walkthrough. In this section, we will build an urx-based React component that sums two numbers and displays the result."),Object(s.b)("h2",{id:"build-a-stream-system"},"Build a Stream System"),Object(s.b)("p",null,"Let's start by translating the requirements to a stream system.\nIn this case, the system consist of two input streams (",Object(s.b)("inlineCode",{parentName:"p"},"a")," and ",Object(s.b)("inlineCode",{parentName:"p"},"b"),"), and one output stream - ",Object(s.b)("inlineCode",{parentName:"p"},"sum"),".\nFor the initial version, ",Object(s.b)("inlineCode",{parentName:"p"},"a")," and ",Object(s.b)("inlineCode",{parentName:"p"},"b")," can start with default values of ",Object(s.b)("inlineCode",{parentName:"p"},"0"),"."),Object(s.b)("pre",null,Object(s.b)("code",Object(a.a)({parentName:"pre"},{className:"language-tsx"}),'import {\n  system,\n  statefulStream,\n  combineLatest,\n  map,\n  pipe,\n  statefulStreamFromEmitter,\n} from "@virtuoso.dev/urx";\n\nconst sumSystem = system(() => {\n  // stateful streams start wtih an initial value\n  const a = statefulStream(0);\n  const b = statefulStream(0);\n\n  // construct an emitter summing the two streams.\n  const aPlusB = pipe(\n    combineLatest(a, b),\n    map(([a, b]) => a + b)\n  );\n\n  // output streams must be stateful\n  // so we convert the emitter to a stateful stream\n  const sum = statefulStreamFromEmitter(aPlusB, 0);\n\n  return {\n    // input\n    a,\n    b,\n    // output\n    sum,\n  };\n});\n')),Object(s.b)("p",null,Object(s.b)("inlineCode",{parentName:"p"},"sumSystem")," is the implementation of our sum logic - it constructs the necessary input and\noutput streams and wires up the relationships between them using the ",Object(s.b)("inlineCode",{parentName:"p"},"pipe")," and ",Object(s.b)("inlineCode",{parentName:"p"},"combineLatest")," transformers and the ",Object(s.b)("inlineCode",{parentName:"p"},"map")," operator.\nWe also converted the resulting ",Object(s.b)("inlineCode",{parentName:"p"},"aPlusB")," emitter into a stateful stream, so that it always emits a value."),Object(s.b)("h2",{id:"testing-a-system"},"Testing a System"),Object(s.b)("p",null,"Let's poke the resulting system to get a feeling of how it works. We will import ",Object(s.b)("inlineCode",{parentName:"p"},"init"),", ",Object(s.b)("inlineCode",{parentName:"p"},"subscribe"),", and ",Object(s.b)("inlineCode",{parentName:"p"},"publish")," actions.\nIn a production project, this should be part of our unit test suite."),Object(s.b)("pre",null,Object(s.b)("code",Object(a.a)({parentName:"pre"},{className:"language-tsx"}),'import {\n  system,\n  statefulStream,\n  combineLatest,\n  map,\n  pipe,\n  statefulStreamFromEmitter,\n  init,\n  subscribe,\n  publish,\n} from "@virtuoso.dev/urx";\n\n// ... code from above\n\nconst { a, b, sum } = init(sumSystem);\n\nsubscribe(sum, (sum) => console.log({ sum }));\n\npublish(a, 5);\npublish(b, 7);\n')),Object(s.b)("p",null,"The above snippet will call the subscription (",Object(s.b)("inlineCode",{parentName:"p"},"console.log"),") three times - with ",Object(s.b)("inlineCode",{parentName:"p"},"0"),", ",Object(s.b)("inlineCode",{parentName:"p"},"5"),", and ",Object(s.b)("inlineCode",{parentName:"p"},"12"),"."),Object(s.b)("h2",{id:"system-to-react-component"},"System to React Component"),Object(s.b)("p",null,"Next, we will expose our system as a React component. As a twist,\nour component will accept the ",Object(s.b)("inlineCode",{parentName:"p"},"a")," as a component property, while ",Object(s.b)("inlineCode",{parentName:"p"},"b")," is going to come from an user input,\nfrom an UI rendered by a child component."),Object(s.b)("pre",null,Object(s.b)("code",Object(a.a)({parentName:"pre"},{className:"language-tsx"}),'import {\n  system,\n  statefulStream,\n  combineLatest,\n  map,\n  pipe,\n  statefulStreamFromEmitter,\n  init,\n  subscribe,\n  publish,\n  systemToComponent,\n} from "@virtuoso.dev/urx";\n\n//...\nconst {\n  Component: SumComponent,\n  usePublisher,\n  useEmitterValue,\n} = systemToComponent(sys, {\n  // expose the `a` stream as a required `a` property of the component.\n  // keys are the names of the properties, values are the names of the streams.\n  required: { a: "a" },\n});\n\n// the Input component accesses the `a`, `b` and `sum` streams through I/O hooks.\nconst Input = () => {\n  const setB = usePublisher("b");\n  const sum = useEmitterValue("sum");\n  const b = useEmitterValue("b");\n  return (\n    <div>\n      <label>\n        Input B value:{" "}\n        <input\n          value={b}\n          type="number"\n          onChange={(e) => setB(numValueFromEvent(e))}\n          size={5}\n        />\n      </label>\n      Sum: {sum}\n    </div>\n  );\n};\n')),Object(s.b)("h2",{id:"putting-it-all-together"},"Putting it all Together"),Object(s.b)("p",null,"The final step is to render the resulting components. To demonstrate how the SumComponent handles the change of the ",Object(s.b)("inlineCode",{parentName:"p"},"a")," property,\nwe will wire it up to an ",Object(s.b)("inlineCode",{parentName:"p"},'input type="range"'),"."),Object(s.b)("pre",null,Object(s.b)("code",Object(a.a)({parentName:"pre"},{className:"language-tsx"}),'// ...\nconst App = () => {\n  const [a, setA] = useState(0);\n  return (\n    <div>\n      <input\n        type="range"\n        id="points"\n        name="points"\n        min="0"\n        max="10"\n        value={a}\n        onChange={(e) => setA(numValueFromEvent(e))}\n      />\n      <SumComponent a={a}>\n        <Input />\n      </SumComponent>\n    </div>\n  );\n};\n\nReactDOM.render(<App />, document.getElementById("root"));\n')),Object(s.b)("p",null,"And, that's it! below, you can find the complete source - open it in CodeSandbox and tweak some of it for more interactive learning."),Object(s.b)(o.a,{mdxType:"OpenInSandbox"}),Object(s.b)("pre",null,Object(s.b)("code",Object(a.a)({parentName:"pre"},{className:"language-tsx",metastring:"sandbox=true",sandbox:"true"}),'import * as React from "react";\nimport * as ReactDOM from "react-dom";\nimport { systemToComponent } from "@virtuoso.dev/react-urx";\nimport {\n  system,\n  statefulStream,\n  combineLatest,\n  map,\n  pipe,\n  statefulStreamFromEmitter,\n  init,\n  subscribe,\n  publish,\n} from "@virtuoso.dev/urx";\nimport { useState } from "react";\n\nconst sumSystem = system(() => {\n  const a = statefulStream(0);\n  const b = statefulStream(0);\n\n  const aPlusB = pipe(\n    combineLatest(a, b),\n    map(([a, b]) => a + b)\n  );\n\n  const sum = statefulStreamFromEmitter(aPlusB, 0);\n\n  return { a, b, sum };\n});\n\nconst { a, b, sum } = init(sumSystem);\n\nsubscribe(sum, (sum) => console.log({ sum }));\npublish(a, 5);\npublish(b, 7);\n\nconst {\n  Component: SumComponent,\n  usePublisher,\n  useEmitterValue,\n} = systemToComponent(sumSystem, {\n  required: { a: "a" },\n});\n\nfunction numValueFromEvent(e: React.ChangeEvent) {\n  return parseInt((e.target as HTMLInputElement).value);\n}\n\nconst Input = () => {\n  const setB = usePublisher("b");\n  const sum = useEmitterValue("sum");\n  const b = useEmitterValue("b");\n  return (\n    <div>\n      <label>\n        Input B value:{" "}\n        <input\n          value={b}\n          type="number"\n          onChange={(e) => setB(numValueFromEvent(e))}\n          size={5}\n        />\n      </label>\n      Sum: {sum}\n    </div>\n  );\n};\n\nexport default App = () => {\n  const [a, setA] = useState(0);\n  return (\n    <div>\n      <input\n        type="range"\n        id="points"\n        name="points"\n        min="0"\n        max="10"\n        value={a}\n        onChange={(e) => setA(numValueFromEvent(e))}\n      />\n      <SumComponent a={a}>\n        <Input />\n      </SumComponent>\n    </div>\n  );\n};\n')))}c.isMDXComponent=!0}}]);