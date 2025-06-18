import { assertOkResponse } from 'assert-ok-response'
import { pickRandomNumber } from './random.js'
import { HttpsProxyAgent } from 'https-proxy-agent'

/**
 * @typedef {{
 *   blobId: string
 *   blobIdBase64: string
 *   objectId: string
 *   status: string
 *   startEpoch: number
 *   endEpoch: number
 *   size: number
 *   timestamp: number
 * }} Blob
 */

/**
 * @typedef {{
 *   content: Blob[]
 *   totalPages: number
 * }} WalrusScanResponse
 */

/**
 * Returns a list of active certified blob Base64 IDs.
 *
 * @param {number} activeEpoch Active Walrus epoch.
 * @param {string} [proxyUrl] Optional proxy URL to fetch blobs through.
 * @returns {Promise<string[]>} A list of recent blob Base64 IDs.
 */
export const getBlobs = async (activeEpoch, proxyUrl) => {
  const recentBlobsResponse = await fetchBlobs(0, proxyUrl)
  const recentBlobs = getActiveCertifiedBlobIds(
    activeEpoch,
    recentBlobsResponse.content,
  )
  const randomPage = pickRandomNumber(1, recentBlobsResponse.totalPages)
  const randomPageBlobResponse = await fetchBlobs(randomPage, proxyUrl)
  const randomBlobs = getActiveCertifiedBlobIds(
    activeEpoch,
    randomPageBlobResponse.content,
  )

  return [...recentBlobs, ...randomBlobs]
}

/**
 * Filters active certified blobs and returns their Base64 IDs.
 *
 * A blob is considered active if its start epoch is less than or equal to the
 * active epoch and its end epoch is greater than the active epoch.
 *
 * @param {number} activeEpoch
 * @param {Blob[]} blobs
 * @returns {string[]}
 */
const getActiveCertifiedBlobIds = (activeEpoch, blobs) =>
  blobs
    .filter(
      (blob) =>
        blob.startEpoch <= activeEpoch &&
        blob.endEpoch > activeEpoch &&
        blob.status === 'Certified',
    )
    .map((blob) => blob.blobIdBase64)

/**
 * Fetches blobs from the WalrusScan API.
 *
 * @param {number} page
 * @param {string} [proxyUrl] Optional proxy URL to fetch blobs through.
 * @returns {Promise<WalrusScanResponse>}
 */
const fetchBlobs = async (page, proxyUrl) => {
  const apiUrl = `https://walruscan.com/api/walscan-backend/mainnet/api/blobs?page=${page}&sortBy=TIMESTAMP&orderBy=DESC&searchStr=&size=20`
  const options = proxyUrl ? { agent: new HttpsProxyAgent(proxyUrl) } : {}
  const res = await fetch(apiUrl, options)
  await assertOkResponse(res, 'Failed to retrieve recent blobs')
  return await res.json()
}
