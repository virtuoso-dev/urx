import * as React from "react";

const indexTsx = `
import * as React from "react";
import { render } from "react-dom";

import App from "./example";

const rootElement = document.getElementById("root");
render(\<App />, rootElement);
`;

const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
	<title>urx Example</title>
</head>
<body>
	<div id="root"></div>
</body>
</html>
`;

const packageJson = {
  name: "urx-example",
  version: "1.0.0",
  description: "urx example",
  keywords: ["typescript", "react", "starter"],
  main: "src/index.tsx",
  dependencies: {
    "@virtuoso.dev/urx": "latest",
    "@virtuoso.dev/react-urx": "latest",
    react: "^16.12.0",
    "react-dom": "^16.12.0",
    "react-scripts": "3.3.0",
  },
  devDependencies: {
    "@types/react": "16.9.19",
    "@types/react-dom": "16.9.5",
    typescript: "3.7.5",
  },
  scripts: {
    start: "react-scripts start",
    build: "react-scripts build",
    test: "react-scripts test --env=jsdom",
    eject: "react-scripts eject",
  },
  browserslist: [">0.2%", "not dead", "not ie <= 11", "not op_mini all"],
};

function openInSandbox(e) {
  const code = e.target.parentElement.nextElementSibling.querySelector(
    ".prism-code"
  ).innerText;

  fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      files: {
        "package.json": {
          content: packageJson,
        },

        "src/example.tsx": {
          content: code,
        },

        "src/index.tsx": {
          content: indexTsx,
        },

        "public/index.html": {
          content: '<div id="root"></div>',
        },
      },
    }),
  })
    .then((x) => x.json())
    .then((data) => {
      window.open(
        `https://codesandbox.io/s/${data.sandbox_id}?file=/src/example.tsx`,
        "_blank"
      );
    });
}

export default () => {
  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <button className="open-in-sandbox" onClick={openInSandbox}>
        Open in Sandbox
      </button>
    </div>
  );
};
