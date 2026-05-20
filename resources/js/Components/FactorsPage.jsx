import React, {useEffect, useState} from 'react';
import {usePage, Form} from '@inertiajs/react'
import Pane from "@/Components/Pane.jsx";
import InputTwoLines from "@/Components/InputTwoLines.jsx";
import Glucose from "@/Classes/Glucose.js";
export default function Factors()
{
    const {settings, factors, errors} = usePage().props;
    const [allSettings, setAllSettings] = useState(settings ?? null);
    const [rFactors, setRFactors] = useState(factors ?? null);

    const config = {
        mmol: Boolean(settings.is_mmol),
        plasma: Boolean(settings.is_plasma),
        precision: 2
    };

    const [dialogK3, setK3Dialog] = useState((new Glucose(2)).getView(config));

    useEffect(() => {
        setAllSettings(settings);
        setRFactors(factors);
    }, [settings, factors]);

    const setVal = (val, name) => {
        setAllSettings({...allSettings, [name]: val});
    };

    const formatVal = (val, name) => {
        const parsed = parseFloat(val);
        if (!isNaN(parsed) && !val.endsWith('.')) {
            setAllSettings({...allSettings, [name]: parsed.toFixed(0)});
        }
    };

    const calculateOUV = () => {
        //if (!$base->query("UPDATE `coefs` SET `k3`=".
        //             $k3factor."/(".$weight."*`k1`*10/".$be.") WHERE `iduser`='".$user_id."';")){
        setRFactors(latest => {
            return latest.map(row => {
                return {
                    id: row.id,
                    time: row.time,
                    k1: row.k1,
                    k2: row.k2,
                    k3: +allSettings.k3_factor / (allSettings.weight * row.k1 * 10 / allSettings.be),
                };
            });
        });
    };

    return (
        <>
            <Form action="/factors" method="patch">
                <Pane header="Factors" className="factors-layout__pane factors">
                    <fieldset>
                        <legend>Factors</legend>

                        <div className="field">
                            <label className="checkbox-group" htmlFor="timedFactors">
                                <input id="timedFactors"
                                       checked={Boolean(allSettings.factors_by_time)}
                                       name="factors_by_time"
                                       value="timed"
                                       onChange={(e) => {
                                           setAllSettings({
                                               ...allSettings,
                                               factors_by_time: (e.target.checked ? 1 : 0)
                                           });
                                       }}
                                       type="checkbox"/>Factors by time</label>
                        </div>
                        <InputTwoLines value={allSettings.weight}
                                       name="weight"
                                       id="weight"
                                       field="weight"
                                       label="Your weight"
                                       onChange={setVal}
                                       onBlur={formatVal}
                        />
                        {errors.weight && <div className="validation-error">{errors.weight}</div>}

                        <InputTwoLines value={allSettings.k3_factor}
                                       name="k3_factor"
                                       id="k3_factor"
                                       field="k3_factor"
                                       label="K3 factor"
                                       onChange={setVal}
                                       onBlur={formatVal}
                        />
                        {errors.k3_factor && <div className="validation-error">{errors.k3_factor}</div>}

                        <InputTwoLines value={allSettings.be}
                                       name="be"
                                       id="be"
                                       field="be"
                                       label="BE"
                                       onChange={setVal}
                                       onBlur={formatVal}
                        />
                        {errors.be && <div className="validation-error">{errors.be}</div>}

                        <button type="button" className="btn" onClick={calculateOUV}>Calculate OUV</button>
                        <div className="alert alert-well">Коэффициенты будут рассчитаны только в таблице на этой
                            странице!
                        </div>
                    </fieldset>
                </Pane>
            </Form>
        </>
    );
}
