import test from 'ava'
import { getType } from './type.js'

test('getType returns the right type', t => {
  t.plan(10)
  t.is(getType(true), 'boolean', 'true is a boolean')
  t.is(getType(false), 'boolean', 'false is a boolean')
  t.is(getType('hello'), 'string', 'hello is a string')
  t.is(getType(1), 'number', '1 is a number')
  t.is(getType([1, 2, 3]), 'array', '[1, 2, 3] is an array')
  t.is(getType({}), 'object', '{} is an object')
  t.is(
    getType(Symbol('hello')),
    'symbol',
    'Symbol(\'hello\') is a symbol',
  )
  t.is(getType(null), 'null', 'null is null')
  t.is(getType(undefined), 'undefined', 'undefined is undefined')
  t.is(
    getType(1234567890123456789012345678901234567890n),
    'bigint',
    'bigint is a bigint',
  )
})
