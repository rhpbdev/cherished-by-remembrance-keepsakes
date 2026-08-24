import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/hono';

export type ResponseType = InferResponseType<
	(typeof client.api.designs)[':id']['$get'],
	200
>;

export const useGetDesign = (id: string) => {
	const query = useQuery({
		enabled: !!id,
		queryKey: ['design', { id }],
		queryFn: async () => {
			const response = await client.api.designs[':id'].$get({
				param: { id },
			});

			if (response.status === 404) {
				throw new Error('Design not found');
			}

			if (!response.ok) {
				throw new Error('Failed to fetch design');
			}

			const { data } = await response.json();
			return data;
		},
		retry: (failureCount, error) => {
			// Don't retry on 404 or other client errors
			if (error.message === 'Design not found') {
				return false;
			}
			return failureCount < 3;
		},
		retryDelay: 1000,
	});

	return query;
};
