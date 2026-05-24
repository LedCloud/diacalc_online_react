import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import GlucoseCalculations from "@/Components/Calculations/GlucoseCalculations.jsx";
import Pane from "@/Components/Pane.jsx";
import GlycemicInfluence from "@/Components/Calculations/GlycemicInfluence.jsx";
import React, {useState} from "react";
import BMICorrection from "@/Components/Calculations/BMICorrection.jsx";
import {useTrans} from "@/Hooks/useTrans.jsx";

export default function Calculations({ auth, user }) {
    const { __ } = useTrans();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{__('calculations')}</h2>}
        >

            <Head  title={__('calculations')} />

            <div className="py-6 md:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        <div className="calculations-layout">
                            <Pane header={__('glucose')} className="calculations-layout__pane glucose">
                                <GlucoseCalculations/>
                            </Pane>

                            <Pane header={__('glyc_influence')} className="calculations-layout__pane influence">
                                <GlycemicInfluence user={user}/>
                            </Pane>

                            <Pane header={__('bmi_correction')} className="calculations-layout__pane bmi-correction">
                                <BMICorrection/>
                            </Pane>
                            <div className="button-horizontal">
                                <a className="btn settings__btn-save primary w-full md:w-36 mt-3"
                                href={route('dashboard')}>{__('home')}</a>
                                {/*<a className="btn settings__btn-calcel default" href="{{ route(" dashboard") }}">{{
                        __(
                        'inputs.cancel')}}</a>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
