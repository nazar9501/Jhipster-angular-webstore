import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IGoods } from 'app/shared/model/goods.model';
import { GoodsService } from './goods.service';

@Component({
    selector: 'jhi-goods-update',
    templateUrl: './goods-update.component.html'
})
export class GoodsUpdateComponent implements OnInit {
    goods: IGoods;
    isSaving: boolean;

    constructor(protected goodsService: GoodsService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ goods }) => {
            this.goods = goods;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.goods.id !== undefined) {
            this.subscribeToSaveResponse(this.goodsService.update(this.goods));
        } else {
            this.subscribeToSaveResponse(this.goodsService.create(this.goods));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IGoods>>) {
        result.subscribe((res: HttpResponse<IGoods>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
