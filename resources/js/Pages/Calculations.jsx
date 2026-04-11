import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from "react";
import Glucose from "@/Classes/Glucose.js";

export default function Calculations({ auth }) {
    const [glucose, setVal] = useState('5.6');

    const setMmolWhole = (value) => {
        setVal(value);
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
                        <p className="text-gray-900">Добро пожаловать в расчёты, {auth.user.name}!</p>

                        <div className="panes">
                            <div className="panes__pane">
                                <div className="panes__pane_header">Glucose</div>
                                <div className="panes__pane_content">
                                    <div className="horizontal-group">
                                        <div className="horizontal-group__start">Whole</div>
                                        <input value={glucose} onChange={e => {setMmolWhole(e.target.value)}}/>
                                        <div className="horizontal-group__end">mmol</div>
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
