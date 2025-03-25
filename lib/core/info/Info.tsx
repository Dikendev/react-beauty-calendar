import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

type InfoLevel = "info" | "warning" | "error";

interface InfoProps {
    message: string;
    level: InfoLevel;
}

const Info = ({ message, level }: InfoProps) => {
    const messageColor = useMemo(() => {
        switch (level) {
            case "info":
                return "text-blue-500";
            case "warning":
                return "text-[#ff9933]";
            case "error":
                return "text-red-500";
            default:
                return "text-blue-500";
        }
    }, [level]);

    return (
        <div
            className={`${messageColor} flex flex-row font-semibold justify-center items-center gap-1 mr-2`}
        >
            <InfoCircledIcon />
            <p>{message}</p>
        </div>
    );
};

export default Info;
