import MaskInput from "@/Components/Settings/MaskInput.jsx";
import InputTwoLines from "@/Components/InputTwoLines.jsx";
import Pane from "@/Components/Pane.jsx";
import React from "react";

export default function MenuTabContect({allSettings, setAllSettings, activeTab, menuMasks, errors})
{
    const setMenuInfo = (val) => {
        setAllSettings({...allSettings, menu_info: val});
    };

    const changeCaloryLimit = (val) => {
        setAllSettings({...allSettings, calory_limit: val});
    };

    const setRoundTo = (val) => {
        console.log(val);
        setAllSettings({...allSettings, round_to: val});
    };

    return (
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
    );
}
