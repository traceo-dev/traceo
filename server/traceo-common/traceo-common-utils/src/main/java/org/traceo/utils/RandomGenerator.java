package org.traceo.utils;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 *
 */
public class RandomGenerator {

    public static String generate() throws NoSuchAlgorithmException {
        return generate(16);
    }

    public static String generate(int len) throws NoSuchAlgorithmException {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(len);
        SecretKey secretKey = keyGen.generateKey();
        return encodeToBase64(secretKey.getEncoded());
    }

    private static String encodeToBase64(byte[] bytes) {
        return Base64.getEncoder().encodeToString(bytes);
    }
}
