package com.webstore.app.web.rest;

import com.webstore.app.WebStoreApp;

import com.webstore.app.domain.Cart;
import com.webstore.app.repository.CartRepository;
import com.webstore.app.repository.search.CartSearchRepository;
import com.webstore.app.service.CartService;
import com.webstore.app.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;


import static com.webstore.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CartResource REST controller.
 *
 * @see CartResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = WebStoreApp.class)
public class CartResourceIntTest {

    private static final String DEFAULT_USER_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_USER_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final Integer DEFAULT_AMOUNT = 1;
    private static final Integer UPDATED_AMOUNT = 2;

    private static final String DEFAULT_IMAGE_URL = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_URL = "BBBBBBBBBB";

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    /**
     * This repository is mocked in the com.webstore.app.repository.search test package.
     *
     * @see com.webstore.app.repository.search.CartSearchRepositoryMockConfiguration
     */
    @Autowired
    private CartSearchRepository mockCartSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restCartMockMvc;

    private Cart cart;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CartResource cartResource = new CartResource(cartService);
        this.restCartMockMvc = MockMvcBuilders.standaloneSetup(cartResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cart createEntity(EntityManager em) {
        Cart cart = new Cart()
            .user_email(DEFAULT_USER_EMAIL)
            .name(DEFAULT_NAME)
            .price(DEFAULT_PRICE)
            .amount(DEFAULT_AMOUNT)
            .image_url(DEFAULT_IMAGE_URL);
        return cart;
    }

    @Before
    public void initTest() {
        cart = createEntity(em);
    }

    @Test
    @Transactional
    public void createCart() throws Exception {
        int databaseSizeBeforeCreate = cartRepository.findAll().size();

        // Create the Cart
        restCartMockMvc.perform(post("/api/carts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cart)))
            .andExpect(status().isCreated());

        // Validate the Cart in the database
        List<Cart> cartList = cartRepository.findAll();
        assertThat(cartList).hasSize(databaseSizeBeforeCreate + 1);
        Cart testCart = cartList.get(cartList.size() - 1);
        assertThat(testCart.getUser_email()).isEqualTo(DEFAULT_USER_EMAIL);
        assertThat(testCart.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCart.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testCart.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testCart.getImage_url()).isEqualTo(DEFAULT_IMAGE_URL);

        // Validate the Cart in Elasticsearch
        verify(mockCartSearchRepository, times(1)).save(testCart);
    }

    @Test
    @Transactional
    public void createCartWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cartRepository.findAll().size();

        // Create the Cart with an existing ID
        cart.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCartMockMvc.perform(post("/api/carts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cart)))
            .andExpect(status().isBadRequest());

        // Validate the Cart in the database
        List<Cart> cartList = cartRepository.findAll();
        assertThat(cartList).hasSize(databaseSizeBeforeCreate);

        // Validate the Cart in Elasticsearch
        verify(mockCartSearchRepository, times(0)).save(cart);
    }

    @Test
    @Transactional
    public void getAllCarts() throws Exception {
        // Initialize the database
        cartRepository.saveAndFlush(cart);

        // Get all the cartList
        restCartMockMvc.perform(get("/api/carts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cart.getId().intValue())))
            .andExpect(jsonPath("$.[*].user_email").value(hasItem(DEFAULT_USER_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.[*].image_url").value(hasItem(DEFAULT_IMAGE_URL.toString())));
    }
    
    @Test
    @Transactional
    public void getCart() throws Exception {
        // Initialize the database
        cartRepository.saveAndFlush(cart);

        // Get the cart
        restCartMockMvc.perform(get("/api/carts/{id}", cart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(cart.getId().intValue()))
            .andExpect(jsonPath("$.user_email").value(DEFAULT_USER_EMAIL.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT))
            .andExpect(jsonPath("$.image_url").value(DEFAULT_IMAGE_URL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCart() throws Exception {
        // Get the cart
        restCartMockMvc.perform(get("/api/carts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCart() throws Exception {
        // Initialize the database
        cartService.save(cart);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockCartSearchRepository);

        int databaseSizeBeforeUpdate = cartRepository.findAll().size();

        // Update the cart
        Cart updatedCart = cartRepository.findById(cart.getId()).get();
        // Disconnect from session so that the updates on updatedCart are not directly saved in db
        em.detach(updatedCart);
        updatedCart
            .user_email(UPDATED_USER_EMAIL)
            .name(UPDATED_NAME)
            .price(UPDATED_PRICE)
            .amount(UPDATED_AMOUNT)
            .image_url(UPDATED_IMAGE_URL);

        restCartMockMvc.perform(put("/api/carts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCart)))
            .andExpect(status().isOk());

        // Validate the Cart in the database
        List<Cart> cartList = cartRepository.findAll();
        assertThat(cartList).hasSize(databaseSizeBeforeUpdate);
        Cart testCart = cartList.get(cartList.size() - 1);
        assertThat(testCart.getUser_email()).isEqualTo(UPDATED_USER_EMAIL);
        assertThat(testCart.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCart.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testCart.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testCart.getImage_url()).isEqualTo(UPDATED_IMAGE_URL);

        // Validate the Cart in Elasticsearch
        verify(mockCartSearchRepository, times(1)).save(testCart);
    }

    @Test
    @Transactional
    public void updateNonExistingCart() throws Exception {
        int databaseSizeBeforeUpdate = cartRepository.findAll().size();

        // Create the Cart

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCartMockMvc.perform(put("/api/carts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cart)))
            .andExpect(status().isBadRequest());

        // Validate the Cart in the database
        List<Cart> cartList = cartRepository.findAll();
        assertThat(cartList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Cart in Elasticsearch
        verify(mockCartSearchRepository, times(0)).save(cart);
    }

    @Test
    @Transactional
    public void deleteCart() throws Exception {
        // Initialize the database
        cartService.save(cart);

        int databaseSizeBeforeDelete = cartRepository.findAll().size();

        // Get the cart
        restCartMockMvc.perform(delete("/api/carts/{id}", cart.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Cart> cartList = cartRepository.findAll();
        assertThat(cartList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Cart in Elasticsearch
        verify(mockCartSearchRepository, times(1)).deleteById(cart.getId());
    }

    @Test
    @Transactional
    public void searchCart() throws Exception {
        // Initialize the database
        cartService.save(cart);
        when(mockCartSearchRepository.search(queryStringQuery("id:" + cart.getId())))
            .thenReturn(Collections.singletonList(cart));
        // Search the cart
        restCartMockMvc.perform(get("/api/_search/carts?query=id:" + cart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cart.getId().intValue())))
            .andExpect(jsonPath("$.[*].user_email").value(hasItem(DEFAULT_USER_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.[*].image_url").value(hasItem(DEFAULT_IMAGE_URL)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cart.class);
        Cart cart1 = new Cart();
        cart1.setId(1L);
        Cart cart2 = new Cart();
        cart2.setId(cart1.getId());
        assertThat(cart1).isEqualTo(cart2);
        cart2.setId(2L);
        assertThat(cart1).isNotEqualTo(cart2);
        cart1.setId(null);
        assertThat(cart1).isNotEqualTo(cart2);
    }
}
