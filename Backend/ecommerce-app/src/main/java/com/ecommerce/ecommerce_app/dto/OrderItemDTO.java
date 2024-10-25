package com.ecommerce.ecommerce_app.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OrderItemDTO {

    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;

    public BigDecimal getSubtotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
}
