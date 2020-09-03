import * as React from "react";

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
          content: {
            dependencies: {
              react: "latest",
              "react-dom": "latest",
            },
          },
        },
        "example.ts": {
          content: code,
        },
        "index.html": {
          content: '<div id="root"></div>',
        },
      },
    }),
  })
    .then((x) => x.json())
    .then((data) => {
      window.open(
        `https://codesandbox.io/s/${data.sandbox_id}?file=/example.ts`,
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
