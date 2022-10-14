import * as c from '../../common'
import { Request, Router } from 'express'
import {
  addOrUpdateChecker,
  getAllCheckers,
  getChecker,
  removeChecker,
} from '../../db/fancy'

const router = Router()

router.get('/', async (req, res) => {
  res.send(await getAllCheckers())
})

router.get('/add', async (req, res) => {
  res.send(/* html */ `
    <form action="/api/checkers/add" method="post">
      <input type="text" name="url" placeholder="Url" />
      <input type="text" name="mainElement" placeholder="Main Element Selector" />
      <input type="text" name="qualifyingSelector" placeholder="Qualifying Selector" />
      <input type="text" name="compareSelector" placeholder="Compare Selector" />
      <input type="text" name="onChangeOutputSelectorsContent" placeholder="On Change, Output Selectors Content (comma separated)" />
      <input type="text" name="watchers" placeholder="Watchers (comma separated)" />
      <button type="submit">Add</button>
    </form>
    `)
})

router.post('/add', async (req, res) => {
  const url = req.query.url as string
  const mainElement = req.query.mainElement as string
  const qualifyingSelector = req.query
    .qualifyingSelector as string
  const compareSelector = req.query
    .compareSelector as string
  const onChangeOutputSelectorsContent =
    (req.query.onChangeOutputSelectorsContent as string)
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s) || []
  const watchers =
    (req.query.watchers as string)
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s) || []

  if (!watchers?.length) {
    res.status(400).send('No watchers')
    return
  }
  if (!url || !mainElement || !compareSelector) {
    res.status(400).send('Missing url or selector')
    return
  }
  if (!onChangeOutputSelectorsContent?.length) {
    res
      .status(400)
      .send('No onChangeOutputSelectorsContent')
    return
  }

  await addOrUpdateChecker({
    url,
    mainElement,
    qualifyingSelector,
    compareSelector,
    onChangeOutputSelectorsContent,
    lastChecked: 0,
    lastValue: null,
    watchers,
  })
  res.send('OK')
})

router.get('/:url', async (req, res) => {
  const url = decodeURIComponent(req.params.url)
  res.send((await getChecker(url))?.lastOutput)
})

router.get('/remove/:url', async (req, res) => {
  const url = decodeURIComponent(req.params.url)
  removeChecker(url)
})

export default router
