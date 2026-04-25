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
    const gl = new Glucose(5.6);
    const initialMmolWhole = gl.getView({mmol:true, plasma:false});
    const initialMmolPlasma = gl.getView({mmol:true, plasma:true});

    const [mmolwhole, setMmolWhole] = useState(initialMmolWhole);
    const [mmolplasma, setMmolPlasma] = useState(initialMmolPlasma);

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

                                    <div className="horizontal-group">
                                        <label htmlFor="fieldMmolWhole">Mmol whole</label>
                                        <input id="fieldMmolWhole"
                                            onFocus={(e) => e.target.select()}
                                            value={mmolwhole}
                                            onChange={handleMmolWhole}
                                            onBlur={formatMmolWhole}
                                        />
                                    </div>
                                    <div className="horizontal-group">
                                        <label htmlFor="fieldMmolPlasma">Mmol plasma</label>
                                        <input id="fieldMmolPlasma"
                                            onFocus={(e) => e.target.select()}
                                            value={mmolplasma}
                                            onChange={handleMmolPlasma}
                                            onBlur={formatMmolPlasma}
                                        />
                                    </div>


                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
