import {useTrans} from "@/Hooks/useTrans.jsx";
import {usePage} from "@inertiajs/react";
import {useState} from "react";

export default function ArchivePage()
{
    const { __ } = useTrans();
    const {groups, products, errors} = usePage().props;
    const [selectedGr, setSelectedGr] = useState(groups.length ? groups[0].id : 0);
    const [selectedPr, setSelectedPr] = useState(products.length ? products[0].id : 0);

    console.log(products);

    return (<div className="archive-layout">
                <div className="groups">
                    {groups.map((gr) => {
                        return <div className={`group px-2 py-1 rounded ${selectedGr === gr.id ? 'border-sky-600 bg-sky-300' : 'bg-slate-100'}`}
                                    key={gr.id}
                                    onClick={() => setSelectedGr(gr.id)}
                        >{gr.name}</div>
                    })}
                </div>
                <div className="products">
                    {products.map((pr) => {
                        return <div className={`product px-2 py-1 rounded ${selectedPr === pr.id ? 'border-green-600 bg-green-300' : 'bg-green-100'}`}
                                    key={pr.id}
                                    onClick={() => setSelectedPr(pr.id)}
                        >{pr.name}</div>
                    })}
                </div>
        </div>);
}
