const typedoc = require("./sidebars").typedoc;

module.exports = {
  typedoc: {
    Introduction: ["get-started", "urx-by-example"],
    "API Reference": typedoc.Modules,
    Interfaces: typedoc.Interfaces,
  },
};
