import { useState } from "react";
import { Form } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'

export default function SettingsTabbedPane({settings}) {
    const [activeTab, setActiveTab] = useState('menu');

    /*const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    })*/

    console.log(settings);

    //const activeTab = '2';

    const selectTab = (tab) => {
    //    setActiveTab(tab);
    };
    return (<>
        <div className="tabs">

            <button type="button"
                    onClick={() => setActiveTab('menu')}
                    className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            >Tab1
            </button>
            <button type="button"
                    onClick={() => setActiveTab('glucose')}
                    className={`tab-btn ${activeTab === 'glucose' ? 'active' : ''}`}
            >Tab2
            </button>
        </div>
        <div className="tab-content">
            <div className={`tab-pane ${activeTab === 'menu' ? 'active' : ''}`}>
                <div className="panes__pane_header">First Header</div>
                <div className="panes__pane_content">
                    BlahBlah{settings.calory_limit}
                </div>
            </div>
            <div className={`tab-pane ${activeTab === 'glucose' ? 'active' : ''}`}>
                <div className="panes__pane_header">Second Header</div>
                <div className="panes__pane_content">
                    Content 2
                </div>
            </div>
        </div>
    </>);
};
