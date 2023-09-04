package org.traceo.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class CookiesUtils {
    public static Cookie get(Cookie[] cookies, String name) {
        Objects.requireNonNull(name, "Name cannot be null!");

        return Arrays.stream(cookies)
                .filter(c -> c.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    public static String getValue(Cookie[] cookies, String name) {
        Objects.requireNonNull(name, "Name cannot be null!");

        Cookie cookie = get(cookies, name);
        if (cookie == null) {
            return null;
        }
        return cookie.getValue();
    }

    public static void clearCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);
    }
}
