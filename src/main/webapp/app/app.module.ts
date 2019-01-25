import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';
import { NgJhipsterModule } from 'ng-jhipster';

import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { WebStoreSharedModule } from 'app/shared';
import { WebStoreCoreModule } from 'app/core';
import { WebStoreAppRoutingModule } from './app-routing.module';
import { WebStoreHomeModule } from './home/home.module';
import { WebStoreAccountModule } from './account/account.module';
import { WebStoreEntityModule } from './entities/entity.module';
import * as moment from 'moment';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent, NavbarComponent, FooterComponent, PageRibbonComponent, ErrorComponent } from './layouts';
import { GoodsService } from 'app/entities/goods';
import { CartService } from 'app/entities/cart';
import { WebStoreUserCartModule } from 'app/cart/user-cart.module';

@NgModule({
    imports: [
        BrowserModule,
        WebStoreAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        NgJhipsterModule.forRoot({
            // set below to true to make alerts look like toast
            alertAsToast: false,
            alertTimeout: 5000
        }),
        WebStoreSharedModule.forRoot(),
        WebStoreCoreModule,
        WebStoreHomeModule,
        WebStoreAccountModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
        WebStoreEntityModule,
        WebStoreUserCartModule
    ],
    declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true
        },
        GoodsService, CartService
    ],
    bootstrap: [JhiMainComponent]
})
export class WebStoreAppModule {
    constructor(private dpConfig: NgbDatepickerConfig) {
        this.dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    }
}
