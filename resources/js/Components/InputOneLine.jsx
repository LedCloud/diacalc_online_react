const InputOneLine = ({ label, value, onChange, onBlur, id }) => (
    <div className="horizontal-group">
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

export default InputOneLine;
