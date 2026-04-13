import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect,useMemo } from "react";
import Glucose from "@/Classes/Glucose.js";

export default function Calculations({ auth }) {
    // 1. Hooks first
    const [glucose, setGlucose] = useState(5.6); // Store the raw number
    const [inputValue, setInputValue] = useState('5.6'); // Store the typing string

    // 2. Derive your class instance (useMemo prevents recreating it 100 times a second)
    const gl = useMemo(() => new Glucose(glucose), [glucose]);


    const handleChange = (e) => {
        const val = e.target.value;
        setInputValue(val); // Update what the user sees immediately

        const parsed = parseFloat(val);
        if (!isNaN(parsed) && !val.endsWith('.')) {
            setGlucose(parsed); // Update the "source of truth"
        }
    };

    const setGl = (value, is_mmol, is_plasma) => {
        gl.setVal(value, is_mmol, is_plasma);
        setVal(gl.val);
    };

    const setHbA1c = (value) => {
        gl.setHbA1c(value);
        setVal(gl.val);
    }

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
                                        <div className="label-pre">Whole</div>
                                        <input value={gl.getView(true, false)}
                                        onFocus={(e) => e.target.select()}
                                        onChange={handleChange}
                                        onBlur={()=>{
                                            setInputValue(gl.getView(true, false));
                                        }}
                                        />
                                        <div className='label-post'>mmol/l</div>

                                        <div className="label-pre">Plasma</div>
                                        <input value={gl.getView(true, true)}
                                        onFocus={(e) => e.target.select()}
                                        onChange={e => {setGl(e.target.value, true, true)}}/>
                                        <div className="label-post">mmol/l</div>

                                        <div className="label-pre">Whole</div>
                                        <input value={gl.getView(false, false)}
                                        onFocus={(e) => e.target.select()}
                                        onChange={e => {setGl(e.target.value, false, false)}}/>
                                        <div className="label-post">mg/dl</div>

                                        <div className="label-pre">Plasma</div>
                                        <input value={gl.getView(false, true)}
                                        onFocus={(e) => e.target.select()}
                                        onChange={e => {setGl(e.target.value, false, true)}}/>
                                        <div className="label-post">mg/dl</div>

                                        <div className="label-pre">HbA1c</div>
                                        <input value={gl.getHbA1c()}
                                        onFocus={(e) => e.target.select()}
                                        onChange={e => {setHbA1c(e.target.value)}}/>
                                        <div className="label-post">%</div>
                                    </div>


                                    {/* <div className="horizontal-group">
                                        <div className="horizontal-group__start">Whole</div>
                                        <input value={glucose} onChange={e => {setMmolWhole(e.target.value)}}/>
                                        <div className="horizontal-group__end">mmol</div>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
