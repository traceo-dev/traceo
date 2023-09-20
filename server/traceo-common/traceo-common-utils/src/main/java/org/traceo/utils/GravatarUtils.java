package org.traceo.utils;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class GravatarUtils {
    private final static int DEFAULT_SIZE = 80;
    private final static String GRAVATAR_URL = "http://www.gravatar.com/avatar/";

    public static String create(String message) {
        return create(message, DEFAULT_SIZE);
    }

    public static String create(String message, int size) {
        String hex = md5Hex(message);
        return GRAVATAR_URL + hex + ".jpg?s=" + size + "&d=identicon";
    }

//    https://gravatar.com/site/implement/images/java/
    private static String hex(byte[] array) {
        StringBuilder sb = new StringBuilder();
        for (byte b : array) {
            sb.append(Integer.toHexString((b & 0xFF) | 0x100), 1, 3);
        }
        return sb.toString();
    }

    private static String md5Hex(String message) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            return hex(md.digest(message.getBytes("CP1252")));
        } catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
            return null;
        }
    }
}
