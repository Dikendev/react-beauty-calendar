import { useNavigate, useSearchParams } from "react-router";

const useUrlParam = (urlQuery: string) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const fromParam = searchParams.get(urlQuery);

    const toRoute = (value: string | Record<string, string>) => {
        if (searchParams.get(urlQuery) !== value) {
            if (typeof value === "string") searchParams.set(urlQuery, value);

            if (typeof value === "object") {
                const params: Record<string, string> = {};

                for (const param in value) {
                    const value = searchParams.get(param);
                    if (value && !params[param]) params[param] = value;
                }

                if (isObjectEqual(params, value)) return;

                return setSearchParams(value);
            }
            setSearchParams(searchParams);
        }
    };

    const redirectToRoute = (urlQuery: string) => {
        return navigate(`/${urlQuery}`);
    };

    return { fromParam, toRoute, redirectToRoute };
};

const isObjectEqual = (object1: object, object2: object): boolean => {
    return JSON.stringify(object1) === JSON.stringify(object2);
};

export default useUrlParam;
