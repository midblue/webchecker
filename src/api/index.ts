import * as c from '../common'
import express from 'express'

const app = express()
app.use(express.json())

const subdirectory = c.baseSubdirectory

export const serverRunningSince = Date.now()

app.get(`/${subdirectory}`, (req, res) => {
  res.send('Hello World!')
})

import cr from './routes/checkers'
app.use(`/${subdirectory}/checkers`, cr)

const port = 4455
app.listen(port, () => {
  c.log(
    'green',
    `api listening on http://localhost:${port}/${subdirectory}`,
  )
})
