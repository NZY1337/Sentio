import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import useBuilderPrompt from '../useBuilderPrompt'
import type { EditableProjectProps } from '../../../src/types/project'

const Dummy = ({ builderState, setBuilderState }: { builderState: EditableProjectProps; setBuilderState: React.Dispatch<React.SetStateAction<EditableProjectProps>> }) => {
  const { handleClickCategory, handleGenerateBaseDesign, handlePromptChange } = useBuilderPrompt({ builderState, setBuilderState, setCharCount: () => {} })
  return (
    <div>
      <button onClick={() => handleClickCategory('TEST')}>cat</button>
      <button onClick={handleGenerateBaseDesign}>gen</button>
      <textarea onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlePromptChange(e)} data-testid="ta" />
    </div>
  )
}

describe('useBuilderPrompt', () => {
  it('appends category and generates base prompt', () => {
    const setBuilderState = vi.fn() as unknown as React.Dispatch<React.SetStateAction<EditableProjectProps>>
    const builderState = ({ prompt: '', images: [], category: { id: '1', label: 'c' }, outputFormat: 'PNG', quality: 'HIGH', size: '1024x1024', designTheme: 'MODERN', spaceType: 'LIVING_ROOM', n: 1 } as unknown) as EditableProjectProps
    const { getByText, getByTestId } = render(<Dummy builderState={builderState} setBuilderState={setBuilderState} />)

    getByText('cat').click()
    expect(setBuilderState).toHaveBeenCalled()

    getByText('gen').click()
    expect(setBuilderState).toHaveBeenCalled()

    const ta = getByTestId('ta') as HTMLTextAreaElement
    fireEvent.change(ta, { target: { value: 'hello' } })
    expect(setBuilderState).toHaveBeenCalled()
  })
})
