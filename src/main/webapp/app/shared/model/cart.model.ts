import { IUser } from 'app/core/user/user.model';

export interface ICart {
    id?: number;
    user_email?: string;
    name?: string;
    price?: number;
    amount?: number;
    image_url?: string;
}

export class Cart implements ICart {
    constructor(
        public id?: number,
        public user_email?: string,
        public name?: string,
        public price?: number,
        public amount?: number,
        public image_url?: string
    ) {}
}
