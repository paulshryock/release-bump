/**
 * Get data type.
 *
 * @param  {mixed}  data The data of any type.
 * @return {string}      The data type.
 * @since  2.2.0
 */
export function getType (data) {
  return Object.prototype.toString.call(data)
    .slice(8, -1).toLowerCase()
}
