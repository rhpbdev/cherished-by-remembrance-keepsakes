import { InferResponseType } from 'hono';
import { useInfiniteQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import { useSession } from 'next-auth/react';

export type ResponseType = InferResponseType<
	(typeof client.api.designs)['$get'],
	200
>;

export const useGetDesigns = () => {
	const { data: session, status } = useSession();

	const query = useInfiniteQuery<ResponseType, Error>({
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.nextPage,
		queryKey: ['designs', { userId: session?.user?.id ?? null }],
		queryFn: async ({ pageParam }) => {
			const response = await client.api.designs.$get({
				query: {
					page: (pageParam as number).toString(),
					limit: '5',
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch designs');
			}

			return response.json();
		},
		// Don't fetch until we know the auth state
		enabled: status !== 'loading',
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return query;
};
