export default function Pane({children, header = null}) {
    return (
        <div className="panes__pane">
            {header ? <div className="panes__pane_header">{header}</div> : null}
            <div className="panes__pane_content">
                {children}
            </div>
        </div>
    );
};
