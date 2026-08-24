import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<
	(typeof client.api.designs)['$post'],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.designs)['$post']
>['json'];

export const useCreateDesign = () => {
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.designs.$post({ json });
			if (!response.ok) {
				throw new Error('Something went wrong');
			}

			return await response.json();
		},
		onSuccess: () => {
			toast.success('Design created successfully');

			// TODO: invalidate "designs" query
		},
		onError: () => {
			toast.error('Failed to create design');
		},
	});

	return mutation;
};
