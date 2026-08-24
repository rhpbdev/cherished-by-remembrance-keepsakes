import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<
	(typeof client.api.designs)[':id']['$delete'],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.designs)[':id']['$delete']
>['param'];

export const useDeleteDesign = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (param) => {
			const response = await client.api.designs[':id'].$delete({
				param,
			});

			if (!response.ok) {
				throw new Error('Failed to delete design');
			}

			return await response.json();
		},
		onSuccess: ({ data }) => {
			queryClient.invalidateQueries({ queryKey: ['designs'] });
			queryClient.invalidateQueries({ queryKey: ['design', { id: data.id }] });
		},
		onError: () => {
			toast.error('Failed to delete design');
		},
	});

	return mutation;
};
