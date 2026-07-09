import {useTrans} from "@/Hooks/useTrans.jsx";
import Tooltip from "@/Components/Tooltip.jsx";

export default function InfoPiece({title, value})
{
    const { __ } = useTrans();

    return (<>
        <span className="info-piece__title">{__(`short_${title}`)}</span>
        <Tooltip text={__(title)}>
        <span className="info-piece__value">{value}</span>
        </Tooltip>
    </>);
}
