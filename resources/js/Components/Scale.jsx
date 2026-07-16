import {useTrans} from "@/Hooks/useTrans.jsx";

export default function Scale({prot, fat})
{
    const { __ } = useTrans();
    const carb = 100 - +prot - +fat;
    return (<div className="scale-bars">
        <div className="scale-bars__prot"
             role="progressbar"
             id="ruler-prot"
             style={{width: `${prot}%`}}
        >{__('prot')}:{prot}%
        </div>
        <div className="scale-bars__fat progress-bar progress-bar-warning"
             role="progressbar"
             id="ruler-fat"
             style={{width: `${fat}%`}}
        >{__('fat')}:{fat}%
        </div>
        <div className="progress-bar scale-bars__carb"
             role="progressbar"
             id="ruler-carb"
             style={{width: `${carb}%`}}
        >{__('carb')}:{carb}%
        </div>
    </div>);
}
