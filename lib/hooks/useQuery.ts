import { useQuery } from "@tanstack/react-query";

const useQueryData = <T>(
    queryKey: string,
    callbackQueryFunction: (...params: string[]) => Promise<T>,
    params?: unknown,
) => {
    const { isPending, isLoading, isError, error, status, data } = useQuery({
        queryKey: [queryKey, params],
        queryFn: async () => await callbackQueryFunction(),
    });

    return { isPending, isLoading, isError, error, status, data };
};

export default useQueryData;
