package com.webstore.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.webstore.app.domain.Goods;
import com.webstore.app.service.GoodsService;
import com.webstore.app.web.rest.errors.BadRequestAlertException;
import com.webstore.app.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Goods.
 */
@RestController
@RequestMapping("/api")
public class GoodsResource {

    private final Logger log = LoggerFactory.getLogger(GoodsResource.class);

    private static final String ENTITY_NAME = "goods";

    private final GoodsService goodsService;

    public GoodsResource(GoodsService goodsService) {
        this.goodsService = goodsService;
    }

    /**
     * POST  /goods : Create a new goods.
     *
     * @param goods the goods to create
     * @return the ResponseEntity with status 201 (Created) and with body the new goods, or with status 400 (Bad Request) if the goods has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/goods")
    @Timed
    public ResponseEntity<Goods> createGoods(@Valid @RequestBody Goods goods) throws URISyntaxException {
        log.debug("REST request to save Goods : {}", goods);
        if (goods.getId() != null) {
            throw new BadRequestAlertException("A new goods cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Goods result = goodsService.save(goods);
        return ResponseEntity.created(new URI("/api/goods/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /goods : Updates an existing goods.
     *
     * @param goods the goods to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated goods,
     * or with status 400 (Bad Request) if the goods is not valid,
     * or with status 500 (Internal Server Error) if the goods couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/goods")
    @Timed
    public ResponseEntity<Goods> updateGoods(@Valid @RequestBody Goods goods) throws URISyntaxException {
        log.debug("REST request to update Goods : {}", goods);
        if (goods.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Goods result = goodsService.save(goods);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, goods.getId().toString()))
            .body(result);
    }

    /**
     * GET  /goods : get all the goods.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of goods in body
     */
    @GetMapping("/goods")
    @Timed
    public List<Goods> getAllGoods() {
        log.debug("REST request to get all Goods");
        return goodsService.findAll();
    }

    /**
     * GET  /goods/:id : get the "id" goods.
     *
     * @param id the id of the goods to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the goods, or with status 404 (Not Found)
     */
    @GetMapping("/goods/{id}")
    @Timed
    public ResponseEntity<Goods> getGoods(@PathVariable Long id) {
        log.debug("REST request to get Goods : {}", id);
        Optional<Goods> goods = goodsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(goods);
    }

    /**
     * DELETE  /goods/:id : delete the "id" goods.
     *
     * @param id the id of the goods to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/goods/{id}")
    @Timed
    public ResponseEntity<Void> deleteGoods(@PathVariable Long id) {
        log.debug("REST request to delete Goods : {}", id);
        goodsService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/goods?query=:query : search for the goods corresponding
     * to the query.
     *
     * @param query the query of the goods search
     * @return the result of the search
     */
    @GetMapping("/_search/goods")
    @Timed
    public List<Goods> searchGoods(@RequestParam String query) {
        log.debug("REST request to search Goods for query {}", query);
        return goodsService.search(query);
    }

}
