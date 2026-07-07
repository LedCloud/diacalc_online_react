import {useTrans} from "@/Hooks/useTrans.jsx";
import {usePage} from "@inertiajs/react";
import {useEffect, useRef, useState} from "react";
import {Dialog, DialogPanel, Transition, TransitionChild} from "@headlessui/react";
import ContextMenu from "@/Components/ContextMenu.jsx";
import Tooltip from "@/Components/Tooltip.jsx";

export default function ArchivePage(){
    const { __ } = useTrans();
    const {groups, errors} = usePage().props;
    const [selectedGrId, setSelectedGrId] = useState(groups[0]?.id || null);
    //const [selectedPr, setSelectedPr] = useState(products.length ? products[0].id : 0);
    const [showGroupPopup, setShowGroupPopup] = useState(false);
    const [products, setProducts] = useState([]);

    // This object acts as our local cache
    const [cache, setCache] = useState({});

    const [loading, setLoading] = useState(false);

    const formatter = (val, fractions = 1) => {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) {
            return val;
        }
        return parsed.toFixed(fractions);
    }

    useEffect(() => {
        if (!selectedGrId) return;

        const currentId = String(selectedGrId);

        console.log('GrID', selectedGrId, cache);

        if (cache[currentId]) {
            console.log('Got from cache');
            setProducts(cache[currentId]);
            return;
        }
        setLoading(true);
        console.log('Cache miss. Fetching from server for group:', selectedGrId)
        axios.get(`/archive/groups/${currentId}/products`)
            .then(response => {
                const data = response.data;
                console.log('Got products', data);
                // Update products state
                setProducts(data);

                // Save to cache for next time
                setCache(prevCache => ({
                    ...prevCache,
                    [currentId]: data
                }));
            })
            .catch(error => console.error("Error fetching products", error))
            .finally(() => setLoading(false));

    }, [selectedGrId]);

    const closeGroupPopup = () => {
        setShowGroupPopup(false);
    };

    const changeGroup = (direction) => {
        const current = groups.findIndex(g => g.id === selectedGrId);
        let toBeSelected;
        if (current < 0)
            return;
        if ('left' === direction) {
            if (current === 0)
                toBeSelected = groups[groups.length - 1].id;
            else
                toBeSelected = groups[current - 1].id;
        } else {
            if (current === groups.length - 1)
                toBeSelected = groups[0].id;
            else
                toBeSelected = groups[current + 1].id;
        }
        console.log(direction, toBeSelected);
        setSelectedGrId(toBeSelected);
    }

    const selectedGroup = groups.find(gr => gr.id === selectedGrId);

    // Store menu visibility and screen coordinates
    const [menuSettings, setMenuSettings] = useState({
        visible: false,
        x: 0,
        y: 0,
    });

    const menuRef = useRef(null);

    // Handle right-click on the specific target element
    const handleContextMenu = (e) => {
        e.preventDefault(); // Stop default browser menu

        setMenuSettings({
            visible: true,
            x: e.clientX, // Mouse X position
            y: e.clientY, // Mouse Y position
        });
    };

    // Close menu when clicking anywhere else
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuSettings((prev) => ({ ...prev, visible: false }));
            }
        };

        if (menuSettings.visible) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => document.removeEventListener('click', handleClickOutside);
    }, [menuSettings.visible]);

    const menuItems = [
        {
            name: __("add_to_products"),
            handler: () => alert(__("add_to_products"))
        },
        {
            name: __("remove_from_products"),
            handler: () => alert(__("remove_from_products")),
        }
    ];

    const closeMenu = () => setMenuSettings(prev => ({ ...prev, visible: false }));

    return (<div className="archive-layout">
        <div className="groups">
            <div className="groups__left btn p-3"
                 onClick={() => changeGroup('left')}
            >&lt;&lt;</div>
            <div className="group btn p-3"
                 onClick={() => setShowGroupPopup(true)}
            >{selectedGroup.name}</div>
            <div className="groups__right btn p-3"
                 onClick={() => changeGroup('right')}
            >&gt;&gt;</div>
        </div>
        <div className="products context-menu-box" onContextMenu={handleContextMenu}>
            {loading ? <p>Loading...</p> : (
                <>
                {products.map(product => (
                    <div className="product-item bg-slate-50 border-2  border-slate-600 rounded-lg" key={product.id}>
                        <div className="product-item__name">{product.name}</div>
                        <div className="product-item__description">
                            <Tooltip text={__("prot")}>{formatter(product.prot)}</Tooltip>-
                            <Tooltip text={__("fat")}>{formatter(product.fat)}</Tooltip>-
                            <Tooltip text={__("carb")}>{formatter(product.carb)}</Tooltip>-
                            <Tooltip text={__('gi')}>{formatter(product.gi,0)}</Tooltip>
                        </div>
                    </div>
                ))}
                </>
            )}
            <ContextMenu menuSettings={menuSettings}
                         menuRef={menuRef}
                         menuItems={menuItems}
                         onClose={closeMenu}
            />
        </div>
            <Transition show={showGroupPopup} leave="duration-200">
                <Dialog
                    as="div"
                    id="modal"
                    className="fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0 p-3"
                    onClose={closeGroupPopup}
                >
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="absolute inset-0 bg-gray-500/75" />
                    </TransitionChild>
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <DialogPanel
                            className={`mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full md:w-1/2 lg:w-1/3`}
                        >
                            {groups.map((gr) => {
                                return <div className={`group m-1 px-2 py-1 rounded cursor-pointer ${selectedGrId === gr.id ? 'border-sky-600 bg-sky-300' : 'hover:ring hover:text-bold'}`}
                                            key={gr.id}
                                            onClick={() => {
                                                setSelectedGrId(gr.id);
                                                setShowGroupPopup(false);
                                            }}
                                >{gr.name}</div>
                            })}
                        </DialogPanel>
                    </TransitionChild>
                </Dialog>
            </Transition>
        </div>);
}
