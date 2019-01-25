import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Goods } from 'app/shared/model/goods.model';
import { GoodsService } from './goods.service';
import { GoodsComponent } from './goods.component';
import { GoodsDetailComponent } from './goods-detail.component';
import { GoodsUpdateComponent } from './goods-update.component';
import { GoodsDeletePopupComponent } from './goods-delete-dialog.component';
import { IGoods } from 'app/shared/model/goods.model';

@Injectable({ providedIn: 'root' })
export class GoodsResolve implements Resolve<IGoods> {
    constructor(private service: GoodsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Goods> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Goods>) => response.ok),
                map((goods: HttpResponse<Goods>) => goods.body)
            );
        }
        return of(new Goods());
    }
}

export const goodsRoute: Routes = [
    {
        path: 'goods',
        component: GoodsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Goods'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'goods/:id/view',
        component: GoodsDetailComponent,
        resolve: {
            goods: GoodsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Goods'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'goods/new',
        component: GoodsUpdateComponent,
        resolve: {
            goods: GoodsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Goods'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'goods/:id/edit',
        component: GoodsUpdateComponent,
        resolve: {
            goods: GoodsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Goods'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const goodsPopupRoute: Routes = [
    {
        path: 'goods/:id/delete',
        component: GoodsDeletePopupComponent,
        resolve: {
            goods: GoodsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Goods'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
