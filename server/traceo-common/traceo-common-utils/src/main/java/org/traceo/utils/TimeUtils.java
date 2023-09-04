package org.traceo.utils;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class TimeUtils {
    private static final ZoneOffset DEFAULT_ZONE = ZoneOffset.UTC;

    public static long nowEpoch() {
        return LocalDateTime.now().toEpochSecond(DEFAULT_ZONE);
    }

    public static LocalDateTime nowDateTime() {
        return LocalDateTime.now();
    }

    public static long wrapToEpoch(LocalDateTime dateTime) {
        return dateTime.toEpochSecond(DEFAULT_ZONE);
    }

    public static String format(long time, String format) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        return simpleDateFormat.format(new Date(time * 1000L));
    }

    public static String format(LocalDateTime time, String format) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(format);
        return time.format(dateTimeFormatter);
    }
}
