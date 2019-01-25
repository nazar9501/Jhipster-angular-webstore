import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebStoreSharedModule } from 'app/shared';
import {
    GoodsComponent,
    GoodsDetailComponent,
    GoodsUpdateComponent,
    GoodsDeletePopupComponent,
    GoodsDeleteDialogComponent,
    goodsRoute,
    goodsPopupRoute
} from './';

const ENTITY_STATES = [...goodsRoute, ...goodsPopupRoute];

@NgModule({
    imports: [WebStoreSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [GoodsComponent, GoodsDetailComponent, GoodsUpdateComponent, GoodsDeleteDialogComponent, GoodsDeletePopupComponent],
    entryComponents: [GoodsComponent, GoodsUpdateComponent, GoodsDeleteDialogComponent, GoodsDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebStoreGoodsModule {}
