"use server";

import { db } from "@/drizzle/db";
import { ProductTable, ProductVariantTable } from "@/drizzle/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  lte,
  type SQL,
} from "drizzle-orm";
// import { convertToPlainObject } from '../utils';
import {
  FEATURED_PRODUCTS_LIMIT,
  LATEST_PRODUCTS_LIMIT,
  PAGE_SIZE,
} from "../constants";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import z from "zod";

// Get latest products
export async function getLatestProducts() {
  const data = await db
    .select()
    .from(ProductTable)
    .limit(LATEST_PRODUCTS_LIMIT)
    .orderBy(desc(ProductTable.createdAt));

  // console.log(data);

  return data;
}

// Get single product by its slug (storefront — active variants only)
export async function getProductBySlug(slug: string) {
  return await db.query.ProductTable.findFirst({
    where: eq(ProductTable.slug, slug),
    with: {
      variants: {
        where: eq(ProductVariantTable.isActive, true),
      },
    },
  });
}

// Get single product by its ID (admin — all variants, incl. inactive)
export async function getProductById(productId: string) {
  const data = await db.query.ProductTable.findFirst({
    where: eq(ProductTable.id, productId),
    with: {
      variants: true,
    },
  });

  return data;
}

// Get all products (Drizzle ORM)
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Build filters
  const filters = [
    query && query !== "all" && ilike(ProductTable.name, `%${query}%`),
    category && category !== "all" && eq(ProductTable.category, category),
    price &&
      price !== "all" &&
      (() => {
        const [min, max] = price.split("-");
        return and(gte(ProductTable.price, min), lte(ProductTable.price, max));
      })(),
    rating && rating !== "all" && gte(ProductTable.rating, rating),
  ].filter(Boolean) as SQL[];

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  // Sort mapping
  const sortMap = {
    lowest: asc(ProductTable.price),
    highest: desc(ProductTable.price),
    rating: desc(ProductTable.rating),
  };
  const orderBy =
    sortMap[sort as keyof typeof sortMap] || desc(ProductTable.createdAt);

  // Execute queries
  const data = await db.query.ProductTable.findMany({
    where: whereClause,
    orderBy,
    limit,
    offset: (page - 1) * limit,
  });

  const [{ dataCount }] = await db
    .select({ dataCount: count() })
    .from(ProductTable)
    .where(whereClause);

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const productExists = await db.query.ProductTable.findFirst({
      where: eq(ProductTable.id, id),
    });

    if (!productExists) throw new Error("Product not found");

    await db.delete(ProductTable).where(eq(ProductTable.id, id));

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    const [created] = await db
      .insert(ProductTable)
      .values({
        ...product,
      })
      .returning({ id: ProductTable.id });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
      data: { id: created.id },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await db.query.ProductTable.findFirst({
      where: eq(ProductTable.id, product.id),
    });

    if (!productExists) throw new Error("Product not found");

    await db
      .update(ProductTable)
      .set({
        ...product,
      })
      .where(eq(ProductTable.id, product.id));

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all categories (Drizzle ORM)
export async function getAllCategories() {
  const data = await db
    .select({
      category: ProductTable.category,
      _count: count(),
    })
    .from(ProductTable)
    .groupBy(ProductTable.category);

  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await db.query.ProductTable.findMany({
    where: eq(ProductTable.isFeatured, true),
    orderBy: asc(ProductTable.name),
    limit: FEATURED_PRODUCTS_LIMIT,
  });

  return data;
}
