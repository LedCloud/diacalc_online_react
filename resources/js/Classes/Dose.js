export default class Dose {
    constructor(item) { this.val = parseFloat(item); }
    setFatcors(factors){
        this.factors = factors;
    }
}
