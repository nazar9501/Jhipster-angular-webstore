import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICart } from 'app/shared/model/cart.model';

@Component({
    selector: 'jhi-user-cart-detail',
    templateUrl: './user-cart-detail.component.html'
})
export class UserCartDetailComponent implements OnInit {
    cart: ICart;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ cart }) => {
            this.cart = cart;
        });
    }

    previousState() {
        window.history.back();
    }
}
