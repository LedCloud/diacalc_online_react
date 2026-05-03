import React, {useEffect, useState} from "react";
import {usePage, Form, useForm} from '@inertiajs/react'
import Pane from "@/Components/Pane.jsx";
import MenuTabContect from "@/Components/Settings/MenuTabContent.jsx";
import InputTwoLines from "@/Components/InputTwoLines.jsx";
import Glucose from "@/Classes/Glucose.js";
import {all} from "axios";
import GlucoseTabContent from "@/Components/Settings/GlucoseTabContent.jsx";

export default function SettingsTabbedPane() {

    const [activeTab, setActiveTab] = useState('glucose');
    const {settings, menuMasks, errors} = usePage().props;

    const [allSettings, setAllSettings] = useState(settings ?? null);

    const [activeField, setActiveField] = useState({ id: null, val: '' });
    const [targetGl, setTargetGl] = useState(new Glucose(allSettings.target));
    const [lowGl, setLowGl] = useState(new Glucose(allSettings.low_level));
    const [highGl, setHighGl] = useState(new Glucose(allSettings.high_level));

    useEffect(() => {
        setAllSettings(settings);
    }, [settings]);

    const setMmol = (val) => {
        setAllSettings({...allSettings, is_mmol: val === '1'});
    };

    const setPlasma = (val) => {
        setAllSettings({...allSettings, is_plasma: val === '1'});
    };

    const isMmol = () => {
        return Boolean(+allSettings.is_mmol);
    }

    const isPlasma = () => {
        return Boolean(+allSettings.is_plasma);
    }

    const formGlConfig = () => {
        return {
            mmol: isMmol(),
            plasma: isPlasma()
        }
    };

    const updateTarget = (val, field) => {
        setActiveField({ id: field, val: val });

        const parsed = parseFloat(val);
        if (!isNaN(parsed) && !val.endsWith('.')) {
            const newGl = new Glucose();
            const config = formGlConfig();
            newGl.setVal(val, config);
            if (field) {
                switch (field) {
                    case 'target':setTargetGl(newGl);
                        break;
                    case 'low_level': setLowGl(newGl);
                        break;
                    case 'high_level': setHighGl(newGl);
                        break;
                }
            }
        }
    };

    const formatTarget = (val, field) => {
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            const newGl = new Glucose();
            newGl.setVal(val, formGlConfig());
            if (field) {
                switch (field) {
                    case 'target':setTargetGl(newGl);
                    break;
                    case 'low_level': setLowGl(newGl);
                    break;
                    case 'high_level': setHighGl(newGl);
                    break;
                }
            }
        }
        setActiveField({ id: null, val: '' });
    };

    const valTarget = activeField.id === 'target' ? activeField.val : targetGl.getView(formGlConfig());
    const valLow = activeField.id === 'low_level' ? activeField.val : lowGl.getView(formGlConfig());
    const valHigh = activeField.id === 'high_level' ? activeField.val : highGl.getView(formGlConfig());

    return (<>
        <div className="tabs">

            <button type="button"
                    onClick={() => setActiveTab('menu')}
                    className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            >Menu
            </button>
            <button type="button"
                    onClick={() => setActiveTab('glucose')}
                    className={`tab-btn ${activeTab === 'glucose' ? 'active' : ''}`}
            >Glucose
            </button>
        </div>
        <div className="tab-content">
            <Form action="/settings_react" method="patch">
                <div className={`tab-pane settings-layout ${activeTab === 'menu' ? 'active' : ''}`}>

                    <MenuTabContect allSettings={allSettings}
                                    setAllSettings={setAllSettings}
                                    activeTab={activeTab}
                                    menuMasks={menuMasks}
                                    errors={errors}
                    />
                </div>
                <div className={`tab-pane settings-layout ${activeTab === 'glucose' ? 'active' : ''}`}>

                    <GlucoseTabContent allSettings={allSettings}
                                       setAllSettings={setAllSettings}
                                       activeTab={activeTab}
                                       menuMasks={menuMasks}
                                       errors={errors}
                   />
                </div>

                <div className="button-horizontal">
                    <button className="btn settings__btn-save primary"
                            type="submit">Save
                    </button>
                    {/*<a className="btn settings__btn-calcel default" href="{{ route(" dashboard") }}">{{
                        __(
                        'inputs.cancel')}}</a>*/}
                </div>

            </Form>
        </div>
    </>);
};
