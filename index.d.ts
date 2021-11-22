import fina = require("./typings/fina");
import blocks = require("./typings/blocks");
import charts = require("./typings/charts");
import exchange = require("./typings/exchange");
import exchange_v1 = require("./typings/exchange_v1");
import finamaster = require("./typings/finamaster");
import bar = require("./typings/bar");
import maker = require("./typings/maker");
import timelock = require("./typings/timelock");
import lockup = require("./typings/lockup");
import utils = require("./typings/utils")
import bentobox = require("./typings/bentobox");

export = FinaData;
export as namespace FinaData;

declare namespace FinaData {

    export declare function timeseries({ blocks, timestamps, target }: {
        blocks?: number[];
        timestamps?: number[];
        target: Function;
    }, targetArguments?: any): Promise<any>;

    export { fina, blocks, charts, exchange, exchange_v1, finamaster, bar, maker, timelock, lockup, utils, bentobox };
}
