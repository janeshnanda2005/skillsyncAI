import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Dropdown.css';

export default function Dropdown({ endpoint, labelText, placeholder, onSelect, value }) {
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch the data');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [endpoint]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setSelectedValue(val);
    if (onSelect) onSelect(val);
  }, [onSelect]);

  const handleOptionClick = useCallback((itemId) => {
    setSelectedValue(itemId);
    setIsOpen(false);
    if (onSelect) onSelect(itemId);
  }, [onSelect]);

  return (
    <div className="dd-wrapper" ref={dropdownRef}>
      <label className="dd-label">{labelText}</label>

      {loading && <p className="dd-loading">Loading options...</p>}
      {error && <p className="dd-error">Error: {error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="dd-empty">No options available.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="dd-select-wrapper">
          <select
            className={`dd-select ${isOpen ? 'dd-select--open' : ''}`}
            value={selectedValue}
            onChange={handleChange}
            onFocus={() => setIsOpen(true)}
          >
            <option value="" disabled>-- {placeholder} --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label_text || item.name || item.title || item.id}
              </option>
            ))}
          </select>
          <span className="dd-arrow">▾</span>

          {isOpen && (
            <ul className="dd-options">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`dd-option ${selectedValue === item.id ? 'dd-option--active' : ''}`}
                  onClick={() => handleOptionClick(item.id)}
                  role="option"
                  aria-selected={selectedValue === item.id}
                >
                  <span className="dd-option-text">{item.label_text || item.name || item.title || item.id}</span>
                  {selectedValue === item.id && <span className="dd-check">✓</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}