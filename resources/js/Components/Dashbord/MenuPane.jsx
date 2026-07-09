import {useTrans} from "@/Hooks/useTrans.jsx";
import {useState} from "react";
import InfoPiece from "@/Components/Dashbord/InfoPiece.jsx";
import { CiTrash, CiCirclePlus } from "react-icons/ci";
import { GoPencil } from "react-icons/go";

export default function MenuPane({menu_items, settings, menu_masks})
{
    const { __ } = useTrans();
    const [value, setValue] = useState(0);

    console.log(menu_masks);

    const deleteItem = (id) => {
        console.log('Delete item', id);
    };

    const mask_keys = Object.keys(menu_masks);
    console.log('Keys', mask_keys);

    const valueCalculator = (item, name) => {
        const nutients = ['carb', 'fat', 'prot'];
        if (nutients.includes(name)) {
            return (item.weight * item[name] / 100).toFixed(0);
        }
        if (name === 'gi') {
            return item.gi;
        }
        if (name === 'be') {
            return (item.weight * item.carb * setting.be / 100).toFixed(1);
        }
        if (name === 'dose') {
            return 2.5;//TODO replace with real calcs
        }
        if (name === 'gn') {
            return 75;//TODO replace with real calcs
        }
    };

    const mask_arr = mask_keys.map(mask_name => {
        return {
            show: Boolean(settings.menu_info & menu_masks[mask_name]),
            name: mask_name,
            value:
        };
    }).filter(e => e.show);

    console.log('What to show', mask_arr);

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
                {menu_items.map(item => (
                    <div className="menu-item" key={item.id}>
                        <div className="menu-item__name">{item.name}</div>
                        <div  className="menu-item__info">
                            <InfoPiece value={'0.0'} title="carb" />
                            <InfoPiece value={'1.0'} title="calories" />
                            <InfoPiece value={'2.0'} title="gi" />
                        </div>
                        <div className="menu-item__weight">
                            <input
                                value={item.weight}
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
