const pageResults = require('graph-results-pager');

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints, chefAddress } = require('./../constants')
const { timestampToBlock } = require('./../utils');

module.exports = {
    async info({block = undefined, timestamp = undefined} = {}) {
        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.masterchef,
            gql`{
                    masterChef(id: "${chefAddress}", ${block}) {
                        ${info.properties.toString()}
                    }
                }`
        );

        return info.callback(result.masterChef);
    },

    async pool({block = undefined, timestamp = undefined, pool_id = undefined, pool_address = undefined} = {}) {
        if(!pool_id && !pool_address) { throw new Error("sushi-data: Pool ID / Address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        let result;
        if(pool_id) {
            result = await request(graphAPIEndpoints.masterchef,
                gql`{
                        pool(id: ${pool_id}, ${block}) {
                            ${pools.properties.toString()}
                        }
                    }`
            );
        }

        else {
            result = await request(graphAPIEndpoints.masterchef,
                gql`{
                        pools(first: 1, where: {pair: "${pool_address.toLowerCase()}"}, ${block}) {
                            ${pools.properties.toString()}
                        }
                    }`
            );
        }

        return pools.callback(pool_id ? [result.pool] : result.pools)[0];
    },

    async pools({block = undefined, timestamp = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.masterchef,
            query: {
                entity: 'pools',
                selection: {
                    orderBy: 'id',
                    block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
                },
                properties: pools.properties
            }
        })
            .then(results => pools.callback(results))
            .catch(err => console.log(err));
    },

    async stakedValue({block = undefined, timestamp = undefined, token_address = undefined} = {}) {
        if(!token_address) { throw new Error("sushi-data: Token address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.exchange,
            gql`{
                    liquidityPosition(id: "${token_address.toLowerCase()}-${chefAddress}", ${block}) {
                        ${stakedValue.properties.toString()}
                    }
                }`
        );

        return stakedValue.callback(result.liquidityPosition);
    },

    async user({block = undefined, timestamp = undefined, user_address = undefined} = {}) {
        if(!user_address) { throw new Error("sushi-data: User address undefined"); }

        return pageResults({
            api: graphAPIEndpoints.masterchef,
            query: {
                entity: 'users',
                selection: {
                    where: {
                        address: `\\"${user_address}\\"`
                    },
                    block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
                },
                properties: user.properties
            }
        })
            .then(results => user.callback(results))
            .catch(err => console.log(err));
    }
}

const info = {
    properties: [
        'bonusMultiplier',
        'bonusEndBlock',
        'devaddr',
        'migrator',
        'owner',
        'startBlock',
        'sushi',
        'sushiPerBlock',
        'totalAllocPoint',
        'poolCount',
        'slpBalance',
        'slpAge',
        'slpAgeRemoved',
        'slpDeposited',
        'slpWithdrawn',
        'updatedAt'
    ],

    callback(results) {
        return ({
            bonusMultiplier: Number(results.bonusMultiplier),
            bonusEndBlock: Number(results.bonusEndBlock),
            devaddr: results.devaddr,
            migrator: results.migrator,
            owner: results.owner,
            startBlock: Number(results.startBlock),
            sushiPerBlock: results.sushiPerBlock / 1e18,
            totalAllocPoint: Number(results.totalAllocPoint),
            poolCount: Number(results.poolCount),
            slpBalance: Number(results.slpBalance),
            slpAge: Number(results.slpAge),
            slpAgeRemoved: Number(results.slpAgeRemoved),
            slpDeposited: Number(results.slpDeposited),
            slpWithdrawn: Number(results.slpWithdrawn),
            updatedAt: Number(results.updatedAt)
        });
    }
};

const pools = {
    properties: [
        'id',
        'pair',
        'allocPoint',
        'lastRewardBlock',
        'accSushiPerShare',
        'balance',
        'userCount',
        'slpBalance',
        'slpAge',
        'slpAgeRemoved',
        'slpDeposited',
        'slpWithdrawn',
        'timestamp',
        'block',
        'updatedAt',
        'entryUSD',
        'exitUSD',
        'sushiHarvested',
        'sushiHarvestedUSD'
    ],

    callback(results) {
        return results.map(({ id, pair, allocPoint, lastRewardBlock, accSushiPerShare, balance, userCount, slpBalance, slpAge, slpAgeRemoved, slpDeposited, slpWithdrawn, timestamp, block, updatedAt, entryUSD, exitUSD, sushiHarvested, sushiHarvestedUSD }) => ({
            id: Number(id),
            pair: pair,
            allocPoint: Number(allocPoint),
            lastRewardBlock: Number(lastRewardBlock),
            accSushiPerShare: accSushiPerShare / 1e18,
            userCount: Number(userCount),
            slpBalance: Number(slpBalance),
            slpAge: Number(slpAge),
            slpAgeRemoved: Number(slpAgeRemoved),
            slpDeposited: Number(slpDeposited),
            slpWithdrawn: Number(slpWithdrawn),
            addedTs: Number(timestamp),
            addedDate: new Date(timestamp * 1000),
            addedBlock: Number(block),
            lastUpdatedTs: Number(updatedAt),
            lastUpdatedDate: new Date(updatedAt * 1000),
            entryUSD: Number(entryUSD),
            exitUSD: Number(exitUSD),
            sushiHarvested: Number(sushiHarvested),
            sushiHarvestedUSD: Number(sushiHarvestedUSD)
         }));
    }
};

const stakedValue = {
    properties: [
        'id',
        'liquidityTokenBalance',
        'pair { id, totalSupply, reserveETH, reserveUSD }'
    ],

    callback(results) {
        return ({
            id: results.id,
            liquidityTokenBalance: Number(results.liquidityTokenBalance),
            totalSupply: Number(results.pair.totalSupply),
            totalValueETH: Number(results.pair.reserveETH),
            totalValueUSD: Number(results.pair.reserveUSD)
        })
    }
};

const user = {
    properties: [
        'id',
        'address',
        'pool { id, pair, balance, accSushiPerShare, lastRewardBlock }',
        'amount',
        'rewardDebt',
        'entryUSD',
        'exitUSD',
        'sushiAtLockup',
        'sushiHarvested',
        'sushiHarvestedUSD',
        'sushiHarvestedSinceLockup',
        'sushiHarvestedSinceLockupUSD',
    ],

    callback(results) {
        return results.map(entry => ({
            id: entry.id,
            address: entry.address,
            pool: {
                id: entry.pool.id,
                pair: entry.pool.pair,
                balance: Number(entry.pool.balance),
                accSushiPerShare: Number(entry.pool.accSushiPerShare),
                lastRewardBlock: Number(entry.pool.lastRewardBlock)
            },
            amount: Number(entry.amount),
            rewardDebt: Number(entry.rewardDebt),
            entryUSD: Number(entry.entryUSD),
            exitUSD: Number(entry.exitUSD),
            sushiAtLockup: Number(entry.sushiAtLockup),
            sushiHarvested: Number(entry.sushiHarvested),
            sushiHarvestedUSD: Number(entry.sushiHarvestedUSD),
            sushiHarvestedSinceLockup: Number(entry.sushiHarvestedSinceLockup),
            sushiHarvestedSinceLockupUSD: Number(entry.sushiHarvestedSinceLockupUSD)
        }));
    }
};