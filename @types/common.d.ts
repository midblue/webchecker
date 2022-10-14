type CoordinatePair = [number, number]
interface SanitizeResult {
  result: string
  ok: boolean
  message?: string
}
interface CheckerData {
  url: string
  mainElement: string
  qualifyingSelector?: string
  compareSelector: string
  lastChecked: number
  lastValue: string | null
  onChangeOutputSelectorsContent: string[]
  lastOutput?: string
  watchers: string[]
}
