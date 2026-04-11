import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LinkedInputs from '@/Components/LinkedInputs'; // Импорт твоего компонента

export default function Dashboard() {
    const [value, setVal] = useState('');
    const multipliedVal = value * 2;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Let's put inputs here

                            <hr style={{margin: '20px 0'}}/>
                            <h3>Связанные поля:</h3>
                            {/* Используем как <x-component /> в Blade */}
                            <div className="grid grid-cols-2 gap-4">
                                <LinkedInputs initialValue={10} label="Возраст" />
                                <LinkedInputs initialValue={100} label="Сумма" />
                            </div>

                            <div className="panes">
                                <div className="panes__pane">
                                    <div className="panes__pane_header">Header</div>
                                    <div className="panes__pane_content">Content</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
