import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Cart } from 'app/shared/model/cart.model';
import { CartService } from 'app/entities/cart/cart.service';
import { UserCartComponent } from './user-cart.component';
import { UserCartDetailComponent } from './user-cart-detail.component';
import { UserCartDeletePopupComponent } from './user-cart-delete.component';
import { ICart } from 'app/shared/model/cart.model';

@Injectable({ providedIn: 'root' })
export class UserCartResolve implements Resolve<ICart> {
    constructor(private service: CartService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cart> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Cart>) => response.ok),
                map((cart: HttpResponse<Cart>) => cart.body)
            );
        }
        return of(new Cart());
    }
}

export const userCartRoute: Routes = [
    {
        path: 'ucart',
        component: UserCartComponent,
        resolve: {
            cart: UserCartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Carts'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'ucart/:id/view',
        component: UserCartDetailComponent,
        resolve: {
            cart: UserCartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Carts'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const userCartPopupRoute: Routes = [
    {
        path: 'ucart/:id/delete',
        component: UserCartDeletePopupComponent,
        resolve: {
            cart: UserCartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Carts'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
