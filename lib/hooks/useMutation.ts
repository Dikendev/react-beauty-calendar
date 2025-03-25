import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutationData = <T>(
    callbackQueryFunction: () => Promise<T>,
    ...queryKeys: string[]
) => {
    const queryClient = useQueryClient();

    const invalidateQueries = () => {
        if (queryKeys.length > 0) {
            for (const queryKey of queryKeys) {
                queryClient.invalidateQueries({
                    queryKey: [queryKey],
                });
            }
        }
    };

    const { isPending, isSuccess, isError, error, status, data } = useMutation({
        mutationFn: () => {
            return callbackQueryFunction();
        },
        onSuccess: () => invalidateQueries(),
    });

    return { isPending, isSuccess, isError, error, status, data };
};

export default useMutationData;
