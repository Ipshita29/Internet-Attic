import { forwardRef } from 'react';

/** Icon-only button. The label doubles as accessible name and tooltip. */
const IconButton = forwardRef(function IconButton({ label, children, className = '', tip = 'top', ...rest }, ref) {
  return (
    <button ref={ref} type="button" className={`icon-btn ${className}`} aria-label={label} data-tip={label} data-tip-pos={tip} {...rest}>
      {children}
    </button>
  );
});

export default IconButton;
