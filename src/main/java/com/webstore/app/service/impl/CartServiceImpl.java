package com.webstore.app.service.impl;

import com.webstore.app.service.CartService;
import com.webstore.app.domain.Cart;
import com.webstore.app.repository.CartRepository;
import com.webstore.app.repository.search.CartSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Cart.
 */
@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final Logger log = LoggerFactory.getLogger(CartServiceImpl.class);

    private final CartRepository cartRepository;

    private final CartSearchRepository cartSearchRepository;

    public CartServiceImpl(CartRepository cartRepository, CartSearchRepository cartSearchRepository) {
        this.cartRepository = cartRepository;
        this.cartSearchRepository = cartSearchRepository;
    }

    /**
     * Save a cart.
     *
     * @param cart the entity to save
     * @return the persisted entity
     */
    @Override
    public Cart save(Cart cart) {
        log.debug("Request to save Cart : {}", cart);
        Cart result = cartRepository.save(cart);
        cartSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the carts.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Cart> findAll() {
        log.debug("Request to get all Carts");
        return cartRepository.findAll();
    }


    /**
     * Get one cart by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Cart> findOne(Long id) {
        log.debug("Request to get Cart : {}", id);
        return cartRepository.findById(id);
    }

    /**
     * Delete the cart by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Cart : {}", id);
        cartRepository.deleteById(id);
        cartSearchRepository.deleteById(id);
    }

    /**
     * Search for the cart corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Cart> search(String query) {
        log.debug("Request to search Carts for query {}", query);
        return StreamSupport
            .stream(cartSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
