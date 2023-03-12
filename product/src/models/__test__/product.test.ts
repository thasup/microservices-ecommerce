import { Product } from '../product';

it('implements optimistic concurrency control', async () => {
  // Create an instance of a product
  const product = Product.build({
    title: 'Sample Dress',
    price: 1990,
    userId: '6214a0227e0d2db80ddb0860',
    images: {
      image1: './asset/sample.jpg'
    },
    colors: 'White,Black',
    sizes: 'S,M,L',
    brand: 'Uniqlo',
    category: 'Dress',
    material: 'Polyester 100%',
    description:
      'Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
    numReviews: 0,
    rating: 0,
    countInStock: 1,
    isReserved: false
  });

  // Save the product to the database
  await product.save();

  // fetch the product twice
  const firstInstance = await Product.findById(product.id);
  const secondInstance = await Product.findById(product.id);

  // make two separate changes to the products we fetched
  firstInstance!.set({ price: 1900 });
  secondInstance!.set({ price: 1890 });

  // save the first fetched product
  await firstInstance!.save();

  // save the second fetched product and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const product = Product.build({
    title: 'Sample Dress',
    price: 1990,
    userId: '6214a0227e0d2db80ddb0860',
    images: {
      image1: './asset/sample.jpg'
    },
    colors: 'White,Black',
    sizes: 'S,M,L',
    brand: 'Uniqlo',
    category: 'Dress',
    material: 'Polyester 100%',
    description:
      'Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
    numReviews: 0,
    rating: 0,
    countInStock: 1,
    isReserved: false
  });

  await product.save();
  expect(product.version).toEqual(0);
  await product.save();
  expect(product.version).toEqual(1);
  await product.save();
  expect(product.version).toEqual(2);
});
