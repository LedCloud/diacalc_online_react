import {useTrans} from "@/Hooks/useTrans.jsx";
import React, {useEffect, useState} from "react";
import InfoPiece from "@/Components/Dashbord/InfoPiece.jsx";
import { CiTrash, CiCirclePlus } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import Factor from "@/Classes/Factor.js";
import Dose from "@/Classes/Dose.js";
import MenuProduct from "@/Classes/MenuProduct.js";
import valueCalculator from "@/Classes/MenuCalulator.js";
import {Head, useForm} from "@inertiajs/react";
import CalculableInput from "@/Components/CalculableInput.jsx";
import InputOneLine from "@/Components/InputOneLine.jsx";
import Scale from "@/Components/Scale.jsx";
import Glucose from "@/Classes/Glucose.js";
import {usePage, Form, router} from '@inertiajs/react'

export default function MenuPane()
{
    // 1. По-прежнему берем данные из Inertia
    const {settings, menu_masks, factors, menu_items, eating} = usePage().props;

    // 2. Инициализируем форму. Первичный источник правды для UI теперь data.items
    const { data, setData, post, processing } = useForm({
        menu_items: menu_items || [],
        eating: {
            k1: eating?.k1 ?? 1,
            k2: eating?.k2 ?? 0,
            k3: eating?.k3 ?? 2,
            sh1: eating?.sh1 ?? 5.6,
            sh2: eating?.sh2 ?? 5.6,
            be: eating?.be ?? 10,
            eaten: eating?.eaten ?? 0,
            eaten_date: eating?.eaten_date ?? null,
        }
    });

    useEffect(() => {
        if (eating) {
            setData('eating', {
                k1: eating.k1,
                k2: eating.k2,
                k3: eating.k3,
                sh1: eating.sh1,
                sh2: eating.sh2,
                be: eating.be,
                eaten: eating.eaten,
                eaten_date: eating.eaten_date,
            });
        }
    }, [eating]);

    console.log('Eating', data);

    const current_factor = Object.values(factors).find(f => f.now === true);
    const factor = new Factor(
        data.eating.k1,
        data.eating.k2,
        data.eating.k3,
        data.eating.gl1,
        data.eating.gl2,
        settings.be
    );

    // 3. СИНХРОНИЗАЦИЯ: Если Laravel обновит menu_items (например, прилетит новый список),
    // мы должны обновить и состояние формы.
    useEffect(() => {
        if (menu_items) {
            setData("menu_items", menu_items);
        }
    }, [menu_items]);

    const { __ } = useTrans();

    const isMmol = () => {
        return Boolean(+settings.is_mmol);
    }

    const isPlasma = () => {
        return Boolean(+settings.is_plasma);
    }

    const formGlConfig = () => {
        return {
            mmol: isMmol(),
            plasma: isPlasma()
        }
    };



    const [k3, setK3] = useState(new Glucose(factor.k3));
    const [gl1, setGl1] = useState(new Glucose(factor.gl1));
    const [gl2, setGl2] = useState(new Glucose(factor.gl2));

    const calculateMenuTotals = (items, factor) => {
        const total = new MenuProduct('', 0, 0, 0, 0, 0, 50, 0);
        items?.forEach(item => {
            const product = new MenuProduct(
                item.name, item.id, item.weight,
                item.prot, item.fat, item.carb, item.gi, 0
            );
            total.addProduct(product);
        });
        const dose = new Dose(total, factor);
        return {
            product: total,
            nutrients: {
                prot: total.getProt(),
                fat: total.getFat(),
                carb: total.getCarb(),
                gi: total.gi,
                calorie: total.getCalor(),
                gl: total.getGLIndx(),
            },
            doses: {
                dps: dose.getDPS(),
                qCarbD: dose.getQCarbD(),
                slCarbD: dose.getSlCarbD(),
                carbD: dose.getCarbD(),
                protFatD: dose.getProtFatD(),
                quick: dose.getDPS() + dose.getQCarbD(),
                slow: dose.getSlCarbD() + dose.getProtFatD(),
                total: dose.getWholeD(),
            },
        };
    };

    const totals = React.useMemo(
        () => calculateMenuTotals(data.menu_items, factor),
        [data.menu_items, factor]
    );

    /*useEffect(() => {
        //setPageMenuItems(menu_items);
        setPageFactors(factors);
    }, [ factors]);*/

    // const setMenuItemWeight = (id, value) => {
    //     setPageMenuItems(latest =>
    //         latest.map(el => el.id === id ? {...el, weight: value} : el)
    //     );
    // };

    const formatMenuItemWeight = (id, value) => {
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && !value.endsWith('.')) {
            setPageMenuItems(latest =>
                latest.map(el => el.id === id ? {...el, weight:String(parsed.toFixed(0))} : el)
            );
        }
    };

    //Factors - it's an array witgh time , k1, k2, k3
    //First of all k3 must be converted respect the BE and settings mmol and plasma
    //console.log('Check names',factors);
    //console.log('Settings', settings);

    const setFactor = (id, name, value) => {
        setPageFactors(latest =>
            latest.map(el =>
                el.id === id
                    ? {...el, [name]: value}
                    : el));
    };

    const formatFactor = (id, name, value) => {
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && !value.endsWith('.')) {
            setPageFactors(latest =>
                latest.map(el =>
                    el.id === id
                        ? {...el, [name]: String(parsed.toFixed(2))}
                        : el));
        }
    };

    const setMenuItemWeight = (id, value) => {
        setData(
            'menu_items',
            data.menu_items.map(el =>
                el.id === id ? { ...el, weight: value } : el
            )
        );
    };


    const deleteItem = (id) => {
        const updated = data.menu_items.filter(el => el.id !== id);
        setData('menu_items', updated);  // optimistic UI update
        router.delete(route('dashboard.deletemenu', id), {
            preserveScroll: true,
            onError: () => {
                // rollback if server fails
                setData('menu_items', menu_items);
            },
        });
    };

    const mask_keys = Object.keys(menu_masks);

    const mask_arr = Object.fromEntries(
        mask_keys.map(mask_name => {
        return {
            show: Boolean(settings.menu_info & menu_masks[mask_name]),
            name: mask_name,
            mask: menu_masks[mask_name]
        };
    }).filter(e => e.show)
            .map(item => [item.name, item.mask]));

    const results = [];

    data.menu_items?.forEach(item => {
        const product = new MenuProduct(item.name,item.id, item.weight,
            item.prot, item.fat, item.carb, item.gi, 0);

        const dose = new Dose(product, factor);

        //Return InfoPieces
        const pieces = Object.entries(mask_arr).map(([mask, index]) => {
            const {val,precision} = valueCalculator(item, mask, settings, factor);
            return {
                name: mask,
                value: val,
                precision:precision
            };
        });

        const result = {
            id: item.id,
            product: product,
            info_pieces: pieces.map(piece => {
                return <InfoPiece key={`piece_${item.id}_${piece.name}`} title={piece.name} value={piece.value} precision={piece.precision}/>
            })
        };
        results.push(result);
    });

    const [showDetails , setShowDetails] = useState(false);

    //Object.entries(obj).forEach(([key, value]) => { console.log(`${key} ${value}`); });
    // const menu_info = menu_masks.map(mask => {
    //     return {
    //         title: mask.
    //     }
    // });

    // 6. Отправка формы на сервер через PATCH
    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("dashboard.updatemenu"), {
            preserveScroll: true, // Страница не будет прыгать вверх при сохранении
        });
    };

    const setMenuItemWeightAndSave = (id, value) => {
        const updated = data.menu_items.map(el =>
            el.id === id ? { ...el, weight: value } : el
        );
        setData('menu_items', updated);

        router.post(route('dashboard.updatemenu'), {
            menu_items: updated,
        }, {
            preserveScroll: true,
        });
    };



    return (
        <div className="menu-pane">
            <div className="menu-pane__actions">
                <div className="menu-pane__actions__plus btn"><CiCirclePlus /></div>
                <div className="menu-pane__actions__diary btn"><GoPencil /></div>
                <div className="menu-pane__actions__counter">0+839 / 1800</div>
                <div className="menu-pane__actions__trash btn"><CiTrash /></div>
            </div>
            <div className="menu-pane__menu">
                {results.map(item => (
                    <div className="menu-item" key={item.id}>
                        <div className="menu-item__name">{item.product.name}</div>
                        <div  className="menu-item__info">
                            {item.info_pieces.map(piece => piece)}
                        </div>
                        <div className="menu-item__weight">
                            <CalculableInput
                                valueIn={item.product.weight}
                                // setHandler={(val) => {
                                //     setMenuItemWeight(item.id, val);
                                // }}
                                setHandler={(val) => setMenuItemWeightAndSave(item.id, val)}
                            />
                        </div>
                        <div className="menu-item__close btn"
                             onClick={() => {deleteItem(item.id)}}
                        >X</div>
                    </div>
                ))}

                <div className="menu-pane__factors">
                    <div className="menu-pane__factors__k1 factor">
                        <label htmlFor="factors-k1">k1</label>
                        <input id="factors-k1" value={current_factor.k1} />
                    </div>
                    <div className="menu-pane__factors__k2 factor">
                        <label htmlFor="factors-k2">k2</label>
                        <input id="factors-k2" value={current_factor.k2} />
                    </div>
                    <div className="menu-pane__factors__k3 factor">
                        <label htmlFor="factors-k3">OUV</label>
                        <input id="factors-k3" value={k3.getView(formGlConfig())} />
                    </div>
                    <div className="menu-pane__factors__gl1 factor">
                        <label htmlFor="factors-gl1">gl1</label>
                        <input id="factors-gl1" value={gl1.getView(formGlConfig())} />
                    </div>
                    <div className="menu-pane__factors__gl2 factor">
                        <label htmlFor="factors-gl2">gl2</label>
                        <input id="factors-gl2" value={gl2.getView(formGlConfig())} />
                    </div>
                    <div className="menu-pane__factors__be factor">
                        <label htmlFor="factors-be">BE</label>
                        <input id="factors-be" value={settings.be} />
                    </div>
                    <div className="menu-pane__factors__results">
                        <div className="factors__results__prot results-piece">
                            <div className="factors__results__prot_lbl results-piece__lbl">P</div>
                            <div className="factors__results__prot_vl results-piece__vl">{123}</div>
                        </div>
                        <div className="factors__results__fat results-piece">
                            <div className="factors__results__fat_lbl results-piece__lbl">F</div>
                            <div className="factors__results__fat_vl results-piece__vl">{123}</div>
                        </div>
                        <div className="factors__results__carb results-piece">
                            <div className="factors__results__carb_lbl results-piece__lbl">C</div>
                            <div className="factors__results__carb_vl results-piece__vl">{123}</div>
                        </div>
                        <div className="factors__results__gi results-piece">
                            <div className="factors__results__gi_lbl results-piece__lbl">GI</div>
                            <div className="factors__results__gi_vl results-piece__vl">{12}</div>
                        </div>
                        <div className="factors__results__calorie results-piece">
                            <div className="factors__results__calorie_lbl results-piece__lbl">kC</div>
                            <div className="factors__results__calorie_vl results-piece__vl">{858}</div>
                        </div>
                        <div className="factors__results__gl results-piece">
                            <div className="factors__results__gl_lbl results-piece__lbl">GL</div>
                            <div className="factors__results__gl_vl results-piece__vl">{21}</div>
                        </div>
                    </div>
                    <div className="menu-pane__factors__grand-total" onClick={() => setShowDetails(!showDetails)}>
                        <div className="doses-sign">+</div>
                        <div className="doses-quick"><span className="dose-label">qck</span>6.0</div>
                        <div className="doses-slow"><span className="dose-label">sl</span>4.1</div>
                        <div className="doses-sum"><span className="dose-label">=&nbsp;Σ</span>10.1</div>

                        <div style={{ display: showDetails ? 'block' : 'none' }}
                            className="doses-detail-quick1"><span className="dose-label">(dps</span>1.7<span className="dose-label"> + Qcarb</span>4.3
                            <span className="dose-label">)</span></div>
                        <div style={{ display: showDetails ? 'block' : 'none' }}
                            className="doses-detail-slow1"><span className="dose-label">(sl</span>1.8<span className="dose-label"> + SLfp</span>2.4
                            <span className="dose-label">)</span></div>

                        <div style={{ display: showDetails ? 'block' : 'none' }}
                             className="doses-detail-quick2"><span className="dose-label">(dps</span>1.7<span className="dose-label"> + carb</span>6.0
                            <span className="dose-label">)</span>
                        </div>
                        <div style={{ display: showDetails ? 'block' : 'none' }}
                             className="doses-detail-slow2"><span className="dose-label">(fp</span>2.4)
                        </div>
                    </div>
                    <div className="menu-pane__factors__scale">
                        <Scale prot={10} fat={20} carb={70}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
