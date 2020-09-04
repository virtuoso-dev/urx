const typedoc = require("./sidebars").typedoc;

module.exports = {
  typedoc: {
    Introduction: ["get-started", "urx-by-example", "thinking-in-systems"],
    "API Reference": typedoc.Modules,
    Interfaces: typedoc.Interfaces,
  },
};
