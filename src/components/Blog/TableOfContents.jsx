const parseTocLabel = (text) => {
  const raw = String(text || "").trim();
  const match = raw.match(/^((?:\d+(?:\.\d+)*\.?)|(?:Unit\s+\d+:?))\s+(.*)$/i);

  if (!match) {
    return { index: "", label: raw };
  }

  return {
    index: match[1].replace(/\.$/, ""),
    label: match[2],
  };
};

const TableOfContents = ({ items }) => {
  if (!items.length) {
    return <p className="toc-empty">No sections available.</p>;
  }

  return (
    <div className="toc-scroll">
      <ul className="toc-list">
        {items.map((item) => {
          const { index, label } = parseTocLabel(item.text);

          return (
            <li key={item.id} className={`toc-item ${item.level === 3 ? "toc-sub" : "toc-main"}`}>
              <a className="toc-link" href={`#${item.id}`}>
                {index ? <span className="toc-index">{index}</span> : null}
                <span className="toc-text">{label || item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TableOfContents;
