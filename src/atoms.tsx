import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { ToolType } from './types'

export const displayTypeAtom = atomWithStorage<'gif' | 'image'>(
  'display-type',
  'gif'
)
export const selectedToolAtom = atom<ToolType | null>(null)
