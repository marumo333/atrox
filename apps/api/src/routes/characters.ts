import { Hono } from 'hono'

export const charactersRouter = new Hono()

charactersRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')

  // TODO: wire up db query
  return c.json({ character: null, slug })
})
