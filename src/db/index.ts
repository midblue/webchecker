import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dbPath = path.join(__dirname, 'db.json')

export async function getSeenValuesForUrl(url: string) {
  try {
    const data = await readFile(dbPath, 'utf8')
    const seenValues = JSON.parse(data)
    return seenValues[url] || []
  } catch (e) {
    writeFile(dbPath, '{}')
    return []
  }
}

export async function urlHasSeen(
  url: string,
  value: string,
) {
  const seenValues = await getSeenValuesForUrl(url)
  return seenValues.includes(value)
}

export async function addSeenValueForUrl(
  url: string,
  seenValue: string,
) {
  let allData
  try {
    const data = await readFile(dbPath, 'utf8')
    allData = JSON.parse(data)
  } catch (e) {
    allData = {}
  }
  if (!allData[url]) allData[url] = []
  allData[url].push(seenValue)
  await writeFile(dbPath, JSON.stringify(allData))
}
