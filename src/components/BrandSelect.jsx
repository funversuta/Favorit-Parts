import { useDispatch, useSelector } from 'react-redux'
import { clearOffers, searchOffers } from '../store/searchSlice'

export default function BrandSelect() {
  const dispatch = useDispatch()
  const { brands, selectedBrand, status } = useSelector((state) => state.search)
  const loading = status === 'loading'

  if (!brands.length) return null

  return (
    <div className="mt-3 mb-0">
      <label className="form-label">Производитель</label>
      <select
        className="form-select"
        value={selectedBrand}
        disabled={loading}
        onChange={(e) => {
          const brand = e.target.value
          if (!brand) {
            dispatch(clearOffers())
            return
          }
          dispatch(searchOffers(brand))
        }}
      >
        <option value="">Выберите бренд</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>
  )
}
