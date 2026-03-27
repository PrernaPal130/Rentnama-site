import ProductDetailClient from "../ProductDetailClient";

export default async function ProductByIdPage({ params }) {
  const { id } = await params;
  return <ProductDetailClient productId={id} />;
}
