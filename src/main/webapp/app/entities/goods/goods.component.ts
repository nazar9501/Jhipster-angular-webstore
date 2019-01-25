import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IGoods } from 'app/shared/model/goods.model';
import { AccountService } from 'app/core';
import { GoodsService } from './goods.service';

@Component({
    selector: 'jhi-goods',
    templateUrl: './goods.component.html'
})
export class GoodsComponent implements OnInit, OnDestroy {
    goods: IGoods[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected goodsService: GoodsService,
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
            this.currentAccount = account;
        });
        this.registerChangeInGoods();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
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
}
