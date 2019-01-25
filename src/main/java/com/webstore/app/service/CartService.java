package com.webstore.app.service;

import com.webstore.app.domain.Cart;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Cart.
 */
public interface CartService {

    /**
     * Save a cart.
     *
     * @param cart the entity to save
     * @return the persisted entity
     */
    Cart save(Cart cart);

    /**
     * Get all the carts.
     *
     * @return the list of entities
     */
    List<Cart> findAll();


    /**
     * Get the "id" cart.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Cart> findOne(Long id);

    /**
     * Delete the "id" cart.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the cart corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Cart> search(String query);
}
