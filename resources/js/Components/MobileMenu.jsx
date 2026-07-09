import React, { useState } from 'react';
import ResponsiveNavLink from "@/Components/ResponsiveNavLink.jsx";
import NavLink from "@/Components/NavLink.jsx";
import {Link} from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown.jsx";
import {useAuth} from "@/Hooks/useAuth.jsx";

export default function MobileMenu({ items, user }) {
    const { hasAccess } = useAuth();
    // Track active submenus using their index
    const [openSubmenus, setOpenSubmenus] = useState({});

    const toggleSubmenu = (index) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <>
            <div className="pt-2 pb-3 space-y-1">
                <ResponsiveNavLink
                    href={route('dashboard')}
                    active={route().current('dashboard')}
                >
                    Dashboard
                </ResponsiveNavLink>
                {items && items.map((menuItem, index) => {
                    const hasSubmenu = menuItem.submenu && menuItem.submenu.length > 0;
                    const isSubmenuOpen = !!openSubmenus[index];

                    if (hasSubmenu) {
                        return (
                            <div key={index} className="border-l-4 border-transparent">
                                {/* Submenu Toggle Button */}
                                <button
                                    onClick={() => toggleSubmenu(index)}
                                    className="flex w-full items-center justify-between ps-3 pe-4 py-2 text-start text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 transition duration-150 ease-in-out"
                                >
                                    <div>{menuItem.name}</div>
                                    <div className="ms-1 shadow-sm">
                                        {/* Rotating Chevron Icon */}
                                        <svg
                                            className={`h-4 w-4 transform transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`}
                                            xmlns="http://w3.org"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Dropdown Submenu Content */}
                                {isSubmenuOpen && (
                                    <div className="ps-4 space-y-1 bg-gray-50/50 dark:bg-gray-700/50 transition ease-out duration-200">
                                        {menuItem.submenu.map((subItem, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                method={subItem.method ?? 'get' }
                                                href={route(subItem.route, subItem.params || {})}
                                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                                    route().current(subItem.route)
                                                        ? 'border-sky-400 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/50'
                                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300'
                                                }`}
                                                onClick = {((e) => {
                                                    subItem.method === 'post' && toggleSubmenu(index);
                                                })}
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    } else {
                        <ResponsiveNavLink
                        href={route(menuItem.route)}
                        active={route().current(menuItem.route)}
                            >{menuItem.name}</ResponsiveNavLink>
                    }
                })}
                {/*{items.map((item, index) => {
                    if (item.submenu) {
                        return <></>
                    }
                    return (
                        /*<MenuLink key={index} item={item}/>*/
                        /*<ResponsiveNavLink
                            href={route(item.route)}
                            active={route().current(item.route)}
                        >{item.name}</ResponsiveNavLink>
                    );*/
                /*})}*/}
            </div>
            {/*<div className="space-y-1 pb-3 pt-2">
                <ResponsiveNavLink
                    href={route('dashboard')}
                    active={route().current('dashboard')}
                >
                    Dashboard*-*-
                </ResponsiveNavLink>
            </div>*/}

            <div className="border-t border-gray-200 pb-1 pt-4">
                <div className="px-4">
                    <div className="text-base font-medium text-gray-800">
                        {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                        {user.email}
                    </div>
                </div>

                <div className="mt-3 space-y-1">
                    <ResponsiveNavLink href={route('profile.edit')}>
                        Profile
                    </ResponsiveNavLink>
                    {hasAccess('platform.index') && (
                        <a href={route('platform.index')}
                            className="flex w-full items-start border-l-4 py-2 pe-4 ps-3 border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800 text-base font-medium transition duration-150 ease-in-out focus:outline-none ">
                                Admin Panel22
                        </a>
                    )}
                    <ResponsiveNavLink
                        method="post"
                        href={route('logout')}
                        as="button"
                    >
                        Log out
                    </ResponsiveNavLink>
                </div>
            </div>
        </>
    );
}

function MenuLink({item}) {
    if (item.livewire) {
        return (
            <a href={route(item.route)}
               className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                {item.name}
            </a>
        );
    }
    return (
        <NavLink href={route(item.route)} active={route().current(item.route)}>
            {item.name}
        </NavLink>
    );
}
