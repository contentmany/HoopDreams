import React from 'react'

export type HairDef = {
  label: string
  render: (opts?: Record<string, unknown>) => JSX.Element
}

/** Keep ids stable for save data & tests */
export const hairSet = {
  dreads_short:  { label: 'Dreads (Short)',  render: () => <g data-hair="dreads_short" /> },
  dreads_medium: { label: 'Dreads (Medium)', render: () => <g data-hair="dreads_medium" /> },
  waves:         { label: 'Waves',           render: () => <g data-hair="waves" /> },
  buzz:          { label: 'Buzz',            render: () => <g data-hair="buzz" /> },
  afro:          { label: 'Afro',            render: () => <g data-hair="afro" /> },
} as const

export type HairId = keyof typeof hairSet
