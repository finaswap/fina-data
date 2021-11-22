const ws = require('isomorphic-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws'); 

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints, graphWSEndpoints, barAddress } = require('./../constants')
const { timestampToBlock } = require('./../utils');

module.exports = {
    async info({block = undefined, timestamp = undefined} = {}) {
        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.bar,
            gql`{
                    bar(id: "${barAddress}", ${block}) {
                        ${info.properties.toString()}
                    }
                }`
        );

        return info.callback(result.bar);
    },

    observeInfo() {
        const query = gql`
            subscription {
                bar(id: "${barAddress}") {
                    ${info.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.bar, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(info.callback(results.data.bar));
                    },
                    error,
                    complete
                });
            }
        };
    },

    async user({block = undefined, timestamp = undefined, user_address = undefined} = {}) {
        if(!user_address) { throw new Error("fina-data: User address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.bar,
            gql`{
                    user(id: "${user_address.toLowerCase()}", ${block}) {
                        ${user.properties.toString()}
                    }
                }`
        );

        return user.callback(result.user);
    },
}

const info = {
    properties: [
        'decimals',
        'name',
        'fina',
        'symbol',
        'totalSupply',
        'ratio',
        'xFinaMinted',
        'xFinaBurned',
        'finaStaked',
        'finaStakedUSD',
        'finaHarvested',
        'finaHarvestedUSD',
        'xFinaAge',
        'xFinaAgeDestroyed',
        'updatedAt'
    ],

    callback(results) {
        return ({
            decimals: Number(results.decimals),
            name: results.name,
            fina: results.fina,
            symbol: results.symbol,
            totalSupply: Number(results.totalSupply),
            ratio: Number(results.ratio),
            xFinaMinted: Number(results.xFinaMinted),
            xFinaBurned: Number(results.xFinaBurned),
            finaStaked: Number(results.totalSupply) * Number(results.ratio),
            finaStakedUSD: Number(results.finaStakedUSD),
            finaHarvested: Number(results.finaHarvested),
            finaHarvestedUSD: Number(results.finaHarvestedUSD),
            xFinaAge: Number(results.xFinaAge),
            xFinaAgeDestroyed: Number(results.xFinaAgeDestroyed),
            updatedAt: Number(results.updatedAt)
        })
    }
};

const user = {
    properties: [
        'xFina',
        'xFinaIn',
        'xFinaOut',
        'xFinaMinted',
        'xFinaBurned',
        'xFinaOffset',
        'xFinaAge',
        'xFinaAgeDestroyed',
        'finaStaked',
        'finaStakedUSD',
        'finaHarvested',
        'finaHarvestedUSD',
        'finaIn',
        'finaOut',
        'usdOut',
        'usdIn',
        'updatedAt',
        'finaOffset',
        'usdOffset'
    ],

    callback(results) {
        return ({
            xFina: Number(results.xFina),
            xFinaIn: Number(results.xFinaIn),
            xFinaOut: Number(results.xFinaOut),
            xFinaMinted: Number(results.xFinaMinted),
            xFinaBurned: Number(results.xFinaBurned),
            xFinaOffset: Number(results.xFinaOffset),
            xFinaAge: Number(results.xFinaAge),
            xFinaAgeDestroyed: Number(results.xFinaAgeDestroyed),
            finaStaked: Number(results.finaStaked),
            finaStakedUSD: Number(results.finaStakedUSD),
            finaHarvested: Number(results.finaHarvested),
            finaHarvestedUSD: Number(results.finaHarvestedUSD),
            finaIn: Number(results.finaIn),
            finaOut: Number(results.finaOut),
            usdOut: Number(results.usdOut),
            usdIn: Number(results.usdIn),
            updatedAt: Number(results.updatedAt),
            finaOffset: Number(results.finaOffset),
            usdOffset: Number(results.usdOffset)
        })
    }
};