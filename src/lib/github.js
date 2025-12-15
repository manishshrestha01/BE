// GitHub API integration for fetching notes from a repository
// Configure your GitHub repo details here

const GITHUB_CONFIG = {
  owner: 'manishshrestha01',      // GitHub username or organization
  repo: 'BE-Computer',            // Repository name (NOT the full URL!)
  branch: 'main',                 // Branch name
  basePath: '',                   // Base path in repo (empty = root, or 'notes' for /notes folder)
}

// You can set a personal access token for higher rate limits (optional)
// For public repos, no token is needed
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''

const headers = GITHUB_TOKEN 
  ? { 'Authorization': `token ${GITHUB_TOKEN}` }
  : {}

/**
 * Get file type from filename
 */
const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  if (['pdf'].includes(ext)) return 'pdf'
  if (['pptx', 'ppt'].includes(ext)) return 'pptx'
  if (['docx', 'doc'].includes(ext)) return 'docx'
  if (['mp4', 'mov', 'webm'].includes(ext)) return 'video'
  if (['txt', 'md'].includes(ext)) return 'text'
  return 'unknown'
}

/**
 * Fetch contents of a directory from GitHub
 * @param {string} path - Path relative to basePath (empty for root)
 */
export async function fetchGitHubContents(path = '') {
  const { owner, repo, branch, basePath } = GITHUB_CONFIG
  const fullPath = basePath ? `${basePath}/${path}`.replace(/^\/+/, '') : path
  
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fullPath}?ref=${branch}`
  
  try {
    const response = await fetch(url, { headers })
    
    if (!response.ok) {
      if (response.status === 404) {
        return { success: true, data: [] } // Empty folder
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Transform GitHub response to our format
    const items = Array.isArray(data) ? data : [data]
    
    const transformedItems = items
      .filter(item => {
        // Filter out hidden files and non-supported types
        if (item.name.startsWith('.')) return false
        if (item.type === 'file') {
          const ext = item.name.split('.').pop().toLowerCase()
          const supportedExts = ['pdf', 'pptx', 'ppt', 'docx', 'doc', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'mov', 'webm', 'txt', 'md']
          return supportedExts.includes(ext)
        }
        return true // Include folders
      })
      .map(item => ({
        id: item.sha,
        name: item.name,
        type: item.type === 'dir' ? 'folder' : 'file',
        fileType: item.type === 'file' ? getFileType(item.name) : undefined,
        path: item.path,
        size: item.size || 0,
        url: item.download_url, // Direct download URL for files
        html_url: item.html_url, // GitHub page URL
        sha: item.sha,
      }))
    
    // Sort: folders first, then files, alphabetically
    transformedItems.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1
      if (a.type !== 'folder' && b.type === 'folder') return 1
      return a.name.localeCompare(b.name)
    })
    
    return { success: true, data: transformedItems }
  } catch (error) {
    console.error('GitHub fetch error:', error)
    return { success: false, error: error.message, data: [] }
  }
}

/**
 * Get raw file URL for viewing
 * @param {string} path - File path in repository
 */
export function getGitHubRawUrl(path) {
  const { owner, repo, branch } = GITHUB_CONFIG
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
}

/**
 * Get repository info
 */
export async function getRepoInfo() {
  const { owner, repo } = GITHUB_CONFIG
  const url = `https://api.github.com/repos/${owner}/${repo}`
  
  try {
    const response = await fetch(url, { headers })
    if (!response.ok) throw new Error('Failed to fetch repo info')
    return await response.json()
  } catch (error) {
    console.error('Error fetching repo info:', error)
    return null
  }
}

/**
 * Update GitHub configuration
 */
export function updateGitHubConfig(config) {
  Object.assign(GITHUB_CONFIG, config)
}

/**
 * Get current GitHub configuration
 */
export function getGitHubConfig() {
  return { ...GITHUB_CONFIG }
}

/**
 * Check if GitHub is configured
 */
export function isGitHubConfigured() {
  return GITHUB_CONFIG.owner !== 'your-username' && GITHUB_CONFIG.repo !== 'your-notes-repo'
}
