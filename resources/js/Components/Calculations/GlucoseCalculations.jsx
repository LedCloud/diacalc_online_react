import React, { useState } from "react";
import Glucose from "@/Classes/Glucose.js";

const GlucoseInput = ({ label, value, onChange, onBlur }) => (
    <div className="horizontal-group">
        <label>{label}</label>
        <input
            onFocus={(e) => e.target.select()}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur(e.target.value)}
        />
    </div>
);

const findName = ({mmol = true, plasma = false, hba1c = false}) => {
    if (hba1c)
        return 'hba1c';
    if (mmol && !plasma)
        return "mmolWhole";
    if (mmol && plasma)
        return "mmolPlasma";
    if (!mmol && !plasma)
        return "mgdlWhole";
    return "mgdlPlasma";
}

const GlucoseCalculations = () => {
    const [glucose, setGlucose] = useState(new Glucose(5.6));
    const [activeField, setActiveField] = useState({ id: null, val: '' });

    // Helper to update the glucose object
    const updateGlucose = (val, config) => {
        let fieldId;
        if (config.hba1c)
            fieldId = 'hba1c';
        else
            fieldId = findName(config);
        setActiveField({ id: fieldId, val: val });

        const parsed = parseFloat(val);
        if (!isNaN(parsed) && !val.endsWith('.')) {
            const newGl = new Glucose();
            if (config.hba1c)
                newGl.setHbA1c(val);
            else
                newGl.setVal(val, config);
            setGlucose(newGl);
            //setActiveField({ id: null, val: '' }); // Reset draft after valid update
        }
    };

    // Helper to format on blur
    const formatField = (val, config) => {
        // 3. When leaving the field, finally sync everything and clear the draft
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            const newGl = new Glucose();
            if (config.hba1c)
                newGl.setHbA1c(val);
            else
                newGl.setVal(parsed.toFixed(1), config);
            setGlucose(newGl);
            //setActiveField({ id: null, val: '' });
        }
        setActiveField({ id: null, val: '' }); // Now it's safe to reset
    };

    const valMmolWhole = activeField.id === 'mmolWhole'
        ? activeField.val : glucose.getView({mmol:true, plasma:false});
    const valMmolPlasma = activeField.id === 'mmolPlasma'
        ? activeField.val : glucose.getView({mmol:true, plasma:true});
    const valMgdlWhole = activeField.id === 'mgdlWhole'
        ? activeField.val : glucose.getView({mmol:false, plasma:false});
    const valMgdlPlasma = activeField.id === 'mgdlPlasma'
        ? activeField.val : glucose.getView({mmol:false, plasma:true});
    const valHbA1c = activeField.id === 'hba1c' ? activeField.val : glucose.getHbA1c();

    return (<>
                <GlucoseInput
                    label="Mmol whole"
                    value={valMmolWhole}
                    onChange={(v) => updateGlucose(v, {mmol:true, plasma:false})}
                    onBlur={(v) => formatField(v, {mmol:true, plasma:false})}
                />

                <GlucoseInput
                    label="Mmol plasma"
                    value={valMmolPlasma}
                    onChange={(v) => updateGlucose(v, {mmol:true, plasma:true})}
                    onBlur={(v) => formatField(v, {mmol:true, plasma:true})}
                />

                <GlucoseInput
                    label="Mgdl whole"
                    value={valMgdlWhole}
                    onChange={(v) => updateGlucose(v, {mmol:false, plasma:false})}
                    onBlur={(v) => formatField(v, {mmol:false, plasma:false})}
                />

                <GlucoseInput
                    label="Mgdl plasma"
                    value={valMgdlPlasma}
                    onChange={(v) => updateGlucose(v, {mmol:false, plasma:true})}
                    onBlur={(v) => formatField(v, {mmol:false, plasma:true})}
                />

                <GlucoseInput
                    label="HbA1c"
                    value={valHbA1c}
                    onChange={(v) => updateGlucose(v, {hba1c: true})}
                    onBlur={(v) => formatField(v, {hba1c: true})}
                />
        </>
    );
};

export default GlucoseCalculations;
