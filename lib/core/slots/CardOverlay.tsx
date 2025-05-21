import { DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

const CardOverlay = ({ children }: PropsWithChildren) => {
    return (
        <DragOverlay
            modifiers={[restrictToWindowEdges]}
            dropAnimation={{
                duration: 500,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}
            className="Draggable dragging"
        >
            <motion.div
                style={{ height: "100%", width: "100%" }}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                    mass: 0.5,
                }}
            >
                {children}
            </motion.div>
        </DragOverlay>
    );
};

export default CardOverlay;
