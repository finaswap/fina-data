module.exports = {
    graphAPIEndpoints: {
        finamaster: 'https://api.thegraph.com/subgraphs/name/finaswap/finamaster',
        lounge: 'https://api.thegraph.com/subgraphs/name/finaswap/finalounge',
        timelock: 'https://api.thegraph.com/subgraphs/name/finaswap/fina-timelock',
        finachief: 'https://api.thegraph.com/subgraphs/name/finaswap/finachief',
        exchange: 'https://api.thegraph.com/subgraphs/name/finaswap/exchange',
        exchange_v1: 'https://api.thegraph.com/subgraphs/name/jiro-ono/finaswap-v1-exchange',
        blocklytics: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
        lockup: 'https://api.thegraph.com/subgraphs/name/matthewlilley/lockup',
    },

    graphWSEndpoints: {
        bar: 'wss://api.thegraph.com/subgraphs/name/finaswap/finalounge',
        exchange: 'wss://api.thegraph.com/subgraphs/name/finaswap/exchange',
        blocklytics: 'wss://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    },

    barAddress: "0x8798249c2e607446efb7ad49ec89dd1865ff4272",
    makerAddress: "0xF1dA0D3BBC1680fd892243d15cF5024C59D490ae",
    chefAddress: "0xa1D10A75932642342371B15d9Dfe09F2519cC995",
    finaAddress: "0x31b6ED8Dc8ced0B5C7B9C0FDF3066F58D99B52E7",
    factoryAddress: "0xe724a28b19E1906f90e57A635138Cc2401c56335",

    TWENTY_FOUR_HOURS: 86400,
}
