import { toBeDeepCloseTo,toMatchCloseTo } from 'jest-matcher-deep-close-to'
import _ from 'lodash'

import { percentageDistribution } from './percentageDistribution'

// Allow comparing numbers in deep data structures with flexible precision
expect.extend({toBeDeepCloseTo, toMatchCloseTo})

const fractionStringToNumber = eval

describe('percentageDistribution', () => {
  ;[
    [
      ['1/2', '1/2'],
      0,
      '1/4',
    ],
    [
      ['1/3', '1/3', '1/3'],
      0,
      '1/2',
    ],
    [
      ['1/4', '1/4', '1/4', '1/4'],
      0,
      '1/2',
    ],
    [
      ['1/2', '1/4', '1/8', '1/8'],
      2,
      '1/3',
    ],
  ].forEach(([values, index, newValue]) =>  {
    test(
      `percentageDistribution([${values.join(', ')}], ${index}, ${newValue})`,
      () => {
        const numericValues = values.map(fractionStringToNumber)
        const numericNewValue = fractionStringToNumber(newValue)

        const result = percentageDistribution(
          numericValues,
          index,
          numericNewValue,
        )

        expect(result[index]).toBe(numericNewValue)
        expect(_.sum(result)).toBeCloseTo(1, 10)

        // All ratios of old to new values should be the same,
        // except for the values at index
        expect(
          // Compute ratios of previous to new values
          _(numericValues)
          .zipWith(result, (a, b) => a / b)
          // The invariant doesn't apply for the value at index, so we remove it
          .omit(index)
          // omit resolves with an object, so we need to convert it back to array
          .values()
          // All the ratios should be the same, so after deduplicating...
          .uniq()
          .value()
          // ...there should be only a single item in the array
          .length
        ).toBe(1)
      }
    )
  })
})