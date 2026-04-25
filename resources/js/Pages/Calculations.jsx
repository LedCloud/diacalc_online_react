import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect,useMemo } from "react";
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

export default function Calculations({ auth }) {
    // We store the underlying class instance and a "source" to track what's being typed
    const [glucose, setGlucose] = useState(new Glucose(5.6));
    const [activeField, setActiveField] = useState({ id: null, val: '' });

    // Helper to update the glucose object
    const updateGlucose = (val, config) => {
        const fieldId = config.plasma ? 'plasma' : 'whole';
        setActiveField({ id: fieldId, val: val });

        const parsed = parseFloat(val);
        if (!isNaN(parsed) && !val.endsWith('.')) {
            const newGl = new Glucose();
            newGl.setVal(val, config);
            setGlucose(newGl);
            //setActiveField({ id: null, val: '' }); // Reset draft after valid update
        } else {
            // Keep the "raw" string (like "5.") while typing
            //setActiveField({ id: config.plasma ? 'plasma' : 'whole', val });
        }
    };

    // Helper to format on blur
    const formatField = (val, config) => {
        // 3. When leaving the field, finally sync everything and clear the draft
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            const newGl = new Glucose();
            newGl.setVal(parsed.toFixed(1), config);
            setGlucose(newGl);
            setActiveField({ id: null, val: '' });
        }
        setActiveField({ id: null, val: '' }); // Now it's safe to reset
    };

    // Get display values: use draft if typing, otherwise calculate from class
    const valWhole = activeField.id === 'whole'
        ? activeField.val : glucose.getView({mmol:true, plasma:false});
    const valPlasma = activeField.id === 'plasma'
        ? activeField.val : glucose.getView({mmol:true, plasma:true});


    const handleMmolWhole = (e) => {
        const val = e.target.value;
        setMmolWhole(val);//save as is

        const parsed = parseFloat(val);
        if (!isNaN(parsed) && !val.endsWith('.')) {
            const gl = new Glucose();
            gl.setVal(val, {mmol:true, plasma:false});
            //save formatted the second and other fields
            setMmolPlasma(gl.getView({mmol:true, plasma:true}));
        }
    };

    const formatMmolWhole = (e) => {
        const parsed = parseFloat(e.target.value);
        if (!isNaN(parsed) && !e.target.value.endsWith('.')) {
            setMmolWhole(parsed.toFixed(1));
        }
    };

    const handleMmolPlasma = (e) => {
        const val = e.target.value;
        setMmolPlasma(val);

        const parsed = parseFloat(val);
        if (!isNaN(parsed) && !val.endsWith('.')) {
            const gl = new Glucose();
            gl.setVal(val, {mmol:true, plasma:true});
            //save formatted the second and other fields
            setMmolWhole(gl.getView({mmol:true, plasma:false}));
        }
    };

    const formatMmolPlasma = (e) => {
        const parsed = parseFloat(e.target.value);
        if (!isNaN(parsed) && !e.target.value.endsWith('.')) {
            setMmolPlasma(parsed.toFixed(1));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Расчёты</h2>}
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        <div className="panes">
                            <div className="panes__pane">
                                <div className="panes__pane_header">Glucose</div>
                                <div className="panes__pane_content">

            <GlucoseInput
                label="Mmol whole"
                value={valWhole}
                onChange={(v) => updateGlucose(v, {mmol:true, plasma:false})}
                onBlur={(v) => formatField(v, {mmol:true, plasma:false})}
            />

            <GlucoseInput
                label="Mmol plasma"
                value={valPlasma}
                onChange={(v) => updateGlucose(v, {mmol:true, plasma:true})}
                onBlur={(v) => formatField(v, {mmol:true, plasma:true})}
            />


                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
