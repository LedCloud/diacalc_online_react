import React, {useEffect, useState} from "react";
import {usePage, Form} from '@inertiajs/react'
import MenuTabContect from "@/Components/Settings/MenuTabContent.jsx";
import GlucoseTabContent from "@/Components/Settings/GlucoseTabContent.jsx";
import Tag from "@/Components/Tabs/Tag.jsx";
import ProductsTabContect from "@/Components/Settings/ProductsTabContent.jsx";

export default function SettingsTabbedPane() {

    const [activeTab, setActiveTab] = useState('products');
    const {settings, menuMasks, errors} = usePage().props;

    const [allSettings, setAllSettings] = useState(settings ?? null);

    useEffect(() => {
        setAllSettings(settings);
    }, [settings]);

    const tags = [
        {
            tag: <Tag id="menu" key="menu" active={activeTab} name="Menu" clickHandler={setActiveTab} />,
            content: "",
        },
        {
            tag: <Tag id="glucose" key="glucose" active={activeTab} name="Glucose" clickHandler={setActiveTab} />
        },
        {
            tag: <Tag id="products" key="products" active={activeTab} name="Products" clickHandler={setActiveTab} />
        }
    ];

    return (<>
        <div className="tabs">

            {tags.map((tag) => tag.tag)}
            {/*<Tag id="menu" active={activeTab} name="Menu" clickHandler={setActiveTab} />
            <Tag id="glucose" active={activeTab} name="Glucose" clickHandler={setActiveTab} />
            <Tag id="products" active={activeTab} name="Products" clickHandler={setActiveTab} />*/}

        </div>
        <div className="tab-content">
            <Form action="/settings_react" method="patch">

                <MenuTabContect allSettings={allSettings}
                                setAllSettings={setAllSettings}
                                activeTab={activeTab}
                                menuMasks={menuMasks}
                                errors={errors}
                                className="settings-layout"
                />

                <GlucoseTabContent allSettings={allSettings}
                                   setAllSettings={setAllSettings}
                                   activeTab={activeTab}
                                   errors={errors}
                                   className="settings-layout"
                />

                <ProductsTabContect allSettings={allSettings}
                                    setAllSettings={setAllSettings}
                                    activeTab={activeTab}
                                    errors={errors}
                                    className="settings-layout"
                                    />

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
