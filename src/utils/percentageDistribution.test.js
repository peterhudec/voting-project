import { toBeDeepCloseTo,toMatchCloseTo } from 'jest-matcher-deep-close-to'
import _ from 'lodash'

import { percentageDistribution } from './percentageDistribution'

// Allow comparing numbers in deep data structures with flexible precision
expect.extend({toBeDeepCloseTo, toMatchCloseTo})

const fractionStringToNumber = eval

describe('percentageDistribution', () => {
  describe('invalid input', () => {
    ;[
      {
        args: [
          [1/2, 1/2, 1/2],
          0,
          1/4,
        ],
        expectedErrorMessage: 'Values must have a sum of 1',
      },
      {
        args: [
          [1/4, 1/4, 1/4],
          0,
          1/4,
        ],
        expectedErrorMessage: 'Values must have a sum of 1',
      },
      {
        args: [
          [1/4, 1/4, 1/4, 1/4],
          5,
          1/4,
        ],
        expectedErrorMessage: 'Index out of bounds',
      },
      {
        args: [
          [1/4, 1/4, 1/4, 1/4],
          -1,
          1/4,
        ],
        expectedErrorMessage: 'Index out of bounds',
      },
      {
        args: [
          [1/4, 1/4, 1/4, 1/4],
          1.5,
          1/4,
        ],
        expectedErrorMessage: 'Index must be an integer',
      },
      {
        args: [
          [1/4, 1/4, 1/4, 1/4],
          0,
          1.0001,
        ],
        expectedErrorMessage: 'New value must be between 0 and 1',
      },
    ].forEach(({args, expectedErrorMessage}) => {
      test(`should throw: ${expectedErrorMessage}`, () => {
        expect(() => percentageDistribution(...args))
          .toThrowError(expectedErrorMessage)
      })
    })
  })

  describe('valid input', () => {
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
      [
        ['2/41', '3/41', '5/41', '7/41', '11/41', '13/41'],
        0,
        '37/53',
      ],
    ].forEach(([values, index, newValue]) =>  {
      test(
        `percentageDistribution([${values.join(', ')}], ${index}, ${newValue})`,
        () => {
          const numericNewValue = fractionStringToNumber(newValue)
          const numericValues = values.map(fractionStringToNumber)

          const result = percentageDistribution(
            numericValues,
            index,
            numericNewValue,
          )

          expect(result[index]).toBe(numericNewValue)
          expect(_.sum(result)).toBeCloseTo(1, 10)

          // Compute the previous/new value ratios excluding the item at index
          const uniqueRatios = _(numericValues)
            .zipWith(result, (a, b) => a / b)
            // The invariant doesn't apply for the value at index, so we remove it
            .omit(index)
            // omit resolves with an object, so we need to convert it back to array
            .values()
            // There could be slight differences for the same ratios, due to
            // precision issues, so we round the values to a pretty high precision
            .map(x => _.round(x, 10))
            // All the ratios should be the same, so after deduplicating...
            .uniq()
            .value()

          // All ratios of old to new values should be the same,
          // except for the values at index
          expect(uniqueRatios).toHaveLength(1)
        }
      )
    })
  })
})
