const { ObjectId } = require("mongodb")
const { ACTIONS, createAction } = require('./actions')
const { connectToDatabase, disconnectFromDatabase } = require("./database")
const { commandOptions } = require('./options')

const args = process.argv.slice(2)

const processArguments = () => {
  if (args.length === 0) {
    console.error('Please provide a command option. Use --help to see the list of the available command options')
    return
  }

  let command = args[0]

  command = command.replace(/^--/, '')

  const commandOption = commandOptions[command]

  if (!commandOption) {
    console.log('Please provide a valid command option. Use --help to see the list of the available command options')
    return
  }

  console.log(`Selected command option: ${commandOption.commandFlag}`)
  console.log(`Description: ${commandOption.description}`)

  let payload

  if (commandOption.additionalArgumentList.length > 0) {
    if (args.length === 1) {
      console.error('Additional argument not provided. Please specify an additional argument. Available additional arguments: ' + commandOption.additionalArgumentList.join(','))
      return
    } else {
      const additionalArgument = args[1]

      if (commandOption.additionalArgumentList.includes('id')) {
        if (!ObjectId.isValid(additionalArgument)) {
          console.error('ID not valid. Please specify a valid ID.')
          return
        }
      } else if (commandOption.additionalArgumentList.length > 0 && !commandOption.additionalArgumentList.includes(additionalArgument)) {
        console.error('Additional argument not valid. Please specify a valid additional argument. Available additional arguments: ' + commandOption.additionalArgumentList.join('|'))
        return
      }
  
      console.log(`Additional argument: ${additionalArgument}`)
      
      payload = additionalArgument
    }
  }

  return createAction(commandOption.action, payload)
}

async function run({ type, payload }) {
    let client

    try {
      client = await connectToDatabase()
      const myDB = client.db("myDB")
      const todoColl = myDB.collection("todoList")
  
      switch(type) {
        case ACTIONS.ADD_TODO:
          const todo = { done: false }
          const addResult = await todoColl.insertOne(todo)
          console.log(
             `A todo was inserted with the _id: ${addResult.insertedId}`,
          )
          break
        case ACTIONS.LIST_TODO:
          let todoOptions = {}
          switch(payload) {
            case 'pending':
              todoOptions.done = false
              break
            case 'done':
              todoOptions.done = true
              break
            case 'all':
            default:
                break
          }
          const listResult = await todoColl.find(todoOptions);
          for await (const todo of listResult) {
            console.log(todo);
          }
          break
        case ACTIONS.UPDATE_TODO:
          const updateFilter = { _id: new ObjectId(payload) }
          const updateTodo = {
             $set: {
                done: true
             }
          };
          const updateResult = await todoColl.updateOne(updateFilter, updateTodo)
          if (updateResult.modifiedCount > 0) {
            console.log(`Todo with _id ${payload} updated successfully`);
          } else {
            console.error(`No todo with _id ${payload} updated`);
          }
          break;
        case ACTIONS.DELETE_TODO:
          const deleteFilter = { _id: new ObjectId(payload) }
          const deleteResult = await todoColl.deleteOne(deleteFilter)
          if (deleteResult.deletedCount === 1) {
            console.log(`Todo with _id ${payload} deleted successfully`);
          } else {
            console.error("No todos matched the query. Deleted 0 todos.");
          }
          break
        case ACTIONS.HELP:
          console.log(`List of available command options:`)
          for (const { commandFlag, description, additionalArgumentList } of Object.values(commandOptions)) {
            console.log(`${commandFlag} [${additionalArgumentList}]: ${description}`)
          }
          break
        case ACTIONS.VERSION:
          console.log(`V 6.5.4`)
          break
      }
    } catch (error) {
      console.error('An error occurred:', error)
    } finally {
      await disconnectFromDatabase(client)
    }
}

module.exports = { processArguments, run }