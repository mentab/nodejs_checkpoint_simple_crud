const { ACTIONS } = require('./actions')

function createCommandOption(commandFlag, description, action, additionalArgumentList = []) {
  return { commandFlag, description, action, additionalArgumentList }
}

const commandOptions = {
  new: createCommandOption('--new', 'to add a todo item', ACTIONS.ADD_TODO),
  list: createCommandOption('--list', 'to list the todo items', ACTIONS.LIST_TODO, ['all', 'pending', 'done']),
  done: createCommandOption('--done', 'to update a todo item', ACTIONS.UPDATE_TODO, ['id']),
  delete: createCommandOption('--delete', 'to delete a todo item', ACTIONS.DELETE_TODO, ['id']),
  help: createCommandOption('--help', 'to list all the available options', ACTIONS.HELP),
  version: createCommandOption('--version', 'to print the version of the application', ACTIONS.VERSION)
}

module.exports = { commandOptions }