package com.fleetmanagement.config;

public class AuthContext {
    private static final ThreadLocal<Long> currentUserId = new ThreadLocal<>();

    public static void setUserId(Long userId) {
        currentUserId.set(userId);
    }

    public static Long getUserId() {
        return currentUserId.get();
    }

    public static void clear() {
        currentUserId.remove();
    }
}
