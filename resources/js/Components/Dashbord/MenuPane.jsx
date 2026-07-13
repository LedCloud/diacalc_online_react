import {useTrans} from "@/Hooks/useTrans.jsx";
import {useState} from "react";
import InfoPiece from "@/Components/Dashbord/InfoPiece.jsx";
import { CiTrash, CiCirclePlus } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import Factor from "@/Classes/Factor.js";
import Dose from "@/Classes/Dose.js";
import MenuProduct from "@/Classes/MenuProduct.js";
import valueCalculator from "@/Classes/MenuCalulator.js";

export default function MenuPane({menu_items, settings, menu_masks, factors})
{
    const { __ } = useTrans();
    const [value, setValue] = useState(0);

    /*const setItemWeight = (id, val) => {
        menu.items.map(item => {
            if (item.id === id) {
                setValue
            }
        });
        //todo see coefs component
    };*/

    //console.log('checkme', menu_masks);
    console.log('factors', factors);

    const current_factor = Object.values(factors).find(f => f.now === true);
    const factor = new Factor(
        current_factor.k1,
        current_factor.k2,
        current_factor.k3,
        5.6, 5.6,
        settings.be
    );

    console.log('factor now', current_factor);

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

    menu_items.forEach(item => {
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
            //info_pieces_val: pieces,
            info_pieces: pieces.map(piece => {
                return <InfoPiece key={`piece_${item.id}`} title={piece.name} value={piece.value} precision={piece.precision}/>
            })
        };
        results.push(result);
    });



    console.log('What to show', results);



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
                            <input
                                value={item.product.weight}
                                onChange={(e) => setValue(e.target.value)}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                        <div className="menu-item__close btn"
                             onClick={() => {deleteItem(item.id)}}
                        >X</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
