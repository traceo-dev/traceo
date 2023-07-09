import dayjs from "dayjs";

export const calculateInterval = (query: { from: number, to: number }) => {
    const { from, to } = query;

    const djsTo = dayjs.unix(to);
    const djsFrom = dayjs.unix(from);

    const hoursDiff = djsTo.diff(djsFrom, "hour");
    const minutesDiff = djsTo.diff(djsFrom, "minutes");
    const secondsDiff = djsTo.diff(djsFrom, "seconds");

    const HOURS_IN_DAY = 24;
    const ONE_SECOND = 1;
    const SECONDS_IN_MINUTE = ONE_SECOND * 60;

    // FROM START TO 2MIN
    if (secondsDiff < 120) {
        return ONE_SECOND;
    }

    // FROM START TO 12H
    if (minutesDiff >= 2 && minutesDiff <= 60 * 12) {
        return SECONDS_IN_MINUTE / 4;
    }

    // BETWEEN 12H and 23H
    if (minutesDiff > 60 * 12 && hoursDiff < HOURS_IN_DAY) {
        return SECONDS_IN_MINUTE;
    }

    // BETWEEN 1D and 2D
    if (hoursDiff > HOURS_IN_DAY && hoursDiff < HOURS_IN_DAY * 2) {
        return SECONDS_IN_MINUTE * 2;
    }

    // BETWEEN 2D and 3D
    if (hoursDiff > HOURS_IN_DAY * 2 && hoursDiff < HOURS_IN_DAY * 3) {
        return SECONDS_IN_MINUTE * 5;
    }

    // BETWEEN 3D and 4D
    if (hoursDiff > HOURS_IN_DAY * 3 && hoursDiff < HOURS_IN_DAY * 4) {
        return SECONDS_IN_MINUTE * 10;
    }

    // BETWEEN 4D and 5D
    if (hoursDiff > HOURS_IN_DAY * 4 && hoursDiff < HOURS_IN_DAY * 5) {
        return SECONDS_IN_MINUTE * 15;
    }

    // ABOVE 5D
    return SECONDS_IN_MINUTE * 30;
}
