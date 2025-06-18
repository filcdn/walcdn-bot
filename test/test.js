import { it } from 'node:test'
import { getBlobs } from '../blobs.js'

it('works', () => {
  // no-op
})

it('getBlobs returns an array of blob IDs', async () => {
  // This is a smoke test, not a full mock. It will hit the real API.
  const epoch = 0 // Use 0 for earliest, or a recent epoch for more realistic test
  const blobs = await getBlobs(epoch)
  if (!Array.isArray(blobs)) throw new Error('Expected array')
  if (blobs.length === 0) throw new Error('Expected at least one blob ID')
  if (typeof blobs[0] !== 'string') {
    throw new Error('Expected blob ID to be a string')
  }
})
