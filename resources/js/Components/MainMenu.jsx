import NavLink from '@/Components/NavLink';

export default function MainMenu({ items }) {
    return (
        <nav className="space-x-8 sm:-my-px sm:ml-10 sm:flex">
            {items.map((item, index) => {
                if (item.livewire) {
                    return (
                        <a key={index} href={route(item.route)} className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 transition duration-150 ease-in-out">
                            {item.name}
                        </a>
                    );
                } else {
                    return (<NavLink
                        key={index}
                        href={route(item.route)}
                        active={route().current(item.route)}
                    >
                        {item.name}
                    </NavLink>);
                }
            })}
        </nav>
    );
}
