package com.ecommerce.ecommerce_app.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Integer stockQuantity;
}
