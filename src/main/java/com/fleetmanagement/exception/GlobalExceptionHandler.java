package com.fleetmanagement.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        String message = "A database error occurred.";

        String causeMsg = null;
        if (ex.getCause() != null && ex.getCause().getCause() != null) {
            causeMsg = ex.getCause().getCause().getMessage();
        } else if (ex.getMessage() != null) {
            causeMsg = ex.getMessage();
        }

        if (causeMsg != null) {
            if (causeMsg.contains("uk_vehicles_vin")) {
                message = "A vehicle with this VIN already exists in your fleet.";
            } else if (causeMsg.contains("uk_workspace_plate") || causeMsg.contains("uk_vehicles_plate")) {
                message = "A vehicle with this License Plate Number already exists in your fleet.";
            } else if (causeMsg.contains("uk_drivers_license")) {
                message = "A driver with this License Number already exists in your fleet.";
            } else if (causeMsg.contains("drivers") && causeMsg.contains("email")) {
                message = "A driver with this email address already exists.";
            } else if (causeMsg.contains("users") && causeMsg.contains("email")) {
                message = "A user with this email address already exists.";
            } else {
                message = "Data integrity violation: " + causeMsg;
            }
        }

        errorResponse.put("message", message);
        errorResponse.put("error", "Bad Request");
        errorResponse.put("status", "400");

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}
