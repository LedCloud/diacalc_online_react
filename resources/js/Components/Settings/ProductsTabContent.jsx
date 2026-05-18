import Pane from "@/Components/Pane.jsx";
import React, {useState} from "react";
import Dialog from "@/Components/Dialog.jsx";
import InputTwoLines from "@/Components/InputTwoLines.jsx";
import {all} from "axios";

export default function ProductsTabContect({allSettings, setAllSettings, activeTab, menuMasks, errors, className = ''})
{
    const [fillDefault, setFillDefault] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    //const [useFreq, setUseFreq] = useState(allSettings.use);

    const tabId = 'products';

    const changeFreqQty = (val) => {
        setAllSettings({...allSettings, freq_qty: val});
    };

    const changeFilterOff = (val) => {
        setAllSettings({...allSettings, filter_off: val});
    };

    return (<>
        <div className={`tab-pane ${className} ${activeTab === tabId ? 'active' : ''}`}>
            <Pane header="Products"
                  className={`products_pane tab-pane panes__pane ${activeTab === tabId ? 'active' : ''}`}>
                <fieldset>
                    <div className="field">
                        <label className="checkbox-group" htmlFor="fillDefault">
                            <input id="fillDefault"
                                   checked={fillDefault}
                                   name="fillDefault"
                                   value="fill"
                                   onChange={(e) => {
                                       setFillDefault(e.target.checked);
                                       if (e.target.checked) {
                                           setShowDialog(true);
                                       }
                                   }}
                                   type="checkbox"/>Fill product base with default</label>
                    </div>

                    <div className="field">
                        <label className="checkbox-group" htmlFor="useFreq">
                            <input id="useFreq"
                                   checked={Boolean(allSettings.use_freq)}
                                   name="use_freq"
                                   value="use"
                                   onChange={(e) => setAllSettings({...allSettings, use_freq: e.target.checked})}
                                   type="checkbox"/>Use frequenty used products</label>
                    </div>
                    {Boolean(allSettings.use_freq) && (<div className="field">
                        <InputTwoLines value={allSettings.freq_qty}
                                       name="freq_qty"
                                       id="freq_qty"
                                       label="Freq qty"
                                       onChange={changeFreqQty}
                        />
                        {errors.freq_qty && <div className="validation-error">{errors.freq_qty}</div>}
                    </div>)}

                    <div className="field">
                        <InputTwoLines value={allSettings.filter_off}
                                       name="filter_off"
                                       id="filter_off"
                                       label="Filter off"
                                       onChange={changeFilterOff}
                        />
                        {errors.filter_off && <div className="validation-error">{errors.filter_off}</div>}
                    </div>

                </fieldset>
            </Pane>
            <Dialog
                className="warning"
                header='Test Header'
                showDlg={showDialog}
                okText='Okay'
                okHandler={() => {
                    setFillDefault(true);
                    setShowDialog(false);
                }}
                cancelText="Cancel"
                cancelHandler={() => {
                    setFillDefault(false);
                    setShowDialog(false);
                }}
                closeHandler={() => {
                    setFillDefault(false);
                    setShowDialog(false);
                    }}
                    className="success"
                    >
                    <p>After you save settings your database will be filled with the default products</p>
                <p>All exisiting products will be removed.</p>
                <p>This action is suitable for the first time filling of an empty product base.</p>
            </Dialog>
        </div>
    </>);
}
