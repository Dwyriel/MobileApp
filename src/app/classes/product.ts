export class Product {
    posterID: string;
    name: string;
    gallery: string[] = [];
    price: number;
    category: Categories; //made it work, good stuff for now.
    description: string;
    specs: string; //todo review. prob chance to an array or something to use as a list
    stock: number;
}

export enum Categories {
    Casa,
    Eletronicos,
    Eletrodomesticos,
    Roupas,
}