import Pane from "@/Components/Pane.jsx";
import {useState} from "react";
import Dialog from "@/Components/Dialog.jsx";

export default function ProductsTabContect({allSettings, setAllSettings, activeTab, menuMasks, errors, className = ''})
{
    const [fillDefault, setFillDefault] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const [useFreq, setUseFreq] = useState(false);

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
                                   checked={useFreq}
                                   name="useFreq"
                                   value="use"
                                   onChange={(e) => setUseFreq(e.target.checked)}
                                   type="checkbox"/>Use frequenty used products</label>
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
