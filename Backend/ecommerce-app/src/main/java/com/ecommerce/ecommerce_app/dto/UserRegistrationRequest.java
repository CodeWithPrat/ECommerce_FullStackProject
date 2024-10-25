package com.ecommerce.ecommerce_app.dto;

import lombok.Data;

@Data
public class UserRegistrationRequest {

    private UserDTO userDTO;
    private String password;  // Separate password field
}
