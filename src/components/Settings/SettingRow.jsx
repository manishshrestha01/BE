import React from 'react'
import ToggleSwitch from './ToggleSwitch'
import './Settings.css'

const SettingRow = ({
  title,
  subtitle,
  icon,
  type = 'disclosure', // 'disclosure' | 'switch' | 'value'
  value,
  checked,
  onToggle,
  onClick,
  danger = false
}) => {
  const ariaLabel = `${title}${subtitle ? ' - ' + subtitle : ''}`

  return (
    <button className={`setting-row ${danger ? 'signout' : ''}`} onClick={type === 'switch' ? undefined : onClick} aria-label={ariaLabel}>
      <div className="row-left">
        {icon && <span className="row-icon">{icon}</span>}
        <div className="row-text">
          <div className="row-title">{title}</div>
          {subtitle && <div className="row-sub">{subtitle}</div>}
        </div>
      </div>

      <div className="row-right">
        {type === 'value' && <div className="row-value">{value}</div>}
        {type === 'switch' && (
          <div onClick={(e) => e.stopPropagation()}>
            <ToggleSwitch checked={checked} onChange={onToggle} ariaLabel={title} />
          </div>
        )}
        {type === 'disclosure' && <div className="row-chevron">›</div>}
      </div>
    </button>
  )
}

export default SettingRow
