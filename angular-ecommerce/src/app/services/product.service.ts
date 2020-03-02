import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {

    // @TODO: need to build URL based on category id --> @DONE
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    
    
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(  //baseUrl --> searchUrl
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(  //Call REST API
      map(response => response._embedded.productCategory) // Returns an observable, maps JSON data from Spring Data REST to productCategory array
    );
  }

}

interface GetResponseProducts {
  _embedded:{
    products: Product[];
  }
}

interface GetResponseProductCategory {  //Unwraps the JSON from Spring Data REST using _embedded entry
  _embedded:{
    productCategory: ProductCategory[];
  }
}