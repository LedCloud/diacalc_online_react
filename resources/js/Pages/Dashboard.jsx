import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LinkedInputs from '@/Components/LinkedInputs';
import {useAuth} from "@/Hooks/useAuth.jsx";
import PageContainer from "@/Components/PageContainer.jsx";
import Accordion from "@/Components/Accordion.jsx";
import MenuPane from "@/Components/Dashbord/MenuPane.jsx";
import {useTrans} from "@/Hooks/useTrans.jsx";
import {usePage} from "@inertiajs/react";

export default function Dashboard() {
    const {menu_items, settings, menu_masks} = usePage().props;
    console.log('In dash', menu_items, settings);
    const { __ } = useTrans();
    const [value, setVal] = useState('');
    const multipliedVal = value * 2;

    const { hasAccess } = useAuth();

    const items = [
        {
            title: __('menu'),
            content: <MenuPane menu_items={menu_items} settings={settings} menu_masks={menu_masks} />
        },
        {
            title: __('products'),
            content: <div>Content Second</div>
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <PageContainer>

                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        create three panels layout
                        <Accordion items={items}/>
                {/*        Let's put inputs here*/}
                {/*        {hasAccess('platform.index') && (*/}
                {/*            <a href="/admin" className="btn-admin">*/}
                {/*                Панель администратора*/}
                {/*            </a>*/}
                {/*        )}*/}

                {/*        <hr style={{margin: '20px 0'}}/>*/}
                {/*        <h3>Связанные поля:</h3>*/}
                {/*        /!* Используем как <x-component /> в Blade *!/*/}
                {/*        <div className="grid grid-cols-2 gap-4">*/}
                {/*            <LinkedInputs initialValue={10} label="Возраст" />*/}
                {/*            <LinkedInputs initialValue={100} label="Сумма" />*/}
                {/*        </div>*/}

                {/*        <div className="panes">*/}
                {/*            <div className="panes__pane">*/}
                {/*                <div className="panes__pane_header">Header</div>*/}
                {/*                <div className="panes__pane_content">Content</div>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                    </div>
                </div>
            </PageContainer>
        </AuthenticatedLayout>
    )
        ;
}
