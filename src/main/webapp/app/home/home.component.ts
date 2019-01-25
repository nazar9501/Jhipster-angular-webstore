import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { LoginModalService, AccountService, Account } from 'app/core';
import { GoodsService } from 'app/entities/goods';
import { ActivatedRoute } from '@angular/router';
import { IGoods } from 'app/shared/model/goods.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { CartService } from 'app/entities/cart';
import { Cart, ICart } from 'app/shared/model/cart.model';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    account: Account;
    cart: ICart;
    modalRef: NgbModalRef;
    goods: IGoods[];
    currentSearch: string;
    eventSubscriber: Subscription;

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private goodsService: GoodsService,
        private cartService: CartService,
        protected jhiAlertService: JhiAlertService,
        protected activatedRoute: ActivatedRoute
    ) { this.currentSearch =
        this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
            ? this.activatedRoute.snapshot.params['search']
            : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.goodsService
                .search({
                    query: this.currentSearch
                })
                .subscribe((res: HttpResponse<IGoods[]>) => (this.goods = res.body), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.goodsService.query().subscribe(
            (res: HttpResponse<IGoods[]>) => {
                this.goods = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.registerChangeInGoods();
        this.activatedRoute.data.subscribe(({ cart }) => {
            this.cart = cart;
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    trackId(index: number, item: IGoods) {
        return item.id;
    }

    registerChangeInGoods() {
        this.eventSubscriber = this.eventManager.subscribe('goodsListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    addToCart(name: string, price: number, image_url: string) {
        this.cart = new Cart(null, this.account.email, name, price, 1, image_url);
        this.subscribeToCreateResponse(this.cartService.create(this.cart));
    }

    protected subscribeToCreateResponse(result: Observable<HttpResponse<ICart>>) {
        result.subscribe((res: HttpResponse<ICart>) => this.onCreateSuccess(), (res: HttpErrorResponse) => this.onCreateError());
    }

    protected onCreateSuccess() {
        console.log('Success');
    }

    protected onCreateError() {
        console.log('Error');
    }
}
