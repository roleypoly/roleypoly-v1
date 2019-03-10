// @flow
export default async function<T, V> (array: Array<T>, predicate: (Array<V>, T) => Promise<Array<V>>, acc: Array<V>): Promise<Array<V>> {
  for (let i of array) {
    acc = await predicate(acc, i)
  }

  return acc
}
