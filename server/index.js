import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env') })

const PORT = process.env.PORT || 3001
const FAVORIT_URL = 'https://api.favorit-parts.ru/hs/hsprice/'
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const app = express()
app.use(cors())

app.get('/api/price', async (req, res) => {
  const key = process.env.FAVORIT_API_KEY
  if (!key) {
    return res.status(500).json({ error: 'FAVORIT_API_KEY is not configured' })
  }

  const number = String(req.query.number || '').trim()
  const brand = req.query.brand != null ? String(req.query.brand).trim() : ''
  const analogues = req.query.analogues
  const info = req.query.info

  if (!number) {
    return res.status(400).json({ error: 'Empty number goods!' })
  }

  const params = new URLSearchParams()
  params.set('key', key)
  params.set('number', number)
  if (brand) params.set('brand', brand)
  if (analogues) params.set('analogues', String(analogues))
  if (info) params.set('info', String(info))

  try {
    const response = await fetch(`${FAVORIT_URL}?${params.toString()}`, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    })

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return res.status(502).json({ error: 'Invalid response from Favorit API' })
    }

    res.status(response.status).json(data)
  } catch (err) {
    res.status(502).json({ error: err.message || 'Network error' })
  }
})

app.listen(PORT, () => {
  console.log(`Proxy listening on http://localhost:${PORT}`)
})
