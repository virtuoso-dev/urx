const typedoc = require("./sidebars").typedoc;

module.exports = {
  typedoc: {
    Introduction: [
      "get-started",
      "urx-by-example",
      "thinking-in-systems",
      "urx-in-react",
    ],
    "@virtuoso.dev/urx": typedoc.Modules.filter((id) =>
      /^modules\/_urx/.test(id)
    ),
    "@virtuoso.dev/react-urx": typedoc.Modules.filter((id) =>
      /^modules\/_react_urx/.test(id)
    ),
    Interfaces: typedoc.Interfaces,
  },
};
