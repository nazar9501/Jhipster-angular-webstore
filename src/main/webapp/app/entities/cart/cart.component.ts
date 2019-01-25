import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICart } from 'app/shared/model/cart.model';
import { AccountService } from 'app/core';
import { CartService } from './cart.service';

@Component({
    selector: 'jhi-cart',
    templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {
    carts: ICart[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected cartService: CartService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.cartService
                .search({
                    query: this.currentSearch
                })
                .subscribe((res: HttpResponse<ICart[]>) => (this.carts = res.body), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.cartService.query().subscribe(
            (res: HttpResponse<ICart[]>) => {
                this.carts = res.body;
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
            this.currentAccount = account;
        });
        this.registerChangeInCarts();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICart) {
        return item.id;
    }

    registerChangeInCarts() {
        this.eventSubscriber = this.eventManager.subscribe('cartListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
