export class Cart {
    itens: CartItem[] = [];

    AddItem(productID: string) {
        if (this.itens.length < 1)
            this.AddNewItem(productID);
        else {
            var addNew: boolean = true;
            this.itens.forEach(item => {
                if (productID == item.productID) {
                    item.amount++;
                    addNew = false;
                    return;
                }
            });
            if (addNew)
                this.AddNewItem(productID);
        }
    }

    private AddNewItem(productID: string) {
        var newItem: CartItem = new CartItem();
        newItem.productID = productID;
        newItem.amount++;
        this.itens.push(newItem);
    }

    RemoveItem(productID: string) {
        for (var i = 0; i < this.itens.length; i++) {
            if (productID == this.itens[i].productID) {
                if (this.itens[i].amount > 1)
                    this.itens[i].amount--;
                else
                    this.itens.splice(i, 1);
            }
        }
    }
}

class CartItem {
    productID: string;
    amount: number = 0;
}