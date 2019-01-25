package com.webstore.app.service;

import com.webstore.app.domain.Goods;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Goods.
 */
public interface GoodsService {

    /**
     * Save a goods.
     *
     * @param goods the entity to save
     * @return the persisted entity
     */
    Goods save(Goods goods);

    /**
     * Get all the goods.
     *
     * @return the list of entities
     */
    List<Goods> findAll();


    /**
     * Get the "id" goods.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Goods> findOne(Long id);

    /**
     * Delete the "id" goods.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the goods corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Goods> search(String query);
}
