import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // If you're using react-router
import { Button } from '@/components/ui/button'; // From shadcn-ui
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Assuming you have a type for Product
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Mock fetch or integrate with your API
    const fetchProduct = async () => {
      try {
        // Here you would fetch from your backend or use mock data
        const mockProduct: Product = {
          id: productId || '1',
          name: 'Example Product',
          description: 'This is a very cool product!',
          price: 99.99,
          imageUrl: 'path/to/image.jpg'
        };
        setProduct(mockProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
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
    </div>
  );
};

export default ProductPage;
