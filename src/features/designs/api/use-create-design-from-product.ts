import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<
	(typeof client.api.designs)['create-from-product']['$post'],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.designs)['create-from-product']['$post']
>['form'];

export const useCreateDesignFromProduct = () => {
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (form) => {
			const response = await client.api.designs['create-from-product'].$post({
				form,
			});

			if (!response.ok) {
				throw new Error('Failed to create design from product');
			}

			return await response.json();
		},
		onError: () => {
			toast.error('Failed to create design');
		},
	});

	return mutation;
};
