import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import GlucoseCalculations from "@/Components/Calculations/GlucoseCalculations.jsx";
import Pane from "@/Components/Pane.jsx";
import GlycemicInfluence from "@/Components/Calculations/GlycemicInfluence.jsx";
import React, {useState} from "react";
import BMICorrection from "@/Components/Calculations/BMICorrection.jsx";

export default function Calculations({ auth, user }) {
    const [weight, setWeight] = useState('60');
    const [height, setHeight] = useState('170');
    const [age, setAge] = useState('40');
    const [targetWeight, setTargetWeight] = useState('60');
    const [period, setPeriod] = useState(['12']);

    const calcBmi = () => {
        const parsedW = parseFloat(weight);
        const parsedH = parseFloat(height);
        if (isNaN(parsedW) || isNaN(parsedH)) {
            return '---';
        }
        return (10000 * parsedW /( parsedH * parsedH)).toFixed(1);
    };

    const bmi = calcBmi();

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
                            <Pane header="Glucose">
                                <GlucoseCalculations />
                            </Pane>

                           <Pane header="Glycemic factors">
                                <GlycemicInfluence user={user} />
                           </Pane>
                        </div>
                        <Pane header="ИМТ и коррекция веса">
                            <BMICorrection />
                        </Pane>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
