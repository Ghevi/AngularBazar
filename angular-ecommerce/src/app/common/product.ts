export class Product {

    id: string;
    sku: string;
    name: string;
    description: string;
    unitPrice: number;
    imageUrl: string;
    active: boolean;
    unitsInStock: number;
    dateCreated: Date;
    lastUpdate: Date;

}


//We have no id property define here so with angular language service this bug is caught, it is an extension for the IDE
//The app still works and there are no error in the dev console in the broswer! But down the road it can cause many problems so you
//must fix it