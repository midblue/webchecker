import * as c from '../common'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dbPath = path.join(__dirname, 'db.json')

export async function getAllCheckers(): Promise<
  CheckerData[]
> {
  try {
    const data = await readFile(dbPath, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    console.log(e)
    await writeFile(dbPath, '[]')
    return []
  }
}
export async function getChecker(
  url: string,
): Promise<CheckerData | null> {
  const checkers = await getAllCheckers()
  return checkers.find((c) => c.url === url) || null
}

export async function addOrUpdateChecker(
  data: CheckerData,
) {
  const checkers = await getAllCheckers()
  const index = checkers.findIndex(
    (c) => c.url === data.url,
  )
  if (index === -1) checkers.push(data)
  else checkers[index] = data
  await writeFile(dbPath, JSON.stringify(checkers))
}

export async function removeChecker(url: string) {
  const checkers = await getAllCheckers()
  const index = checkers.findIndex((c) => c.url === url)
  if (index !== -1) checkers.splice(index, 1)
  await writeFile(dbPath, JSON.stringify(checkers))
}
