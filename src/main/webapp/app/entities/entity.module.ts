import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { WebStoreGoodsModule } from './goods/goods.module';
import { WebStoreCartModule } from './cart/cart.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        WebStoreGoodsModule,
        WebStoreCartModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebStoreEntityModule {}
