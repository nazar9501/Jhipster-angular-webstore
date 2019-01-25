import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebStoreSharedModule } from 'app/shared';
import { WebStoreAdminModule } from 'app/admin/admin.module';
import { UserCartComponent } from 'app/cart/user-cart.component';
import { UserCartDetailComponent } from 'app/cart/user-cart-detail.component';
import { UserCartDeletePopupComponent } from 'app/cart/user-cart-delete.component';
import { UserCartDeleteDialogComponent } from 'app/cart/user-cart-delete.component';
import { userCartRoute, userCartPopupRoute } from './user-cart.route';

const ENTITY_STATES = [...userCartRoute, ...userCartPopupRoute];

@NgModule({
    imports: [WebStoreSharedModule, WebStoreAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [UserCartComponent, UserCartDetailComponent, UserCartDeleteDialogComponent, UserCartDeletePopupComponent],
    entryComponents: [UserCartComponent, UserCartDeleteDialogComponent, UserCartDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebStoreUserCartModule {}
