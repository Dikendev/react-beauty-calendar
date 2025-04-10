class ReferenceErrorCustom extends ReferenceError {
    constructor(message = "Reference error") {
        super(message);
        this.name = "ReferenceErrorCustom";
    }
}

export default ReferenceErrorCustom;
