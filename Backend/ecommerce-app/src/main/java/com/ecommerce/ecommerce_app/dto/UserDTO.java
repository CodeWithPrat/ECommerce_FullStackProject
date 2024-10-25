package com.ecommerce.ecommerce_app.dto;

import java.util.Set;

import lombok.Data;

@Data
public class UserDTO {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Set<String> roles;
    private String password;  // Add password field
}
