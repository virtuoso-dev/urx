const typedoc = require("./typedoc-sidebar");

const sidebar = {
  docs: [
    "get-started",
    "urx-by-example",
    "urx-in-react",
    "urx-vs-redux",
    "urx-vs-rxjs",
    {
      type: "category",
      label: "@virtuoso.dev/urx",
      items: typedoc[2].items.filter((id) => /^api\/modules\/_urx/.test(id)),
    },
    {
      type: "category",
      label: "@virtuoso.dev/react-urx",
      items: typedoc[2].items.filter((id) =>
        /^api\/modules\/_react_urx/.test(id)
      ),
    },
    typedoc[3],
  ],
};

module.exports = sidebar;
