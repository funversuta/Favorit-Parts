import { useSelector } from 'react-redux'

function formatPrice(price) {
  if (price == null || price === '') return '—'
  return Number(price).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function OffersTable() {
  const { results, selectedBrand, status, error } = useSelector((state) => state.search)

  if (!selectedBrand || status === 'loading' || error) return null
  if (!results.length) {
    return (
      <section className="glass glass-panel">
        <p className="empty-note">Нет предложений по выбранному производителю</p>
      </section>
    )
  }

  return (
    <section className="glass glass-panel">
      <p className="offers-meta">Предложений: {results.length}</p>
      <div className="table-responsive">
        <table className="table table-sm table-striped table-hover align-middle table-glass">
          <thead>
            <tr>
              <th>Производитель</th>
              <th>Артикул</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Остаток</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={`${row.goodsID || row.brand}-${row.warehouseId || i}`}>
                <td>{row.brand}</td>
                <td>{row.number}</td>
                <td className="name-cell">{row.name}</td>
                <td className="price-cell">{formatPrice(row.price)}</td>
                <td className="stock-cell">{row.stock ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
