import { useState } from "react";

export default function TabbedPane() {
    const [activeTab, setActiveTab] = useState('1');

    const selectTab = (tab) => {
        setActiveTab(tab);
    };
    return (<>
        <div class="tabs">
            <button type="button"
                    onClick={selectTab('1')}
                    className={`tab-btn ${activeTab === '1' ? 'active' : ''}`}
            >Tab1
            </button>
            <button type="button"
                    onClick={selectTab('2')}
                    className={`tab-btn ${activeTab === '1' ? 'active' : ''}`}
            >Tab2
            </button>
        </div>
        <div className="tab-content">
            <div className={`tab-pane panes__pane ${ activeTab === '1' ? 'active' : ''}`}>
                <div class="panes__pane_header">First Header</div>
                <div class="panes__pane_content">
                    Content 1
                </div>
            </div>
            <div className={`tab-pane panes__pane ${ activeTab === '2' ? 'active' : ''}`}>
                <div class="panes__pane_header">Second Header</div>
                <div class="panes__pane_content">
                    Content 2
                </div>
            </div>
        </div>
    </>);
};
