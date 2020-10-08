export class Product {
    name: string;
    price: number;
    category: Categories; //todo change to enum
    description: string;
    specs: string; //todo review. prob chance to an array or something to use as a list
    stock: number;
}

export enum Categories{
    Casa, 
    Eletronicos, 
    Eletrodomesticos, 
    Roupas,
}