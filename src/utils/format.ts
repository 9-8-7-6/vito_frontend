import dayjs from 'dayjs'

export function formatFieldDate<T>(data: T[], field: keyof T, format = 'YYYY-MM-DD HH:mm'): T[] {
  return data.map((item) => ({
    ...item,
    [field]: dayjs(item[field] as string).format(format),
  }))
}
