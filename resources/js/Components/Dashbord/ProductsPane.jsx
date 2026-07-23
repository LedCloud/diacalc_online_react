import {useTrans} from "@/Hooks/useTrans.jsx";
import {router, usePage} from "@inertiajs/react";
import React, {useEffect, useRef, useState} from "react";
import {CiCircleChevDown, CiCircleChevUp, CiCircleRemove} from "react-icons/ci";
import Tooltip from "@/Components/Tooltip.jsx";
import {Dialog, DialogPanel, Transition, TransitionChild} from "@headlessui/react";

export default function ProductsPane()
{
    const { __ } = useTrans();
    const {groups = []} = usePage().props;
    const [selectedGrId, setSelectedGrId] = useState(groups[0]?.id ?? null);
    const [showGroupPopup, setShowGroupPopup] = useState(false);
    const groupsListRef = useRef(null);

    useEffect(() => {
        if (!groups.length) {
            setSelectedGrId(null);
            return;
        }
        const stillExists = groups.some(g => g.id === selectedGrId);
        if (!stillExists) {
            setSelectedGrId(groups[0].id);
        }
    }, [groups, selectedGrId]);

    useEffect(() => {
        const listElement = groupsListRef.current;
        if (!listElement || selectedGrId === null || selectedGrId === undefined) {
            return;
        }

        const selectedElement = listElement.querySelector(`[data-group-id="${selectedGrId}"]`);
        selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [selectedGrId, groups]);

    const selectedGroup = groups.find(g => g.id === selectedGrId);
    const canMove = Boolean(selectedGroup) && !selectedGroup.virtual && groups.filter(g => !g.virtual).length > 1;

    const changeGroup = (direction) => {
        const current = groups.findIndex(g => g.id === selectedGrId);
        if (current < 0 || !groups.length) {
            return;
        }
        if (direction === 'left') {
            setSelectedGrId(current === 0 ? groups[groups.length - 1].id : groups[current - 1].id);
        } else {
            setSelectedGrId(current === groups.length - 1 ? groups[0].id : groups[current + 1].id);
        }
    };

    const moveGroup = (direction) => {
        if (!canMove || !selectedGroup) {
            return;
        }
        router.post(route('dashboard.groups.move', selectedGroup.id), {
            direction,
        }, {
            preserveScroll: true,
        });
    };

    const closeGroupPopup = () => setShowGroupPopup(false);

    if (!groups.length) {
        return <div className="products-pane" />;
    }

    return (
        <div className="products-pane">
            <div className="products-pane__groups-compact">
                <div
                    className="products-pane__groups-compact__left btn p-3"
                    onClick={() => changeGroup('left')}
                >&lt;&lt;</div>
                <div
                    className="products-pane__groups-compact__name btn p-3"
                    onClick={() => setShowGroupPopup(true)}
                >{selectedGroup?.name}</div>
                <div
                    className="products-pane__groups-compact__right btn p-3"
                    onClick={() => changeGroup('right')}
                >&gt;&gt;</div>
            </div>

            <div className="products-pane__groups-full">
                <div className="products-pane__toolbar">
                    <Tooltip text={__('move_up')}>
                        <button
                            type="button"
                            className="products-pane__toolbar__btn"
                            disabled={!canMove}
                            onClick={() => moveGroup('up')}
                            aria-label={__('move_up')}
                        >
                            <CiCircleChevUp size="1.8em" />
                        </button>
                    </Tooltip>
                    <Tooltip text={__('move_down')}>
                        <button
                            type="button"
                            className="products-pane__toolbar__btn"
                            disabled={!canMove}
                            onClick={() => moveGroup('down')}
                            aria-label={__('move_down')}
                        >
                            <CiCircleChevDown size="1.8em" />
                        </button>
                    </Tooltip>
                </div>
                <div className="products-pane__list" ref={groupsListRef}>
                    {groups.map(group => (
                        <div
                            key={group.virtual ? 'virtual-freq' : group.id}
                            className={`group-item ${selectedGrId === group.id ? 'bg-sky-300' : 'bg-slate-50'}`}
                            data-group-id={group.id}
                            onClick={() => setSelectedGrId(group.id)}
                        >
                            {group.name}
                        </div>
                    ))}
                </div>
            </div>

            <div className="products-pane__products">
                {/* Products list will go here */}
            </div>

            <Transition show={showGroupPopup} leave="duration-200">
                <Dialog
                    as="div"
                    id="products-group-modal"
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
                            className="mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full md:w-1/2 lg:w-1/3"
                        >
                            <div className="products-pane__toolbar products-pane__toolbar--popup px-2 pt-2">
                                <div className="products-pane__toolbar__moves">
                                    <Tooltip text={__('move_up')}>
                                        <button
                                            type="button"
                                            className="products-pane__toolbar__btn"
                                            disabled={!canMove}
                                            onClick={() => moveGroup('up')}
                                            aria-label={__('move_up')}
                                        >
                                            <CiCircleChevUp size="1.8em" />
                                        </button>
                                    </Tooltip>
                                    <Tooltip text={__('move_down')}>
                                        <button
                                            type="button"
                                            className="products-pane__toolbar__btn"
                                            disabled={!canMove}
                                            onClick={() => moveGroup('down')}
                                            aria-label={__('move_down')}
                                        >
                                            <CiCircleChevDown size="1.8em" />
                                        </button>
                                    </Tooltip>
                                </div>
                                <div className="products-pane__toolbar__close">
                                    <Tooltip text={__('close')}>
                                        <button
                                            type="button"
                                            className="products-pane__toolbar__btn"
                                            onClick={closeGroupPopup}
                                            aria-label={__('close')}
                                        >
                                            <CiCircleRemove size="1.8em" />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="products-pane__popup-list">
                                {groups.map((gr) => (
                                    <div
                                        className={`group m-1 px-2 py-1 rounded cursor-pointer ${selectedGrId === gr.id ? 'border-sky-600 bg-sky-300' : 'hover:ring'}`}
                                        key={gr.virtual ? 'virtual-freq' : gr.id}
                                        onClick={() => setSelectedGrId(gr.id)}
                                    >{gr.name}</div>
                                ))}
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </Dialog>
            </Transition>
        </div>
    );
}
