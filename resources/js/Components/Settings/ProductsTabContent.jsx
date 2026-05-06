import Pane from "@/Components/Pane.jsx";

export default function ProductsTabContect({allSettings, setAllSettings, activeTab, menuMasks, errors, className = ''})
{
    const tabId = 'products';

    return (<>
        <div className={`tab-pane ${className} ${activeTab === tabId ? 'active' : ''}`}>
            <Pane header="Products"
                  className={`menu_pane tab-pane panes__pane ${activeTab === tabId ? 'active' : ''}`}>
                Products Content
            </Pane>
        </div>
    </>);
}
