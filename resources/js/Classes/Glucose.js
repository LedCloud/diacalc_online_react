export default class Glucose {
    constructor(val) { this.val = parseFloat(val); }
    getMgDl() { return (this.val * 18).toFixed(0); }
}
