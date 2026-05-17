import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Pane from "@/Components/Pane.jsx";
import Glucose from "@/Classes/Glucose.js";
import { useState } from 'react';

export default function Settings({ auth, factors, settings }) {
    const [factorsByTime, setFactorsByTime] = useState(Boolean(settings.factors_by_time));
    console.log(factors,   settings);

    const config = {
        mmol: Boolean(settings.is_mmol),
        plasma: Boolean(settings.is_plasma),
        precision: 2
    };

    console.log(config);
    const gl = new Glucose(5.6);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Factors</h2>}
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <Pane header="Factors" className="factors-layout__pane factors">
                            <div className="field">
                                <label className="checkbox-group" htmlFor="timedFactors">
                            <input id="timedFactors"
                                   checked={factorsByTime}
                                   name="timedFactors"
                                   value="timed"
                                   onChange={(e) => setFactorsByTime(e.target.checked)}
                                   type="checkbox"/>Factors by time</label>
                            </div>
                            <fieldset>
                                <legend>Factors</legend>
                                <table>
                                    <tr>
                                        <th></th>
                                        <th>Time</th>
                                        <th>K1</th>
                                        <th>K2</th>
                                        <th>OUV</th>
                                    </tr>
                                    <tbody>
                                        {factors.map(row => {
                                            gl.val = row.k3;
                                            return (
                                                <tr key={row.id}>
                                                    <td>INPUT</td>
                                                    <td>{row.time}</td>
                                                    <td>{row.k1}</td>
                                                    <td>{row.k2}</td>
                                                    <td>{gl.getView(config)}</td>
                                                </tr>
                                            )})}
                                    </tbody>
                                </table>
                                            Buttons row
                            </fieldset>
                        </Pane>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
