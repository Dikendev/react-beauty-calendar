import{w as g,e as r,u as h}from"./index-BZkcKs8Z.js";import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{R as x}from"./index-qiYO5j-o.js";import{H as y}from"./Header-z4iOideW.js";import"./Button-D4WSo3Or.js";const j=()=>{const[a,t]=x.useState();return e.jsxs("article",{children:[e.jsx(y,{user:a,onLogin:()=>t({name:"Jane Doe"}),onLogout:()=>t(void 0),onCreateAccount:()=>t({name:"Jane Doe"})}),e.jsxs("section",{className:"storybook-page",children:[e.jsx("h2",{children:"Pages in Storybook"}),e.jsxs("p",{children:["We recommend building UIs with a"," ",e.jsx("a",{href:"https://componentdriven.org",target:"_blank",rel:"noopener noreferrer",children:e.jsx("strong",{children:"component-driven"})})," ","process starting with atomic components and ending with pages."]}),e.jsx("p",{children:"Render pages with mock data. This makes it easy to build and review page states without needing to navigate to them in your app. Here are some handy patterns for managing page data in Storybook:"}),e.jsxs("ul",{children:[e.jsx("li",{children:'Use a higher-level connected component. Storybook helps you compose such data from the "args" of child component stories'}),e.jsx("li",{children:"Assemble data in the page component from your services. You can mock these services out using Storybook."})]}),e.jsxs("p",{children:["Get a guided tutorial on component-driven development at"," ",e.jsx("a",{href:"https://storybook.js.org/tutorials/",target:"_blank",rel:"noopener noreferrer",children:"Storybook tutorials"}),". Read more in the"," ",e.jsx("a",{href:"https://storybook.js.org/docs",target:"_blank",rel:"noopener noreferrer",children:"docs"}),"."]}),e.jsxs("div",{className:"tip-wrapper",children:[e.jsx("span",{className:"tip",children:"Tip"})," Adjust the width of the canvas with the"," ","Viewports addon in the toolbar"]})]})]})},k={title:"Example/Page",component:j,parameters:{layout:"fullscreen"}},o={},n={play:async({canvasElement:a})=>{const t=g(a),s=t.getByRole("button",{name:/Log in/i});await r(s).toBeInTheDocument(),await h.click(s),await r(s).not.toBeInTheDocument();const u=t.getByRole("button",{name:/Log out/i});await r(u).toBeInTheDocument()}};var i,c,l;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:"{}",...(l=(c=o.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var m,p,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole("button", {
      name: /Log in/i
    });
    await expect(loginButton).toBeInTheDocument();
    await userEvent.click(loginButton);
    await expect(loginButton).not.toBeInTheDocument();
    const logoutButton = canvas.getByRole("button", {
      name: /Log out/i
    });
    await expect(logoutButton).toBeInTheDocument();
  }
}`,...(d=(p=n.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const L=["LoggedOut","LoggedIn"];export{n as LoggedIn,o as LoggedOut,L as __namedExportsOrder,k as default};
