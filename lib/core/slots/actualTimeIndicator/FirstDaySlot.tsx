interface FirstDaySlotProps {
    isRendered: boolean;
    dateToRender: string;
}

const FirstDaySlot = ({ isRendered, dateToRender }: FirstDaySlotProps) => {
    const constraintToRenderTime = isRendered && dateToRender;

    return (
        <>
            {constraintToRenderTime && (
                <div className="first_day_slot">
                    <span>
                        <strong>{dateToRender}</strong>
                    </span>
                </div>
            )}
        </>
    );
};

export default FirstDaySlot;
