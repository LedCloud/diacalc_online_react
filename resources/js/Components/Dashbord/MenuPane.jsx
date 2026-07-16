import {useTrans} from "@/Hooks/useTrans.jsx";
import React, {useEffect, useState} from "react";
import InfoPiece from "@/Components/Dashbord/InfoPiece.jsx";
import { CiTrash, CiCirclePlus } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import Factor from "@/Classes/Factor.js";
import Dose from "@/Classes/Dose.js";
import MenuProduct from "@/Classes/MenuProduct.js";
import valueCalculator from "@/Classes/MenuCalulator.js";
import {Head} from "@inertiajs/react";
import CalculableInput from "@/Components/CalculableInput.jsx";
import InputOneLine from "@/Components/InputOneLine.jsx";
import Scale from "@/Components/Scale.jsx";

export default function MenuPane({menu_items, settings, menu_masks, factors})
{
    const { __ } = useTrans();
    const [pageMenuItems, setPageMenuItems] = useState(menu_items ?? null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        setPageMenuItems(menu_items);
    }, [menu_items]);

    const setMenuItemWeight = (id, value) => {
        setPageMenuItems(latest =>
            latest.map(el => el.id === id ? {...el, weight: value} : el)
        );
    };

    const formatMenuItemWeight = (id, value) => {
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && !value.endsWith('.')) {
            setPageMenuItems(latest =>
                latest.map(el => el.id === id ? {...el, weight:String(parsed.toFixed(0))} : el)
            );
        }
    };

    const current_factor = Object.values(factors).find(f => f.now === true);
    const factor = new Factor(
        current_factor.k1,
        current_factor.k2,
        current_factor.k3,
        5.6, 5.6,
        settings.be
    );

    const deleteItem = (id) => {
        console.log('Delete item', id);
    };

    const mask_keys = Object.keys(menu_masks);

    const mask_arr = Object.fromEntries(
        mask_keys.map(mask_name => {
        return {
            show: Boolean(settings.menu_info & menu_masks[mask_name]),
            name: mask_name,
            mask: menu_masks[mask_name]
        };
    }).filter(e => e.show).map(item => [item.name, item.mask]));

    const results = [];

    pageMenuItems.forEach(item => {
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

        console.log('PIECES', pieces);

        const result = {
            id: item.id,
            product: product,
            //info_pieces_val: pieces,
            info_pieces: pieces.map(piece => {
                return <InfoPiece key={`piece_${item.id}_${piece.name}`} title={piece.name} value={piece.value} precision={piece.precision}/>
            })
        };
        results.push(result);
    });

    //Object.entries(obj).forEach(([key, value]) => { console.log(`${key} ${value}`); });
    // const menu_info = menu_masks.map(mask => {
    //     return {
    //         title: mask.
    //     }
    // });

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
                                setHandler={(val) => {
                                    setMenuItemWeight(item.id, val);
                                }}
                            />
                        </div>
                        <div className="menu-item__close btn"
                             onClick={() => {deleteItem(item.id)}}
                        >X</div>
                    </div>
                ))}
                <div className="menu-pane__factors">
                    <div className="menu-pane__factors__k1">
                        <InputOneLine id="factors-k1" label="k1" value={current_factor.k1} />
                    </div>
                    <div className="menu-pane__factors__k2">
                        <InputOneLine id="factors-k2" label="k2" value={current_factor.k2} />
                    </div>
                    <div className="menu-pane__factors__k3">
                        <InputOneLine label="OUV" value={current_factor.k3} />
                    </div>
                    <div className="menu-pane__factors__gl1">
                        <InputOneLine label="gl1" value={current_factor.gl1} />
                    </div>
                    <div className="menu-pane__factors__gl2">
                        <InputOneLine label="gl2" value={current_factor.gl2} />
                    </div>
                    <div className="menu-pane__factors__be">
                        <InputOneLine label="be" value={settings.be} />
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
                    <div className="menu-pane__factors__scale">
                        <Scale prot={20} fat={15}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
