class ReferenceErrorCustom extends ReferenceError {
    constructor(
        message = "Calendar instance is not initialized. Ensure the calendar is rendered before calling this method.",
    ) {
        super(message);
        this.name = "ReferenceErrorCustom";
    }
}

export default ReferenceErrorCustom;
