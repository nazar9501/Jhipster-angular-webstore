package com.webstore.app.service.impl;

import com.webstore.app.service.GoodsService;
import com.webstore.app.domain.Goods;
import com.webstore.app.repository.GoodsRepository;
import com.webstore.app.repository.search.GoodsSearchRepository;
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
 * Service Implementation for managing Goods.
 */
@Service
@Transactional
public class GoodsServiceImpl implements GoodsService {

    private final Logger log = LoggerFactory.getLogger(GoodsServiceImpl.class);

    private final GoodsRepository goodsRepository;

    private final GoodsSearchRepository goodsSearchRepository;

    public GoodsServiceImpl(GoodsRepository goodsRepository, GoodsSearchRepository goodsSearchRepository) {
        this.goodsRepository = goodsRepository;
        this.goodsSearchRepository = goodsSearchRepository;
    }

    /**
     * Save a goods.
     *
     * @param goods the entity to save
     * @return the persisted entity
     */
    @Override
    public Goods save(Goods goods) {
        log.debug("Request to save Goods : {}", goods);
        Goods result = goodsRepository.save(goods);
        goodsSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the goods.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Goods> findAll() {
        log.debug("Request to get all Goods");
        return goodsRepository.findAll();
    }


    /**
     * Get one goods by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Goods> findOne(Long id) {
        log.debug("Request to get Goods : {}", id);
        return goodsRepository.findById(id);
    }

    /**
     * Delete the goods by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Goods : {}", id);
        goodsRepository.deleteById(id);
        goodsSearchRepository.deleteById(id);
    }

    /**
     * Search for the goods corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Goods> search(String query) {
        log.debug("Request to search Goods for query {}", query);
        return StreamSupport
            .stream(goodsSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
