import { describe, expect, it } from "vitest"
import { buildSetClause } from "../../../utils/buildSetClause.js"

describe('buildSetClause', () => {
  
  const changes = { workspaceName: 'Estudos', colorPalette: 'purple', description: null }

  const colunmMap = {
    workspaceName: 'workspace_name',
    colorPalette: 'color_palette',
    description: 'description'
  }

  it('retorna os campos e os valores preservando valores NULL', () => {
    expect(
      buildSetClause(changes, colunmMap, 1)
    ).toEqual({
      "assignments": [
        "workspace_name = $1",
        "color_palette = $2",
        "description = $3",
      ],
      "values": [
        "Estudos",
        "purple",
        null,
      ],
    })
  })

  it('a ordem do columnMap determina a ordem da saida', () => {
    expect(
      buildSetClause(
        changes, 
        {
          colorPalette: 'color_palette',
          workspaceName: 'workspace_name',
          description: 'description'
        }, 
        1)
    ).toEqual({
      "assignments": [
        "color_palette = $1",
        "workspace_name = $2",
        "description = $3",
      ],
      "values": [
        "purple",
        "Estudos",
        null,
      ],
    })
  })

  it('ignora campos que não estão no colunmMap', () => {
    expect(
      buildSetClause(
        { workspaceName: 'Estudos', colorPalette: 'purple', description: null, lifes: 6 },
        colunmMap as any,
        1)
    ).toEqual({
      "assignments": [
        "workspace_name = $1",
        "color_palette = $2",
        "description = $3",
      ],
      "values": [
        "Estudos",
        "purple",
        null,
      ],
    })
  })
})