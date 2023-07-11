import React, { useState, useEffect } from 'react';
import Card from '@/app/Card';
import Pagination from '../Main/Pagination';

import useProductList from '../Api/fetchProductData';

interface Product {
    product_id: string;
    updated_at: string;
    name: string;
    product_state: string;
    has_stock: boolean;
    recommended_prices: {
        amount: number;
        currency: string;
        country: string;
    }[];
    manufacturer: {
        manufacturer_id: string;
        manufacturer_name: string;
    };
    brand: {
        brand_id: string;
        name: string;
    };
    main_category: {
        category_id: string;
        category_name: string;
    };
}

interface ProductListProps {
    selectedCategories: string[];
    selectedBrands: string[];
}

const ProductList: React.FC<ProductListProps> = ({
    selectedCategories,
    selectedBrands,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const apiUrl = 'https://graphql.stg.promofarma.com/graphql';
    const pageSize = 14;
    const products = useProductList(apiUrl, pageSize);

    const ITEMS_PER_PAGE = 8; // Number of items to display per page

    useEffect(() => {
        setFilteredProducts(products);
        setCurrentPage(1); // Reset to the first page when filters change
    }, [selectedCategories, selectedBrands, products]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const displayedProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="flex flex-wrap my-3">
            {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                    <div
                        className="w-full sm:w-1/2 lg:w-1/4 p-2"
                        key={product.product_id}
                    >
                        <Card
                            id={product.product_id}
                            name={product?.name ?? ''}
                            price={
                                product.recommended_prices.find(
                                    (price) => price.country === 'ES',
                                )?.amount ??
                                product.recommended_prices[0]?.amount ??
                                'Not available'
                            }
                            state={product.product_state}
                            brandId={product.brand.brand_id}
                            brandName={product.brand.name}
                            favorite={false}
                            favoriteImg=""
                        />
                    </div>
                ))
            ) : (
                <p>No products available.</p>
            )}
            <div className="">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default ProductList;
