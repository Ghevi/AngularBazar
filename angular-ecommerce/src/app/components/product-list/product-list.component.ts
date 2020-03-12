import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
  //templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;

  // New properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { } //inject the activatedRoute (access route parameters)

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword'); //come from search/:keyword from  app-module.ts

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    //now search for products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts(){

    // Check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id'); //.route use the activated route, 
                                                                          //.snapshot State of the route atm, 
                                                                          //.paramMap map of all route parameters,
                                                                          // ('id') read the id parameter

    if (hasCategoryId) {
      // get the id param string. convert strin to a number using the + symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      // not category id available...default to category id 1
      this.currentCategoryId = 1;
    }                      

    //
    // Check if we have different catergory id than previous
    // Note: Angular will reuse a component if it is currently  being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
    
    //now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber -1, // Angular pages are 1 based so we need to decrement by 1
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  processResult(){
    return data => {
      // Properties defined in this class = data from spring data rest json.
      // (the metadata block at the end of the webpage http://localhost:8080/api/products?page=n&size=n)
      this.products = data._embedded.products;    
      this.thePageNumber = data.page.number + 1; // Spring data rest pages are 0 based so we need to increment by 1
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.theTotalElements;
    };
  }
}
