"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { updateItemQuantity } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { type Cart } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteCartItemButton from "@/features/cart/components/delete-cart-item-button";
import { useCreateDesignFromCart } from "@/features/designs/api/use-create-design-from-cart";

const CartTableComponent = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const createFromCart = useCreateDesignFromCart();

  const handleCreateFromCartItem = (item: Cart["items"][0]) => {
    createFromCart.mutate(
      {
        productSlug: item.slug,
        themeId: item.themeId,
        extractedFields: item.extractedFields,
      },
      {
        onSuccess: (data) => {
          toast.success("Design created! Redirecting to editor...");
          router.push(`/editor/${data.data.id}`);
        },
      },
    );
  };

  return (
    <>
      <h1 className='py-4 h2-bold'>Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href='/'>Go Shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-center'>Quantity</TableHead>
                  <TableHead className='text-right'>Price</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/products/${item.slug}`}
                        className='flex items-center'
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className='h-[35px] aspect-square object-contain'
                        />
                        <span className='px-2'>{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className='flex justify-center'>
                      <Select
                        disabled={isPending}
                        value={item.qty.toString()}
                        onValueChange={(value) => {
                          startTransition(async () => {
                            const res = await updateItemQuantity(
                              item.productId,
                              parseInt(value),
                            );
                            if (!res.success) {
                              toast.error(res.message);
                            } else {
                              toast.success(res.message);
                            }
                          });
                        }}
                      >
                        <SelectTrigger className='w-24'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.allowedQuantities &&
                          item.allowedQuantities.length > 0 ? (
                            item.allowedQuantities.map((qty) => (
                              <SelectItem key={qty} value={qty.toString()}>
                                {qty}
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value='25'>25</SelectItem>
                              <SelectItem value='50'>50</SelectItem>
                              <SelectItem value='75'>75</SelectItem>
                              <SelectItem value='100'>100</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className='text-right'>${item.price}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        {item.extractedFields && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleCreateFromCartItem(item)}
                            disabled={createFromCart.isPending}
                            title='Create similar design with same info'
                          >
                            {createFromCart.isPending ? (
                              <Loader className='w-4 h-4 animate-spin' />
                            ) : (
                              <Copy className='w-4 h-4' />
                            )}
                          </Button>
                        )}
                        <DeleteCartItemButton productId={item.productId} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className='p-4 gap-4'>
              {/* pass in accumulator (a), item (c) */}
              <div className='pb-3 text-xl'>
                Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):
                <span className='font-bold'>
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className='w-full'
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='w-4 h-4' />
                )}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTableComponent;
