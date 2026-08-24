import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<
	(typeof client.api.designs)[':id']['$patch'],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.designs)[':id']['$patch']
>['json'];

export const useUpdateDesign = (id: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationKey: ['design', { id }],
		mutationFn: async (json) => {
			const response = await client.api.designs[':id'].$patch({
				json,
				param: { id },
			});

			if (!response.ok) {
				throw new Error('Failed to update design');
			}

			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['designs'] });
			queryClient.invalidateQueries({ queryKey: ['design', { id }] });
		},
		onError: () => {
			toast.error('Failed to update design');
		},
	});

	return mutation;
};
