const typedoc = require('./sidebars').typedoc

module.exports = {
  typedoc: {
    Introduction: ['get_started'],
    'API Reference': typedoc.Modules,
    Interfaces: typedoc.Interfaces,
  },
}
