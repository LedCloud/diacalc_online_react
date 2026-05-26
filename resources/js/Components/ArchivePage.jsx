import {useTrans} from "@/Hooks/useTrans.jsx";
import {usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";
import {Dialog, DialogPanel, Transition, TransitionChild} from "@headlessui/react";

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
            {/*{groups.map((gr) => {
                        return <div className={`group px-2 py-1 rounded ${selectedGr === gr.id ? 'border-sky-600 bg-sky-300' : 'bg-slate-100'}`}
                                    key={gr.id}
                                    onClick={() => {
                                        setShowGroupPopup(true);
                                        //setSelectedGr(gr.id)
                                    }}
                        >{gr.name}</div>
                    })}*/}
        </div>
        <div className="products">
            {loading ? <p>Loading...</p> : (
                <ul>
                    {products.map(product => (
                        <li key={product.id}>{product.name}</li>
                    ))}
                </ul>
            )}
        </div>
        {/*<div className="products">
                    {products.map((pr) => {
                        return <div className={`product px-2 py-1 rounded ${selectedPr === pr.id ? 'border-green-600 bg-green-300' : 'bg-green-100'}`}
                                    key={pr.id}
                                    onClick={() => setSelectedPr(pr.id)}
                        >{pr.name}</div>
                    })}
                </div>*/}
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
