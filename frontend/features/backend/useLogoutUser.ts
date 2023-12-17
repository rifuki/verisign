import { axiosBackend } from '@/lib/axios';
import { ErrorResponse, SuccesResponse } from '@/types/backend';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function useLogoutUser({
    onSuccess,
    onError,
}: {
    onSuccess: (data: SuccesResponse) => void;
    onError: (error: ErrorResponse) => void;
}) {
    return useMutation({
        mutationKey: ['logout.user'],
        mutationFn: async () => {
            try {
                const { data } = await axiosBackend.get<SuccesResponse>(
                    '/auth/logout'
                );
                return data;
            } catch (error) {
                const err = error as AxiosError<ErrorResponse>;
                throw new Error(err.response?.data.message);
            }
        },
        onSuccess,
        onError,
    });
}
