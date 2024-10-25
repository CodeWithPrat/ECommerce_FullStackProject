package com.ecommerce.ecommerce_app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class OrderDTO {

    private Long id;
    private Long userId;
    private List<OrderItemDTO> orderItems;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime orderDate;
    private String shippingAddress;
    private String paymentMethod;
    private String paymentStatus;
}
