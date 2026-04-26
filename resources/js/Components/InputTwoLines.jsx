const InputTwoLines = ({ label, value, onChange, onBlur, id, className = '' }) => (
    <div className={`"vertical-group ${className}`}>
        <label htmlFor={id}>{label}</label>
        <input
            id={id}
            onFocus={(e) => e.target.select()}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur(e.target.value)}
        />
    </div>
);

export default InputTwoLines;
