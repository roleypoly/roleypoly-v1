const areduce = async <T, V> (
  array: T[], 
  predicate: (acc: V[], val: T) => Promise<V[]>, 
  acc: undefined | V[] = []
): Promise<Array<V>> => {
  for (let i of array) {
    acc = await predicate(acc, i)
  }

  return acc
}

export default areduce
