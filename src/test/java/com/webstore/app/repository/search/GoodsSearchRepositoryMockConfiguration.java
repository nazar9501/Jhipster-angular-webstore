package com.webstore.app.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of GoodsSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class GoodsSearchRepositoryMockConfiguration {

    @MockBean
    private GoodsSearchRepository mockGoodsSearchRepository;

}
