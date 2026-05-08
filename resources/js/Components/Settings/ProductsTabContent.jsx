import Pane from "@/Components/Pane.jsx";
import {use, useState} from "react";
import Dialog from "@/Components/Dialog.jsx";

export default function ProductsTabContect({allSettings, setAllSettings, activeTab, menuMasks, errors, className = ''})
{
    const [fillDefault, setFillDefault] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const tabId = 'products';

    console.log('Show dlg', showDialog);

    return (<>
        <div className={`tab-pane ${className} ${activeTab === tabId ? 'active' : ''}`}>
            <Pane header="Products"
                  className={`menu_pane tab-pane panes__pane ${activeTab === tabId ? 'active' : ''}`}>
                <fieldset>
                    <div className="field">
                        <label className="checkbox-group" htmlFor="fillDefault">
                            <input id="fillDefault"
                                   checked={fillDefault}
                                   onChange={(e) => {
                                       setFillDefault(e.target.checked);
                                       if (e.target.checked) {
                                           setShowDialog(true);
                                       }/* else {

                                       }*/
                                       //setFillDefault(e.target.checked);
                                   }}
                                   type="checkbox"/>Fill product base with default</label>
                    </div>
                </fieldset>
            </Pane>
            <Dialog header='Test Header'
                    showInitial={showDialog}
                    okText='Okay'
                    okHandler={() => {setFillDefault(true);}}
                    cancelText="Cancel"
                    cancelHandler={() => {setFillDefault(false);}}
                    closeHandler={() => {setFillDefault(false);}}
                    >
                <p>After you save settings your database will be filled with the default products.</p>
                <p>All exisiting products will be removed.</p>
                <p>This action is suitable for the first time filling an empty product base.</p>
            </Dialog>
        </div>
    </>);
}
