import { axiosBackend } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function useFetchPing() {
    const router = useRouter();

    return useQuery({
        queryKey: ['fetch.ping'],
        queryFn: async () => {
            try {
                const { data } = await axiosBackend.get("/auth/ping");
                console.log(data);
                return data;
            } catch (error) {
                const err = error as AxiosError;
                router.push("/login");
            }
        },
    })
}