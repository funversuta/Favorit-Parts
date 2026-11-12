import { useSelector } from 'react-redux'
import SearchForm from './components/SearchForm'
import BrandSelect from './components/BrandSelect'
import OffersTable from './components/OffersTable'

export default function App() {
  const { status, error, selectedBrand } = useSelector((state) => state.search)

  return (
    <div className="app-shell">
      <h1 className="app-brand">Favorit Parts</h1>
      <p className="app-lead">Поиск запчастей и аналогов по артикулу</p>

      <section className="glass glass-panel">
        <SearchForm />
        <BrandSelect />
        {status === 'loading' && (
          <p className="app-status">
            {selectedBrand ? 'Загрузка предложений…' : 'Загрузка производителей…'}
          </p>
        )}
        {error && <div className="alert app-alert">{error}</div>}
      </section>

      <OffersTable />
    </div>
  )
}
