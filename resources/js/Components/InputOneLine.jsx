const InputOneLine = ({ label, value, onChange, onBlur, id, type, name = '', className = '', focused = false }) => (
    <div className={`horizontal-group ${className}`}>
        <label htmlFor={id}>{label}</label>
        <input
            id={id}
            autoFocus={focused}
            type={type ?? 'text'}
            onFocus={(e) => e.target.select()}
            value={value}
            onChange={(e) => (onChange ? onChange(e.target.value, name ?? null) : () => {})}
            onBlur={(e) => (onBlur ? onBlur(e.target.value, name ?? null) : () => {})}
        />
    </div>
);

export default InputOneLine;
