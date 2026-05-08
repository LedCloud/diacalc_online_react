import {useEffect, useState} from "react";

export default function Dialog({children, showInitial = true, header = '', okText,
                                    okHandler, cancelText = '', cancelHandler = null,
                                    closeHandler = null
                                })
{
    const [hidden, setHidden] = useState(!Boolean(showInitial));

    useEffect(() => {
        setHidden(!Boolean(showInitial));
    }, [showInitial]);

    console.log('In dlg', hidden, showInitial);

    return (
            <div className={`dialog ${hidden ? 'hidden' : ''}`}>
                <div className="dialog__header">
                    <div className="dialog__header_header">{header}</div>
                    <div className="dialog__header_close"
                        onClick={(e) => {
                            setHidden(true);
                            if (closeHandler) {
                                closeHandler();
                            }
                        }}>X</div>
                </div>
                <div className="dialog__content">
                    {children}
                </div>
                <div className="dialog__footer">
                    <button className="dialog__footer__button btn primary dialog__footer__button__ok"
                            type="button"
                            onClick={() => { setHidden(true); okHandler()}}>{okText}
                    </button>
                    {cancelText !== '' && cancelHandler ?
                        <button className="dialog__footer__button btn default dialog__footer__button__cancel" type="button"
                            onClick={() => {setHidden(true); cancelHandler()}}>{cancelText}
                        </button>
                        : ''}
                </div>
            </div>
        );
}
