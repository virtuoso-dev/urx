const typedoc = require('./sidebars').typedoc

module.exports = {
  typedoc: {
    Introduction: ['README'],
    'API Reference': typedoc.Modules,
    Interfaces: typedoc.Interfaces,
  },
}
