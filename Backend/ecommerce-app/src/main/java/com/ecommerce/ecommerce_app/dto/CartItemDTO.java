package com.ecommerce.ecommerce_app.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
}