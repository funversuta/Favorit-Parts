const EMPTY_GUID = '00000000-0000-0000-0000-000000000000'

export function isEmptyGoods(goods) {
  if (!Array.isArray(goods) || goods.length !== 1) return false

  const item = goods[0]
  if (!item || typeof item !== 'object') return true

  const goodsID = String(item.goodsID || '').toLowerCase()
  if (goodsID === EMPTY_GUID) return true

  return !item.brand && !item.number
}
