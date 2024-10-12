import React from 'react';

const Pagination = (props) => {
  const { pageId, totalPages, setPageId } = props;    
  return (
    <div className="d-flex justify-content-center">
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${pageId === 0 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageId(pageId - 1)}>Previous</button>
          </li>
            <li className="page-item">
                <button className="page-link">{pageId+1}</button>
            </li>
          <li className={`page-item ${pageId === totalPages.length-1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageId(pageId + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
