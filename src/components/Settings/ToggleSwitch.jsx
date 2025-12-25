import React from 'react'
import './Settings.css'

const ToggleSwitch = ({ checked = false, onChange, ariaLabel }) => {
  return (
    <label className="toggle-switch" aria-label={ariaLabel}>
      <input
        type="checkbox"
        className="toggle-input"
        checked={checked}
        onChange={(e) => onChange && onChange(e.target.checked)}
        aria-checked={checked}
      />
      <span className="toggle-track">
        <span className="toggle-thumb"></span>
      </span>
    </label>
  )
}

export default ToggleSwitch
