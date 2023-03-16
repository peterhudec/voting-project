import _ from 'lodash'

export const percentageDistribution = (values, idx, newValue) => {
  if (_.sum(values) !== 1) {
    throw Error('Values must have a sum of 1')
  }
  if (idx > values.length || idx < 0) {
    throw Error('Index out of bounds')
  }
  if (!_.isInteger(idx)) {
    throw Error('Index must be an integer')
  }
  if (newValue < 0 || newValue > 1) {
    throw Error('New value must be between 0 and 1')
  }

  // Split the array into the current value and the rest
  const rest = [...values]
  const [currentValue] = rest.splice(idx, 1)

  const oldRest100Percent = 1 - currentValue
  const newRest100Percent = 1 - newValue
  const factor = newRest100Percent / oldRest100Percent

  // Assemble the array back
  const result = rest.map(x => x * factor)
  result.splice(idx, 0, newValue)

  return result
}