function rowsFromItem(item) {
  if (!item || typeof item !== 'object') return []

  const base = {
    goodsID: item.goodsID || '',
    brand: item.brand || '',
    number: item.number || '',
    name: item.name || '',
  }
  const warehouses = Array.isArray(item.warehouses) ? item.warehouses : []

  if (warehouses.length === 0) {
    return [
      {
        ...base,
        price: null,
        stock: Number(item.count) || 0,
        warehouseId: null,
        warehouseCode: null,
        shipmentDate: null,
      },
    ]
  }

  return warehouses.map((wh) => ({
    ...base,
    price: wh?.price ?? null,
    stock: Number(wh?.stock) || 0,
    warehouseId: wh?.id ?? null,
    warehouseCode: wh?.code ?? null,
    shipmentDate: wh?.shipmentDate ?? null,
  }))
}

export function mapOffers(goods) {
  if (!Array.isArray(goods) || goods.length === 0) return []

  const main = goods[0]
  const rows = rowsFromItem(main)
  const analogues = Array.isArray(main?.analogues) ? main.analogues : []

  for (let i = 0; i < analogues.length; i++) {
    const itemRows = rowsFromItem(analogues[i])
    for (let j = 0; j < itemRows.length; j++) {
      rows.push(itemRows[j])
    }
  }

  return rows
}
