import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchPrice } from '../api/favoritApi'
import { isEmptyGoods } from '../utils/isEmptyGoods'
import { mapOffers } from '../utils/mapOffers'

const initialState = {
  article: '',
  searchedArticle: '',
  brands: [],
  selectedBrand: '',
  results: [],
  status: 'idle',
  error: null,
}

export const searchBrands = createAsyncThunk(
  'search/searchBrands',
  async (number, { rejectWithValue, signal }) => {
    const trimmed = String(number || '').trim()
    if (!trimmed) {
      return rejectWithValue('Введите артикул')
    }

    try {
      const data = await fetchPrice({ number: trimmed, signal })

      if (isEmptyGoods(data.goods)) {
        return rejectWithValue('Товар не найден')
      }

      const brands = [
        ...new Set(
          (data.goods || [])
            .map((item) => item.brand)
            .filter((brand) => Boolean(brand && String(brand).trim())),
        ),
      ]

      if (!brands.length) {
        return rejectWithValue('Товар не найден')
      }

      return { article: trimmed, brands }
    } catch (err) {
      if (err?.name === 'AbortError') throw err
      return rejectWithValue(err.message || 'Ошибка запроса')
    }
  },
)

export const searchOffers = createAsyncThunk(
  'search/searchOffers',
  async (brand, { getState, rejectWithValue, signal }) => {
    const trimmedBrand = String(brand || '').trim()
    if (!trimmedBrand) {
      return rejectWithValue('Выберите производителя')
    }

    const article = String(getState().search.searchedArticle || '').trim()
    if (!article) {
      return rejectWithValue('Введите артикул')
    }

    try {
      const data = await fetchPrice({
        number: article,
        brand: trimmedBrand,
        analogues: 'on',
        signal,
      })

      if (!data.goods?.length || isEmptyGoods(data.goods)) {
        return rejectWithValue('Товар не найден')
      }

      return {
        brand: trimmedBrand,
        results: mapOffers(data.goods),
      }
    } catch (err) {
      if (err?.name === 'AbortError') throw err
      return rejectWithValue(err.message || 'Ошибка запроса')
    }
  },
)

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setArticle(state, action) {
      state.article = action.payload
    },
    clearOffers(state) {
      state.selectedBrand = ''
      state.results = []
      state.error = null
      if (state.status === 'failed') {
        state.status = 'succeeded'
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBrands.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.brands = []
        state.selectedBrand = ''
        state.results = []
      })
      .addCase(searchBrands.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.article = action.payload.article
        state.searchedArticle = action.payload.article
        state.brands = action.payload.brands
        state.selectedBrand = ''
        state.results = []
        state.error = null
      })
      .addCase(searchBrands.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.status = 'failed'
        state.error = action.payload || 'Ошибка запроса'
        state.brands = []
        state.selectedBrand = ''
        state.results = []
        state.searchedArticle = ''
      })
      .addCase(searchOffers.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        state.selectedBrand = action.meta.arg
        state.results = []
      })
      .addCase(searchOffers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.selectedBrand = action.payload.brand
        state.results = action.payload.results
        state.error = null
      })
      .addCase(searchOffers.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.status = 'failed'
        state.error = action.payload || 'Ошибка запроса'
        state.selectedBrand = ''
        state.results = []
      })
  },
})

export const { setArticle, clearOffers } = searchSlice.actions

export default searchSlice.reducer
