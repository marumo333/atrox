import { describe, it, expect } from 'vitest'
import * as queries from '../queries/index'

describe('query exports', () => {
  it('exports episode queries', () => {
    expect(queries.getPublishedEpisodes).toBeTypeOf('function')
    expect(queries.getEpisodeByNumber).toBeTypeOf('function')
  })

  it('exports comment queries', () => {
    expect(queries.getTopComments).toBeTypeOf('function')
  })

  it('exports arc state queries', () => {
    expect(queries.getArcStateByArcId).toBeTypeOf('function')
  })

  it('exports agent queue queries', () => {
    expect(queries.getPendingJob).toBeTypeOf('function')
    expect(queries.updateJobStatus).toBeTypeOf('function')
    expect(queries.enqueueNextJob).toBeTypeOf('function')
  })
})
