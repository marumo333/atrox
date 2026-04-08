import Anthropic from '@anthropic-ai/sdk'

function getApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY が設定されていません')
  return key
}

let clientInstance: Anthropic | null = null

function getClient(): Anthropic {
  if (!clientInstance) {
    clientInstance = new Anthropic({ apiKey: getApiKey() })
  }
  return clientInstance
}

export async function generateEpisodeText(prompt: string): Promise<string> {
  const client = getClient()

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (!content || content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API')
  }

  return content.text
}
