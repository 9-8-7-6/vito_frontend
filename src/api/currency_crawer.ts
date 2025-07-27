/**
 * 匯率資料來源：
 * 本模組所取得之幣別及參考匯率資料，來源為國泰世華商業銀行股份有限公司官方網站
 * (https://www.cathaybk.com.tw/cathaybk/personal/product/deposit/currency-billboard/)
 *
 * 本程式僅用於技術學習或展示用途，非作為正式金融資訊之依據。
 * 所有匯率資料之版權及最終解釋權歸原網站所有。
 *
 * 若您為原網站管理者並希望我們停止引用資料，請透過項目頁面聯繫我們，我們將立即配合下架。
 */

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
    return result
  } catch (error) {
    console.error('[currencyScraper] Fetch error:', error)
    return {}
  }
}
