import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription} from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICart } from 'app/shared/model/cart.model';
import { AccountService } from 'app/core';
import { CartService } from 'app/entities/cart/cart.service';

@Component({
    selector: 'jhi-user-cart',
    templateUrl: './user-cart.component.html',
    styleUrls: ['user-cart.css']
})
export class UserCartComponent implements OnInit, OnDestroy {
    carts: ICart[];
    email: any;
    currentAccount: any;
    eventSubscriber: Subscription;
    total: number;

    constructor(
        protected cartService: CartService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {}

    loadCart() {
        this.cartService.query().subscribe(
            (res: HttpResponse<ICart[]>) => {
                this.carts = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.loadCart();
        this.registerChangeInCarts();
        this.totalPrice();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    totalPrice() {
        this.total = 0;
        for(let i = 0; i < this.carts.length; i++){
            this.total += (this.carts[i].price * this.carts[i].amount);
        }
    }

    increaseItem(id) {
        for(let i = 0; i < this.carts.length; i++){
            if(this.carts[i].id === id)
            {
                this.carts[i].amount += 1;
            }
        }
        this.totalPrice();
    }

    decreaseItem(id) {
        for(let i = 0; i < this.carts.length; i++){
            if(this.carts[i].id === id)
            {
                this.carts[i].amount -= 1;
            }
        }
        this.totalPrice();
    }

    trackId(index: number, item: ICart) {
        return item.id;
    }

    registerChangeInCarts() {
        this.eventSubscriber = this.eventManager.subscribe('cartListModification', response => this.loadCart());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
