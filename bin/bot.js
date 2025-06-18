import { setTimeout } from 'node:timers/promises'
import { sampleRetrieval } from '../index.js'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'

const {
  PROXY_URL,
  CDN_URL = 'https://3rkdb89wnwzj3f2i7hnvuyna5vn7glk9vf3igtht9x6ejmboly.walcdn.io',
  DELAY = 1_000,
} = process.env

while (true) {
  const suiRpcUrl = getFullnodeUrl('mainnet')
  const suiClient = new SuiClient({ url: suiRpcUrl })
  await sampleRetrieval({
    PROXY_URL,
    CDN_URL,
    suiClient,
  })
  console.log('\n')
  await setTimeout(Number(DELAY))
}
