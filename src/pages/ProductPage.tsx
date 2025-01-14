import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui'; // Adjust imports based on your actual component paths
import ProductList from './ProductList'; // Assuming you have a component for listing products

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  // Add fields like category, tags that could be used to find related items
  category?: string;
  tags?: string[];
}

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch the current product
        const fetchedProduct: Product = await fetchProductById(productId); // Simulate API call
        setProduct(fetchedProduct);

        // Fetch related products based on product's category or tags
        const related = await fetchRelatedProducts(fetchedProduct.category, fetchedProduct.tags);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching product and related items:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <img src={product.imageUrl} alt={product.name} className="mb-4 w-full h-64 object-cover" />
          <p>Price: ${product.price}</p>
        </CardContent>
        <CardFooter>
          <Button>Add to Cart</Button>
        </CardFooter>
      </Card>

      {/* Related Items Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Related Items</h2>
          <ProductList products={relatedProducts} />
        </div>
      )}
    </div>
  );
};

// Mock functions for fetching data
const fetchProductById = async (id: string): Promise<Product> => {
  // Here you would make an actual API call
  return {
    id: id,
    name: "Example Product",
    description: "This is a very cool product!",
    price: 99.99,
    imageUrl: 'path/to/image.jpg',
    category: 'Electronics',
    tags: ['new', 'tech']
  };
};

const fetchRelatedProducts = async (category?: string, tags?: string[]): Promise<Product[]> => {
  // This would call your backend to get products related by category or tags
  // For now, we'll just return mock data
  return [
    { id: '2', name: 'Another Product', description: 'Another cool product', price: 79.99, imageUrl: 'path/to/another.jpg', category: 'Electronics', tags: ['deal', 'tech'] },
    // More related products...
  ];
};

export default ProductPage;
