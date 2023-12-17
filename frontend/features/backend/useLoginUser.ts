import { axiosBackend } from '@/lib/axios';
import { ErrorResponse, LoginPayload, SuccesResponse } from '@/types/backend';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function useLoginUser({
    onSuccess,
    onError,
}: {
    onSuccess: (data: SuccesResponse) => void;
    onError: (error: ErrorResponse) => void;
}) {
    return useMutation({
        mutationKey: ['login.user'],
        mutationFn: async (payload: LoginPayload) => {
            try {
                const { data } = await axiosBackend.post<SuccesResponse>(
                    '/auth/login',
                    payload
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
