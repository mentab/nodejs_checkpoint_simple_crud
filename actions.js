const ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  LIST_TODO: 'LIST_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  HELP: 'HELP',
  VERSION: 'VERSION'
}
  
function createAction(type, payload = null) {
  return { type, payload }
}

module.exports = { ACTIONS, createAction }