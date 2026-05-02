import React, {useEffect, useState} from "react";
import {usePage, Form, useForm} from '@inertiajs/react'
import MaskInput from "@/Components/Settings/MaskInput.jsx";
import GlucoseCalculations from "@/Components/Calculations/GlucoseCalculations.jsx";
import Pane from "@/Components/Pane.jsx";
import InputTwoLines from "@/Components/InputTwoLines.jsx";

export default function SettingsTabbedPane() {

    const [activeTab, setActiveTab] = useState('menu');
    const {settings, menuMasks, errors} = usePage().props;
    const [allSettings, setAllSettings] = useState(settings ?? null);
    //const [menuInfo, setMenuInfo] = useState(settings?.menu_info);
    //const [roundTo, setRoundTo] = useState(settings?.round_to);
    //const [caloryLimit, setCaloryLimit] = useState(settings?.calory_limit);
    //const [caloryLimitStr, setCaloryLimitStr] = useState(caloryLimit);



    useEffect(() => {
        setAllSettings(settings);
    }, [settings]);

    const setMmol = (val) => {
        setAllSettings({...allSettings, is_mmol: val === '1'});
    };

    const setPlasma = (val) => {
        setAllSettings({...allSettings, is_plasma: val === '1'});
    };

    const setMenuInfo = (val) => {
        setAllSettings({...allSettings, menu_info: val});
    };

    const setRoundTo = (val) => {
        console.log(val);
        setAllSettings({...allSettings, round_to: val});
    };

    const changeCaloryLimit = (val) => {
        setAllSettings({...allSettings, calory_limit: val});
    };

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

                    <Pane header="Menu"
                        className={`menu_pane tab-pane panes__pane ${activeTab === 'menu' ? 'active' : ''}`}>
                        <input type="hidden" name="menu_info" value={allSettings.menu_info}/>
                        <fieldset>
                            <legend>Menu info</legend>
                            <MaskInput name="prot" strName='Prots' masks={menuMasks}
                                      menuInfo={allSettings.menu_info}
                                      handlerInfo={setMenuInfo}/>

                            <MaskInput name="fat"
                                       strName='Fats'
                                       masks={menuMasks} menuInfo={allSettings.menu_info} handlerInfo={setMenuInfo}/>

                            <MaskInput name="carb"
                                       strName='Carbs'
                                       masks={menuMasks} menuInfo={allSettings.menu_info} handlerInfo={setMenuInfo}/>

                            <MaskInput name="be"
                                       strName='BE'
                                       masks={menuMasks} menuInfo={allSettings.menu_info} handlerInfo={setMenuInfo}/>

                            <MaskInput name="dose"
                                       strName='Dose'
                                       masks={menuMasks} menuInfo={allSettings.menu_info} handlerInfo={setMenuInfo}/>

                            <MaskInput name="gi"
                                       strName='GI'
                                       masks={menuMasks} menuInfo={allSettings.menu_info} handlerInfo={setMenuInfo}/>

                            <MaskInput name="gl"
                                       strName='GL'
                                       masks={menuMasks} menuInfo={allSettings.menu_info} handlerInfo={setMenuInfo}/>

                            <MaskInput name="calory"
                                       strName='Calory'
                                       masks={menuMasks} menuInfo={allSettings.menu_info} handlerInfo={setMenuInfo}/>
                        </fieldset>
                        <fieldset>
                            <div className="field">
                                <label htmlFor="round-to">Round dose to</label>
                                <select id="round-to"
                                        name="round_to"
                                        value={allSettings.round_to}
                                        onChange={(e) => {
                                            setRoundTo(+e.target.value)
                                        }}
                                >
                                    <option value="0">to int</option>
                                    <option value="1">to 1/2</option>
                                    <option value="2">to 1/4</option>
                                </select>
                            </div>
                            <div className="field">
                                <InputTwoLines value={allSettings.calory_limit}
                                               label="Calory limit"
                                               name="calory_limit"
                                               onChange={changeCaloryLimit}
                                />
                                {errors.calory_limit && <div className="validation-error">{errors.calory_limit}</div>}
                            </div>
                        </fieldset>
                    </Pane>
                </div>
                <div className={`tab-pane settings-layout ${activeTab === 'glucose' ? 'active' : ''}`}>
                    <Pane header="Glucose"
                          className={`glucose_pane tab-pane panes__pane ${activeTab === 'glucose' ? 'active' : ''}`}>
                        <fieldset>
                            <legend>Whole/Plasma</legend>
                            <div className="horizontal-group checkbox-group">
                                <label htmlFor="whole">
                                    <input id="whole"
                                           name="is_plasma"
                                           value="0"
                                           type="radio"
                                           checked={Boolean(!(+allSettings.is_plasma))}
                                           onChange={(e) => setPlasma(e.target.value)}
                                    />
                                    Whole</label>
                            </div>
                            <div className="horizontal-group checkbox-group">
                                <label htmlFor="plasma">
                                    <input id="plasma"
                                           name="is_plasma"
                                           value="1"
                                           type="radio"
                                           checked={Boolean(+allSettings.is_plasma)}
                                           onChange={(e) => setPlasma(e.target.value)}
                                    />
                                    Plasma</label>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Blood glucose</legend>
                            <div className="horizontal-group checkbox-group">
                                <label htmlFor="mmol">**{allSettings.is_mmol}++
                                    <input id="mmol"
                                           name="is_mmol"
                                           value="1"
                                           type="radio"
                                           checked={Boolean(+allSettings.is_mmol)}
                                           onChange={(e) => setMmol(e.target.value)}
                                    />
                                    mmol</label>
                            </div>
                            <div className="horizontal-group checkbox-group">
                                <label htmlFor="mgdl">
                                    <input id="mgdl"
                                           name="is_mmol"
                                           value="0"
                                           type="radio"
                                           checked={Boolean(!(+allSettings.is_mmol))}
                                           onChange={(e) => setMmol(e.target.value)}
                                    />
                                    mgdl</label>
                            </div>

                        </fieldset>
                    </Pane>
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
