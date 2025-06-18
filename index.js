import { getBlobs } from './blobs.js'
import { pickRandomItem } from './random.js'
import { WALRUS_STATE_OBJECT_ID } from './constants.js'
/** @import {SuiClient} from '@mysten/sui/client' */

/**
 * @typedef {{
 *   getNextProofSetId(): Promise<BigInt>
 *   proofSetLive(setId: BigInt): Promise<Boolean>
 *   rootLive(setId: BigInt, rootId: BigInt): Promise<Boolean>
 *   getNextRootId(setId: BigInt): Promise<BigInt>
 *   getRootCid(setId: BigInt, rootId: BigInt): Promise<[string]>
 *   getProofSetOwner(setId: BigInt): Promise<[string, string]>
 * }} PdpVerifier
 */

/**
 * @param {object} args
 * @param {string} args.PROXY_URL
 * @param {string} args.CDN_URL
 * @param {SuiClient} args.suiClient
 */

export async function sampleRetrieval({ CDN_URL, PROXY_URL, suiClient }) {
  // @ts-ignore
  const activeEpoch = await getActiveWalrusEpoch(suiClient)
  const blobs = await getBlobs(activeEpoch, PROXY_URL)
  const randomBlob = await pickRandomItem(blobs)

  const url = `${CDN_URL}/${randomBlob}`
  console.log('Fetching', url)
  const res = await fetch(url)
  console.log('-> Status code:', res.status)
  if (!res.ok) {
    const reason = (await res.text()).trim()
    console.log(reason)
  } else if (res.body) {
    const reader = res.body.getReader()
    while (true) {
      const { done } = await reader.read()
      if (done) break
    }
  }
}

/**
 * Fetches the active Walrus epoch
 *
 * @param {SuiClient} client SUI client
 * @returns {Promise<number>} Current Walrus epoch
 */
const getActiveWalrusEpoch = async (client) => {
  const object = await client.getObject({
    id: WALRUS_STATE_OBJECT_ID,
    options: { showContent: true },
  })

  // @ts-ignore
  return object.data.content.fields.value.fields.epoch
}
