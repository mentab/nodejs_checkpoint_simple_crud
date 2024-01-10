const { processArguments, run } = require('./cli')

const processedAction = processArguments()

if (processedAction) {
  run(processedAction)
}