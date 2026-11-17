import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NotFoundError, ValidationError } from '../../../utils/errors.js'
import * as repository from '../../../routes/v1/modules/workspaces/workspaces.repository.js'
import { updateWorkspace } from "../../../routes/v1/modules/workspaces/workspaces.service.js";

vi.mock('../../../routes/v1/modules/workspaces/workspaces.repository.js')

describe('updateWorkspace', () => {
  beforeEach(() =>  {
    vi.clearAllMocks()
  })

  it('retorna os campos atualizados', async () => {
    
    vi.mocked(repository.getWorkspaceData).mockResolvedValue({
      workspaceName: 'fds',
      colorPalette: 'blue',
      zoom: 1,
      cameraX: 0,
      cameraY: 0,
      isEditMode: true,
    })

    vi.mocked(repository.updateWorkspace).mockResolvedValue({
      colorPalette: 'black',
      workspaceName: 'Claudio'
    })

    const result = await updateWorkspace('fds', 'fds', {
      colorPalette:'black', workspaceName:'Claudio'
    })

    expect(result).toEqual({
      colorPalette: 'black',
      workspaceName: 'Claudio'
    })
  })

  it('retorna erro NOT_FOUND quando não é encontrado dados compativeis com o workspace', async () => {
    
    vi.mocked(repository.getWorkspaceData).mockResolvedValue(undefined)

    await expect(updateWorkspace('fds', 'fds', {
      colorPalette:'black', workspaceName:'Claudio'
    })).rejects.toThrow(NotFoundError)
    expect(repository.updateWorkspace).not.toHaveBeenCalled()
  })

  it('retorna quando ambos os dados a serem atualizados são os mesmos que ja estão no banco', async () => {
    
    vi.mocked(repository.getWorkspaceData).mockResolvedValue({
      workspaceName: 'claudio',
      colorPalette: 'black',
      zoom: 1,
      cameraX: 0,
      cameraY: 0,
      isEditMode: true,
    })

    await expect(updateWorkspace(
      'fds',
      'fds', 
      {
        workspaceName:'claudio',
        colorPalette:'black', 
      }
    ))

    expect(repository.updateWorkspace).not.toHaveBeenCalled()
  })

  it('retorna erro NOT_FOUND quando repository não retorna os dados esperados depois do update', async () => {
    
    vi.mocked(repository.getWorkspaceData).mockResolvedValue({
      workspaceName: 'fds',
      colorPalette: 'blue',
      zoom: 1,
      cameraX: 0,
      cameraY: 0,
      isEditMode: true,
    })

    vi.mocked(repository.updateWorkspace).mockResolvedValue(undefined)

    await expect(updateWorkspace('fds', 'fds', {
      colorPalette:'black', workspaceName:'Claudio'
    })).rejects.toThrow(NotFoundError)
  })

  it('retorna corretamente quando é feita apenas a atualização de um campo', async () => {
    
    vi.mocked(repository.getWorkspaceData).mockResolvedValue({
      workspaceName: 'fds',
      colorPalette: 'blue',
      zoom: 1,
      cameraX: 0,
      cameraY: 0,
      isEditMode: true,
    })

    vi.mocked(repository.updateWorkspace).mockResolvedValue({
      colorPalette: 'blue',
      workspaceName: 'Claudio'
    })

    const result = await updateWorkspace('fds', 'fds', {
      colorPalette:'black', workspaceName:'Claudio'
    })

    expect(result).toEqual({
      colorPalette: 'blue',
      workspaceName: 'Claudio'
    })
  })
})