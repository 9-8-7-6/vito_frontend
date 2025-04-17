import dayjs from 'dayjs'

/**
 * Formats a specific date field in an array of objects using dayjs.
 *
 * @param data - The array of objects containing the date field to format.
 * @param field - The key of the date field that should be formatted.
 * @param format - The desired date format string (default: 'YYYY-MM-DD HH:mm').
 * @returns A new array of objects with the formatted date field.
 */
export function formatFieldDate<T>(data: T[], field: keyof T, format = 'YYYY-MM-DD HH:mm'): T[] {
  return data.map((item) => ({
    ...item,
    [field]: dayjs(item[field] as string).format(format), // Format the date string
  }))
}
