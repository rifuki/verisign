'use client';

import { axiosJsonPlace } from '@/lib/axios';
import { Post } from '@/types/json_place';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import useFetchPing from '@/features/backend/useFetchPing';

export default function useFetchJsonPlace() {
    const { } = useFetchPing();

    return useQuery({
        queryKey: ['fetch.json_place'],
        queryFn: async () => {
            try {
                const { data } = await axiosJsonPlace.get<Post[]>('/posts');
                return data;
            } catch (error) {
                const err = error as AxiosError;
                console.log(err);
                throw new Error(err.message);
            }
        },
    });
}
