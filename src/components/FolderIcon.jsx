const FALLBACK_FOLDER_COLOR = '#007bff'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const shadeColor = (hexColor, amount) => {
  const normalized = typeof hexColor === 'string' ? hexColor.trim() : ''
  const validColor = /^#[0-9a-f]{6}$/i.test(normalized) ? normalized : FALLBACK_FOLDER_COLOR

  const red = clamp(parseInt(validColor.slice(1, 3), 16) + amount, 0, 255)
  const green = clamp(parseInt(validColor.slice(3, 5), 16) + amount, 0, 255)
  const blue = clamp(parseInt(validColor.slice(5, 7), 16) + amount, 0, 255)

  return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

const FolderIcon = ({ color = FALLBACK_FOLDER_COLOR, size = 48, className = '', title = 'Folder' }) => {
  const folderColor = /^#[0-9a-f]{6}$/i.test(color) ? color : FALLBACK_FOLDER_COLOR
  const tabColor = shadeColor(folderColor, 18)
  const shadowColor = shadeColor(folderColor, -24)

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 64 48"
      width={size}
      height={size}
      role="img"
    >
      <title>{title}</title>
      <path
        d="M6 14C6 10.686 8.686 8 12 8H24.6C26.191 8 27.717 8.632 28.842 9.758L31.243 12.158C31.993 12.908 33.01 13.33 34.071 13.33H52C55.314 13.33 58 16.016 58 19.33V20H6V14Z"
        fill={tabColor}
      />
      <path
        d="M6 19C6 15.686 8.686 13 12 13H52C55.314 13 58 15.686 58 19V34C58 38.418 54.418 42 50 42H14C9.582 42 6 38.418 6 34V19Z"
        fill={folderColor}
      />
      <path
        d="M10 22.5C10 20.567 11.567 19 13.5 19H50.5C52.433 19 54 20.567 54 22.5V23.5H10V22.5Z"
        fill="#ffffff"
        opacity="0.24"
      />
      <path
        d="M13.5 39C11.567 39 10 37.433 10 35.5V23.5H54V35.5C54 37.433 52.433 39 50.5 39H13.5Z"
        fill={shadowColor}
        opacity="0.16"
      />
    </svg>
  )
}

export default FolderIcon
