package com.ecommerce.ecommerce_app.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.ecommerce_app.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce_app.model.Order;
import com.ecommerce.ecommerce_app.model.OrderItem;
import com.ecommerce.ecommerce_app.model.Product;
import com.ecommerce.ecommerce_app.model.User;
import com.ecommerce.ecommerce_app.repository.OrderRepository;
import com.ecommerce.ecommerce_app.repository.ProductRepository;
import com.ecommerce.ecommerce_app.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
    }

    public Order createOrder(Long userId, List<OrderItem> orderItems, String shippingAddress, String paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setStatus("PENDING");
        order.setPaymentStatus("PENDING");

        // Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + item.getProduct().getId()));
            item.setProduct(product);
            item.setPrice(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            totalAmount = totalAmount.add(item.getPrice());
            item.setOrder(order);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        if (!"CANCELLED".equals(order.getStatus())) {
            order.setStatus("CANCELLED");
            orderRepository.save(order);
        } else {
            throw new IllegalArgumentException("Order is already cancelled");
        }
    }

    public List<Order> getOrdersByStatus(Long userId, String status) {
        return orderRepository.findByUserIdAndStatus(userId, status);
    }
}
