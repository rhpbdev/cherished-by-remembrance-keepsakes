import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<
	(typeof client.api.designs)['create-from-cart-item']['$post'],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.designs)['create-from-cart-item']['$post']
>['json'];

export const useCreateDesignFromCart = () => {
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.designs['create-from-cart-item'].$post({
				json,
			});

			if (!response.ok) {
				throw new Error('Failed to create design from cart item');
			}

			return await response.json();
		},
		onError: () => {
			toast.error('Failed to create design');
		},
	});

	return mutation;
};
