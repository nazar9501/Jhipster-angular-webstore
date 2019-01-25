export interface IGoods {
    id?: number;
    goods_id?: number;
    name?: string;
    manufacturer?: string;
    price?: number;
    description?: string;
    imageUrl?: string;
}

export class Goods implements IGoods {
    constructor(
        public id?: number,
        public goods_id?: number,
        public name?: string,
        public manufacturer?: string,
        public price?: number,
        public description?: string,
        public imageUrl?: string
    ) {}
}
