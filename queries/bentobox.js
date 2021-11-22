const pageResults = require('graph-results-pager')

const { request, gql } = require('graphql-request')

const { priceUSD: finaPriceUSD } = require('./fina')
const { token: tokenInfo } = require('./exchange')
const { ethPrice: ethPriceUSD } = require('./exchange')
const { info: finaMasterInfo } = require('./finamaster')
const { pool: chefPool } = require('./finamaster')
const { pools: chefPools } = require('./finamaster')

// accessed by chainId
const ENDPOINTS = {
  1: 'https://api.thegraph.com/subgraphs/name/finaswap/bentobox',
  250: 'https://api.thegraph.com/subgraphs/name/finaswap/fantom-bentobox',
  56: 'https://api.thegraph.com/subgraphs/name/finaswap/bsc-bentobox',
  137: 'https://api.thegraph.com/subgraphs/name/finaswap/matic-bentobox',
  100: 'https://api.thegraph.com/subgraphs/name/finaswap/xdai-bentobox',
}

const MASTER_CONTRACT = '0x2cba6ab6574646badc84f0544d05059e57a5dc42'

module.exports = {
  async clones({ masterAddress = undefined, chainId = undefined } = {}) {
    if(!masterAddress) { throw new Error("fina-data: Master Address undefined"); }
    if(!chainId) { throw new Error("fina-data: Chain Id undefined"); }

    return pageResults({
      api: ENDPOINTS[chainId],
      query: {
        entity: 'clones',
        selection: {
          where: {
            masterContract: `\\"${masterAddress.toLowerCase()}\\"`
          }
        },
        properties: clones.properties
      }
    })
      .then(results => clones.callback(results))
      .catch(err => console.log(err));
  },

  async kashiStakedInfo() {
    const results = await pageResults({
      api: ENDPOINTS[1],
      query: {
        entity: 'kashiPairs',
        properties: kashiStakedInfo.properties
      }
    })

    let result = {}
    result.finaUSD = await finaPriceUSD();
    result.ethUSD = await ethPriceUSD();

    let finaMaster = await finaMasterInfo();
    result.totalAP = finaMaster.totalAllocPoint;
    result.finaPerBlock = finaMaster.finaPerBlock;

    let pools = await chefPools();
    let onsen_pools = pools.map(pool => pool.pair)
    let filtered_results = results.filter(pair => onsen_pools.includes(pair.id))
    result.kashiPairs = filtered_results

    return kashiStakedInfo.callback(result)
  },

}

const clones = {
  properties: [
    'id',
    'data'
  ],

  callback(results) {
    return results.map(({ id, data, block, timestamp }) => ({
      address: id,
      data: data
    }));
  }
}

const kashiStakedInfo = {
  properties: [
    'id',
    'name',
    'symbol',
    'asset { id, symbol, decimals }',
    'collateral { id, symbol, decimals }',
    'totalAssetBase',
    'totalAssetElastic'
  ],

  async callback(results) {
    return await Promise.all(results.kashiPairs.map(async (result) => {
      let asset = await tokenInfo({ token_address: result.asset.id });
      let assetPool = await chefPool({ pool_address: result.id });
      if (assetPool === undefined) { return }
      let stakedAmt = assetPool.slpBalance * 1e18;
      let balanceUSD = (stakedAmt * asset.derivedETH * results.ethUSD) / (10 ** result.asset.decimals);
      let rewardPerBlock = ((1 / results.totalAP) * results.finaPerBlock);
      let roiPerBlock = (rewardPerBlock * results.finaUSD) / balanceUSD;
      let roiPerYear = roiPerBlock * 6500 * 365

      return {
        id: result.id,
        name: result.name,
        symbol: result.symbol,
        asset: result.asset.id,
        assetSymbol: result.asset.symbol,
        assetDecimals: Number(result.asset.decimals),
        collateral: result.collateral.id,
        collateralSymbol: result.collateral.symbol,
        collateralDecimals: Number(result.collateral.decimals),
        totalAssetBase: Number(result.totalAssetBase),
        totalAssetElastic: Number(result.totalAssetElastic),
        totalAssetStaked: Number(stakedAmt),
        assetDecimals: Number(result.asset.decimals),
        balanceUSD: balanceUSD,
        rewardPerBlock: rewardPerBlock,
        roiPerBlock: roiPerBlock,
        roiPerYear: roiPerYear
      }
    }));
  }
}
