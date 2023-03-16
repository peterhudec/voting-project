import { toBeDeepCloseTo,toMatchCloseTo } from 'jest-matcher-deep-close-to'

import { percentageDistribution } from './percentageDistribution'

// Allow comparing numbers in deep data structures with flexible precision
expect.extend({toBeDeepCloseTo, toMatchCloseTo})

const fractionStringToNumber = eval

describe('percentageDistribution', () => {
  describe('uniform distribution', () => {
    ;[
      {
        args: [
          ['1/2', '1/2'],
          0,
          '1/4',
        ],
        expected: ['1/4', '3/4']
      },
      {
        args: [
          ['1/2', '1/2'],
          0,
          '1/7',
        ],
        expected: ['1/7', '6/7']
      },
      {
        args: [
          ['1/3', '1/3', '1/3'],
          0,
          '1/2',
        ],
        expected: ['1/2', '1/2/2', '1/2/2']
      },
      {
        args: [
          ['1/4', '1/4', '1/4', '1/4'],
          0,
          '1/2',
        ],
        expected: ['1/2', '1/2/3', '1/2/3', '1/2/3'],
      },
      {
        args: [
          ['1/4', '1/4', '1/4', '1/4'],
          2,
          '1/2',
        ],
        expected: ['1/2/3', '1/2/3', '1/2', '1/2/3'],
      },
    ].forEach(({args: [values, index, newValue], expected}) => {
      test(`percentageDistribution([${values.join(', ')}], ${index}, ${newValue})`, () => {
        const result = percentageDistribution(
          values.map(fractionStringToNumber),
          index,
          fractionStringToNumber(newValue),
        )

        expect(result).toBeDeepCloseTo(expected.map(fractionStringToNumber), 10)
      })
    })
  })

  describe('non uniform distribution', () => {
    // TODO: Can this test be generalized?
    test('foo', () => {
      const values = [
        '1/2',
        '1/4',
        '1/8',
        '1/8',
      ].map(fractionStringToNumber)
      const result = percentageDistribution(
        values,
        2,
        1/3,
      )
      expect(result[2]).toBe(1/3)
      // Result should sum to 1
      expect(result.reduce((a, x) => a + x, 0)).toBeCloseTo(1, 10)

      // The other values should be in same proportion to each other
      expect(values[0] / result[0]).toBe(values[1] / result[1])
      expect(values[1] / result[1]).toBe(values[3] / result[3])
      expect(values[3] / result[3]).toBe(values[0] / result[0])

      expect(values[0] / values[1]).toBe(result[0] / result[1])
      expect(values[1] / values[3]).toBe(result[1] / result[3])
      expect(values[3] / values[0]).toBe(result[3] / result[0])
    })
  })
})