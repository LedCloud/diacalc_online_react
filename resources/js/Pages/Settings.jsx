import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Settings({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Настройки</h2>}
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <p className="text-gray-900">Добро пожаловать в настройки, {auth.user.name}!</p>

                        {/* Можешь вставить сюда свой компонент с инпутами для теста */}
                        {/* <LinkedInputs label="Настройка параметра" /> */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
