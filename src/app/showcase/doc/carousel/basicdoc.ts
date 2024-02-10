import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Code } from '../../domain/code';
import { Product } from '../../domain/product';
import { ProductService } from '../../service/productservice';

@Component({
    selector: 'carousel-basic-demo',
    template: `
        <app-docsectiontext>
            <p>Carousel requires a collection of items as its value along with a template to render each item.</p>
        </app-docsectiontext>
        <div class="card">
            <p-carousel [value]="products" [numVisible]="3" [numScroll]="3" [circular]="false" [responsiveOptions]="responsiveOptions">
                <ng-template let-product pTemplate="item">
                    <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
                        <div class="mb-3">
                            <img src="https://primefaces.org/cdn/primeng/images/demo/product/{{ product.image }}" [alt]="product.name" class="w-6 shadow-2" />
                        </div>
                        <div>
                            <h4 class="mb-1">{{ product.name }}</h4>
                            <h6 class="mt-0 mb-3">{{ '$' + product.price }}</h6>
                            <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)"></p-tag>
                            <div class="car-buttons mt-5">
                                <p-button type="button" styleClass="p-button p-button-rounded mr-2" icon="pi pi-search"></p-button>
                                <p-button type="button" styleClass="p-button-success p-button-rounded mr-2" icon="pi pi-star-fill"></p-button>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-carousel>
        </div>
        <app-code [code]="code" selector="carousel-basic-demo" [extFiles]="extFiles"></app-code>
    `
})
export class BasicDoc implements OnInit {

    products: Product[] | undefined;

    responsiveOptions: any[] | undefined;

    constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((products) => {
            this.products = products;
            this.cdr.detectChanges();
        });

        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '991px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            }
        ];
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }

    code: Code = {
        basic: `
<p-carousel [value]="products" [numVisible]="3" [numScroll]="3" [circular]="false" [responsiveOptions]="responsiveOptions">
    <ng-template let-product pTemplate="item">
        <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
            <div class="mb-3">
                <img src="https://primefaces.org/cdn/primeng/images/demo/product/{{ product.image }}" [alt]="product.name" class="w-6 shadow-2" />
            </div>
            <div>
                <h4 class="mb-1">{{ product.name }}</h4>
                <h6 class="mt-0 mb-3">{{ '$' + product.price }}</h6>
                <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)"></p-tag>
                <div class="car-buttons mt-5">
                    <p-button type="button" styleClass="p-button p-button-rounded mr-2" icon="pi pi-search"></p-button>
                    <p-button type="button" styleClass="p-button-success p-button-rounded mr-2" icon="pi pi-star-fill"></p-button>
                </div>
            </div>
        </div>
    </ng-template>
</p-carousel>`,
        html: `
<div class="card">
    <p-carousel [value]="products" [numVisible]="3" [numScroll]="3" [circular]="false" [responsiveOptions]="responsiveOptions">
        <ng-template let-product pTemplate="item">
            <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div class="mb-3">
                    <img src="https://primefaces.org/cdn/primeng/images/demo/product/{{ product.image }}" [alt]="product.name" class="w-6 shadow-2" />
                </div>
                <div>
                    <h4 class="mb-1">{{ product.name }}</h4>
                    <h6 class="mt-0 mb-3">{{ '$' + product.price }}</h6>
                    <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)"></p-tag>
                    <div class="car-buttons mt-5">
                        <p-button type="button" styleClass="p-button p-button-rounded mr-2" icon="pi pi-search"></p-button>
                        <p-button type="button" styleClass="p-button-success p-button-rounded mr-2" icon="pi pi-star-fill"></p-button>
                    </div>
                </div>
            </div>
        </ng-template>
    </p-carousel>
</div>`,
        typescript: `
import { Component, OnInit } from '@angular/core';
import { Product } from '../../domain/product';
import { ProductService } from '../../service/productservice';

@Component({
    selector: 'carousel-basic-demo',
    templateUrl: './carousel-basic-demo.html',
    styleUrls: ['./carousel-basic-demo.scss']
})
export class CarouselBasicDemo implements OnInit {
    products: Product[] | undefined;

    responsiveOptions: any[] | undefined;

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((products) => {
            this.products = products;
        });

        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '991px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            }
        ];
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }
}`,
        scss: `
:host ::ng-deep {
    .product-item {
        .product-item-content {
            border: 1px solid var(--surface-d);
            border-radius: 3px;
            margin: .3rem;
            text-align: center;
            padding: 2rem 0;
        }
    
        .product-image {
            width: 50%;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
        }
    }
}`,
        data: `
/* ProductService */        
{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
},
...`,
        service: ['ProductService']
    };

    extFiles = [
        {
            path: 'src/domain/product.ts',
            content: `
export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}`
        }
    ];
}
