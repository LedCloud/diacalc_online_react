import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Pane from "@/Components/Pane.jsx";
import Glucose from "@/Classes/Glucose.js";
import React, {useEffect, useState} from 'react';
import {usePage, Form} from '@inertiajs/react'
import InputTwoLines from "@/Components/InputTwoLines.jsx";
import Dialog from "@/Components/Dialog.jsx";
import InputOneLine from "@/Components/InputOneLine.jsx";

export default function Factors({ auth }) {

    const [activeField, setActiveField] = useState({ id: null, val: '' });
    const {settings, factors, errors} = usePage().props;
    const [allSettings, setAllSettings] = useState(settings ?? null);
    const [rFactors, setRFactors] = useState(factors ?? null);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState('add'); //add|edit
    const defaultFactors = {k1:1,k2:0,k3:new Glucose(2), time:"08:00"};
    const [dialogData, setDialogData] = useState(defaultFactors);

    useEffect(() => {
        setAllSettings(settings);
        setRFactors(factors);
    }, [settings, factors]);

    console.log(factors, settings);

    const config = {
        mmol: Boolean(settings.is_mmol),
        plasma: Boolean(settings.is_plasma),
        precision: 2
    };

    const getConfig = () => {
        return {
            mmol: Boolean(settings.is_mmol),
            plasma: Boolean(settings.is_plasma),
            precision: 2
        };
    }

    const setTime = (id, value) => {
        setRFactors(latest =>
            latest.map(el =>
                el.id === id
                    ? {...el, time: value}
                    : el));
    };

    const setFactor = (id, name, value) => {
        setRFactors(latest =>
            latest.map(el =>
                el.id === id
                    ? {...el, [name]: value}
                    : el));
    };

    const formatFactor = (id, name, value) => {
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && !value.endsWith('.')) {
            setRFactors(latest =>
                latest.map(el =>
                    el.id === id
                        ? {...el, [name]: String(parsed.toFixed(2))}
                        : el));
        }
    };

    const updateOUV = (id, value) => {
        setActiveField({ id: id, val: value });

        const parsed = parseFloat(value);
        if (!isNaN(parsed) && !value.endsWith('.')) {
            const newGl = new Glucose();
            newGl.setVal(value, config);
            setRFactors(latest =>
                latest.map(el =>
                    el.id === id
                        ? {...el, k3: newGl.val}
                        : el));
        }
    };

    const formatOUV = (id, value) => {
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && !value.endsWith('.')) {
            const newGl = new Glucose();
            newGl.setVal(value, config);
            setRFactors(latest =>
                latest.map(el =>
                    el.id === id
                        ? {...el, k3: newGl.val}
                        : el));
        }
        setActiveField({ id: null, val: '' });
    };

    const setWeight = (val) => {
        setAllSettings({...allSettings, weight: val});
    };
    const formatWeight = (val) => {
        const parsed = parseFloat(val);
        if (!isNaN(parsed) && !val.endsWith('.')) {
            setAllSettings({...allSettings, weight: parsed.toFixed(0)});
        }
    };

    const addRow = () => {
        const min = factors.length > 0 ? Math.min(...factors.map(e => e.id)) : 0;
        const nextId = min >= 0 ? -1 : (min - 1);

        setDialogType('add');
        //const newGl = new Glucose(5.6);
        //newGl.setVal(defaultFactors.k3, config);
        setDialogData({...defaultFactors});
        setShowDialog(true);
    };

    const updateDialog = (val, field) => {
        /*if ('k3' === field) {
            const newGl =
        }*/
        setDialogData({...dialogData, [field]: val});
    }
    const formatDialog = (val, field) => {
        return;
        const parsed = parseFloat(val);
        if (!isNaN(parsed) && !val.endsWith('.')) {
            if ('k3' === field) {
                const newGl = new Glucose(5.6);
                newGl.setVal(parsed, config);
                setDialogData({...dialogData, k3: newGl.val});
            } else
                setDialogData({...dialogData, [field]: parsed.toFixed(2)});
        }
    }

    const addDialogResult = () => {
        setRFactors(latest => {
            const min = latest.length > 0 ? Math.min(...latest.map(e => e.id)) : 0;
            const nextId = min >= 0 ? -1 : (min - 1);

            // 2. Create the new item with the ID
            const copy = { ...dialogData, id: nextId };

            const updated = [...latest, copy];
            updated.sort((a, b) => a.time.localeCompare(b.time));

            return updated;
        });
    };

    const delRow = (id) => {
        setRFactors(latest => latest.filter(e => e.id !== id));
    };

    const editRow = (id) => {
        const row = factors.find(e => e.id === id);
        setDialogType('edit');
        //const newGl = new Glucose(5.6);
        //newGl.setVal(defaultFactors.k3, config);
        setDialogData({...row});
        setShowDialog(true);
    };

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
                        <Form action="/factors_react" method="patch">
                        <Pane header="Factors" className="factors-layout__pane factors">
                            <fieldset>
                                <legend>Factors</legend>

                            <div className="field">
                                <label className="checkbox-group" htmlFor="timedFactors">
                            <input id="timedFactors"
                                   checked={Boolean(allSettings.factors_by_time)}
                                   name="timedFactors"
                                   value="timed"
                                   onChange={(e) => {
                                       setAllSettings({...allSettings, factors_by_time: (e.target.checked ? 1 : 0)});
                                   }}
                                   type="checkbox"/>Factors by time</label>
                            </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>K1</th>
                                            <th>K2</th>
                                            <th>OUV</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {rFactors.map(row => {
                                        gl.val = row.k3;
                                        return (
                                            <tr key={row.id}>
                                                <td>
                                                    <input type="hidden" name={`factors[${row.id}][id]`}
                                                           value={row.id}/>
                                                    <input type="time"
                                                           name={`factors[${row.id}][time]`} value={row.time}
                                                           onChange={(e) => setTime(row.id, e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                <input type="number"
                                                           name={`factors[${row.id}][k1]`} value={row.k1}
                                                           onFocus={(e) => e.target.select()}
                                                           onChange={(e) => setFactor(row.id, 'k1', e.target.value)}
                                                           onBlur={(e) => formatFactor(row.id, 'k1', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input type="number"
                                                           name={`factors[${row.id}][k2]`} value={row.k2}
                                                           onFocus={(e) => e.target.select()}
                                                           onChange={(e) => setFactor(row.id, 'k2', e.target.value)}
                                                           onBlur={(e) => formatFactor(row.id, 'k2', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    {/*{gl.getView(config)}*/}
                                                    <input
                                                        name={`factors[${row.id}][ouv]`}
                                                        value={activeField.id === row.id ? activeField.val : gl.getView(config)}
                                                        onFocus={(e) => e.target.select()}
                                                        onChange={(e) => updateOUV(row.id, e.target.value)}
                                                        onBlur={(e) => formatOUV(row.id, e.target.value)}
                                                        />
                                                </td>
                                                <td>
                                                    <div className='button-horizontal'>
                                                        <button className="btn"
                                                        type="button"
                                                            onClick={() => delRow(row.id)}
                                                            >Del</button>
                                                        <button className="btn"
                                                        type="button"
                                                            onClick={() => editRow(row.id)}
                                                            >Edit</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </fieldset>
                            <div>
                                <button type="button" className="btn" onClick={addRow}>Add</button>
                            </div>
                            <fieldset>
                                <legend>Params</legend>
                                <InputTwoLines value={allSettings.weight}
                                               name="weight"
                                               id="weight"
                                               label="Your weight"
                                               onChange={setWeight}
                                               onBlur={formatWeight}
                                />
                                {errors.filter_off && <div className="validation-error">{errors.filter_off}</div>}
                            </fieldset>
                                <div className="button-horizontal">
                                    <button className="btn settings__btn-save primary"
                                            type="submit">Save
                                    </button>

                                </div>
                        </Pane>
                        </Form>

                        <Dialog
                            header={dialogType === 'add' ? 'Add factor' : 'Edit factor'}
                            showDlg={showDialog}
                            okText={dialogType === 'add' ? 'Add' : 'Edit'}
                            okHandler={() => {
                                //setFillDefault(true);
                                addDialogResult();
                                setShowDialog(false);
                            }}
                            cancelText="Cancel"
                            cancelHandler={() => {
                                //setFillDefault(false);
                                setShowDialog(false);
                            }}
                            closeHandler={() => {
                                //setFillDefault(false);
                                setShowDialog(false);
                            }}
                        >
                            <div>
                                <InputOneLine value={dialogData.time}
                                              focused={true}
                                      name="time" label="time"
                                      type="time"
                                     onChange={updateDialog}
                                     onBlur={formatDialog}
                                />
                                <InputOneLine value={dialogData.k1}
                                      name="k1" label="k1"
                                     onChange={updateDialog}
                                     onBlur={formatDialog}
                                />
                                <InputOneLine value={dialogData.k2}
                                              name="k2" label="k2"
                                              onChange={updateDialog}
                                              onBlur={formatDialog}
                                />
                                {/*<InputOneLine value={dialogData.k3.getView(config)}
                                              name="k3" label="OUV"
                                              onChange={updateDialog}
                                              onBlur={formatDialog}
                                />*/}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
