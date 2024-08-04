export const getRandomStr = () => Math.random().toString(36).substring(2, 15)

export function traverseEnum<T>(
  enumType: T,
  callback: (value: T[keyof T]) => void
): void {
  // 获取所有枚举的值并过滤出数值类型的值
  const values = Object.values(enumType as object) as Array<T[keyof T]>

  // 遍历并对每个值执行回调函数
  values.forEach((value) => callback(value))
}
