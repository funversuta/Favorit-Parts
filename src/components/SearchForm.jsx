import { useDispatch, useSelector } from 'react-redux'
import { setArticle, searchBrands } from '../store/searchSlice'

export default function SearchForm() {
  const dispatch = useDispatch()
  const { article, status } = useSelector((state) => state.search)
  const loading = status === 'loading'

  return (
    <form
      className="mb-0"
      onSubmit={(e) => {
        e.preventDefault()
        dispatch(searchBrands(article))
      }}
    >
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Артикул"
          value={article}
          disabled={loading}
          onChange={(e) => dispatch(setArticle(e.target.value))}
        />
        <button
          type="submit"
          className="btn btn-search"
          disabled={loading || !String(article || '').trim()}
        >
          {loading ? 'Поиск…' : 'Найти'}
        </button>
      </div>
    </form>
  )
}
