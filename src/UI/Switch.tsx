import { ChangeEventHandler, FC } from 'react';

interface SwitchProps {
  id: string,
  onChange: ChangeEventHandler<HTMLInputElement>,
  label: string,
  checked: boolean
}
// Definimos nuestro componente
const Switch:FC<SwitchProps> = ({ id, label, checked, onChange }) => {
  return (
    <div className="form-check form-switch">
      <input className="form-check-input" type="checkbox" checked={checked} onChange={onChange} id={id} />
      <label className="form-check-label" htmlFor={id}>{label}</label>
    </div>
  );
}

export default Switch;