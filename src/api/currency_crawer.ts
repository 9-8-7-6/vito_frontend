type CurrencyMap = Record<string, number>

export async function currencyScraper(codes: string[]): Promise<CurrencyMap> {
  const targetUrl =
    'https://www.cathaybk.com.tw/cathaybk/personal/product/deposit/currency-billboard/'
  const corsProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(targetUrl)

  try {
    const response = await fetch(corsProxyUrl)
    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const selects = doc.querySelectorAll('select[data-exchange-currency]')
    const select = selects[1] || selects[0]

    if (!select) {
      console.error('[currencyScraper] ERROR: <select data-exchange-currency> not found')
      return {}
    }

    const result: CurrencyMap = {}

    const options = select.querySelectorAll('option')
    options.forEach((option) => {
      const code = option.getAttribute('value') ?? ''
      const buy = option.getAttribute('data-buy') ?? ''
      if (codes.includes(code) && buy !== '') {
        const value = parseFloat(buy)
        if (!isNaN(value)) {
          result[code] = value
        }
      }
    })
    console.log('result', result)
    return result
  } catch (error) {
    console.error('[currencyScraper] Fetch error:', error)
    return {}
  }
}
