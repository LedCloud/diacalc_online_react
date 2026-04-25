import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import GlucoseCalculations from "@/Components/GlucoseCalculations.jsx";
import Pane from "@/Components/Pane.jsx";
import GlycemicInfluence from "@/Components/GlycemicInfluence.jsx";
import React, {useState} from "react";
import InputTwoLines from "@/Components/InputTwoLines.jsx";

export default function Calculations({ auth, user }) {
    const [weight, setWeight] = useState('60');
    const [height, setHeight] = useState('170');
    const [age, setAge] = useState('40');
    const [targetWeight, setTargetWeight] = useState('60');
    const [period, setPeriod] = useState('12');

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
                            <div className="three-columns">
                                <div className="weight-section">
                                    <div className="weight-section__bmi-label">ИМТ</div>
                                    <div className="weight-section__bmi-value">{bmi}</div>
                                    <div className="weight-section__weight-label">Вес кг:</div>
                                    <input
                                        className="weight-section__weight-input"
                                        value={weight} onChange={(e) => setWeight(e.target.value)}/>
                                    <div className="weight-section__height-label">Рост см:</div>
                                    <input
                                        className="weight-section__height-input"
                                        value={height} onChange={(e) => setHeight(e.target.value)}/>
                                    <div className="weight-section__note">Внимание! ИМТ рассчитанный у детей (до 18
                                        лет), должен интерпретироваться специальным образом!
                                        Подробнее <a href="https://diacalc.ru/BMIchildren.html">тут</a></div>
                                </div>
                                <div className="target-section">
                                    <InputTwoLines value={age} label="Возраст"/>
                                    <InputTwoLines value={targetWeight} label="Целевой вес"/>
                                    <div className="vertical-group">
                                        <label>Период коррекции</label>
                                        {/* add calculation based on age, targetWeight, sex and activity
                                        <select value={period} onChange={(e) => setPeriod(e.target.value)} >*/}
                                        {/*    {[1, 2, 5, 10].map((value) => (*/}
                                        {/*        <tr key={value}>*/}
                                        {/*            <td>{value}</td>*/}
                                        {/*            <td>{calcCarboInfluence(value)}</td>*/}
                                        {/*        </tr>*/}
                                        {/*    ))}*/}
                                        {/*</select>*/}
                                    </div>
                                </div>
                                <div className="results-section">
                                    Results
                                </div>
                            </div>
                        </Pane>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
