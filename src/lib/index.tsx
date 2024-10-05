export type parseInterval = '1s' | '1m' | '5m' | '15m' | '30m' | '1h' | '1d' | '1w' | '1M' | '1y'

export const parseInterval = (intervalString : parseInterval) => {

    const match = intervalString.match(/^(\d+)([smhdwMy])$/);
    if (!match) {
        throw new Error('Invalid interval string format');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's':
            return value * 1000; // seconds to milliseconds
        case 'm':
            return value * 60 * 1000; // minutes to milliseconds
        case 'h':
            return value * 60 * 60 * 1000; // hours to milliseconds
        case 'd':
            return value * 24 * 60 * 60 * 1000; // days to milliseconds
        case 'w':
            return value * 7 * 24 * 60 * 60 * 1000; // weeks to milliseconds
        case 'M':
            return value * 30 * 24 * 60 * 60 * 1000; // months to milliseconds
        case 'y':
            return value * 365 * 24 * 60 * 60 * 1000; // years to milliseconds
        default:
            throw new Error(`Invalid interval unit: ${unit}. Allowed units are:`);
    }
}