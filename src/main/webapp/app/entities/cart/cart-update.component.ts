import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ICart } from 'app/shared/model/cart.model';
import { CartService } from './cart.service';

@Component({
    selector: 'jhi-cart-update',
    templateUrl: './cart-update.component.html'
})
export class CartUpdateComponent implements OnInit {
    cart: ICart;
    isSaving: boolean;

    constructor(
        protected cartService: CartService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ cart }) => {
            this.cart = cart;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.cart.id !== undefined) {
            this.subscribeToSaveResponse(this.cartService.update(this.cart));
        } else {
            this.subscribeToSaveResponse(this.cartService.create(this.cart));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICart>>) {
        result.subscribe((res: HttpResponse<ICart>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
