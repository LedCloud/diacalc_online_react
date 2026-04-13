export default class Glucose {
    //Изначально храним СК в ммоль и цельной крови
    constructor(val) { this.val = parseFloat(val); }
    setVal(val, is_mmol = true, is_plasma = false) {
        let parsed = parseFloat(val);
        if (isNaN(parsed)) {
            parsed = 0;
        }
        this.val = parsed / this.getFactor(is_mmol, is_plasma);
    }
    getView(is_mmol, is_plasma) {
        if (this.val === 0) return '';
        return (this.val * this.getFactor(is_mmol, is_plasma)).toFixed(is_mmol?1:0);
    }
    getFactor(is_mmol, is_plasma){ return (is_plasma?1.12:1) * (is_mmol ? 1 : 18);};
    getHbA1c(){
        return ((this.val * 1.12 + 2.59) / 1.59).toFixed(1);
    }
    setHbA1c(val){
        let parsed = parseFloat(val);
        if (isNaN(parsed)) {
            parsed = 0;
        }
        this.val = (parsed * 1.59 - 2.59)/1.12;
    }
}
