type Info = {
    decimals: number;
    name: string;
    fina: string;
    symbol: string;
    totalSupply: number;
    ratio: number;
    xFinaMinted: number;
    xFinaBurned: number;
    finaStaked: number;
    finaStakedUSD: number;
    finaHarvested: number;
    finaHarvestedUSD: number;
    xFinaAge: number;
    xFinaAgeDestroyed: number;
    updatedAt: number;
}

export function info({ block, timestamp }?: {
    block?: number;
    timestamp?: number;
}): Promise<Info>;

export function observeInfo(): {
    subscribe({ next, error, complete }: {
        next?(data: Info): any;
        error?(error: any): any;
        complete?: Function;
    }): any;
};



type User = {
    xFina: number;
    xFinaIn: number;
    xFinaOut: number;
    xFinaMinted: number;
    xFinaBurned: number;
    xFinaOffset: number;
    xFinaAge: number;
    xFinaAgeDestroyed: number;
    finaStaked: number;
    finaStakedUSD: number;
    finaHarvested: number;
    finaHarvestedUSD: number;
    finaIn: number;
    finaOut: number;
    usdOut: number;
    usdIn: number;
    updatedAt: number;
    finaOffset: number;
    usdOffset: number;
}

export function user({ block, timestamp, user_address }: {
    block?: number;
    timestamp?: number;
    user_address: string;
}): Promise<User>;
