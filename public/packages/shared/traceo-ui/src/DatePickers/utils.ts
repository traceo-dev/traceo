import dayjs, { Dayjs } from "dayjs";

export const validateInput = (from: Dayjs, to: Dayjs, maxTimePeriod: number) => {
    if (from.isAfter(to)) {
        return "'From' can't be after 'To'";
    }

    if (to.isBefore(from)) {
        return "'To' can't be before 'From'";
    }

    const diffInHours = Math.abs(from.diff(to, "hour"));
    if (maxTimePeriod && diffInHours > maxTimePeriod) {
        return `Data can only be loaded from ${maxTimePeriod}h range`;
    }

    return null;
};

export const parseInputValue = (value: [number, number], range: boolean): string => {
    const from = dayjs.unix(value[0]);
    const to = dayjs.unix(value[1]);

    if (!range) {
        // 23 Jan, 12:50 - 16:20
        return `${from.format("DD MMM, HH:mm")} - ${to.format("HH:mm")}`;
    }

    // 23 Jan, 12:50 - 27 Jan, 16:20
    return `${from.format("DD MMM, HH:mm")} - ${to.format("DD MMM, HH:mm")}`;
};

export const parseUnixToDate = (value: number | [number, number], range: boolean) => {
    const parser = (unix: number) => new Date(unix * 1e3);
    return !range ? parser(value[0]) : [parser(value[0]), parser(value[1])];
};

export const setTimeToUnix = (time: string, initialDate: number) => {
    // time is in HH:mm format
    const [hour, minute] = time.split(":");

    const dayJS = dayjs.unix(initialDate);
    const date = dayJS.set("hour", parseInt(hour)).set("minute", parseInt(minute));

    return date;
};