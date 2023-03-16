export const percentageDistribution = (values, idx, newValue) => {
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