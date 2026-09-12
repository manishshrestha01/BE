'use client'
import { useState } from 'react'
import TableOfContents from './TableOfContents'

const SubjectTocToggle = ({ items }) => {
  const [mobileTocOpen, setMobileTocOpen] = useState(false)

  return (
    <div className="toc-mobile">
      <button
        type="button"
        className="toc-mobile-toggle"
        onClick={() => setMobileTocOpen((value) => !value)}
        aria-expanded={mobileTocOpen}
        aria-controls="subject-mobile-toc"
      >
        {mobileTocOpen ? 'Hide Table of Contents' : 'Show Table of Contents'}
      </button>
      {mobileTocOpen ? (
        <div className="toc-card" id="subject-mobile-toc">
          <TableOfContents items={items} />
        </div>
      ) : null}
    </div>
  )
}

export default SubjectTocToggle