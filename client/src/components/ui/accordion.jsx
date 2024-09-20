import React from "react";
import classNames from "classnames";

const Accordion = ({ children, className, ...rest }) => {
  return (
    <div className={classNames("space-y-2", className)} {...rest}>
      {children}
    </div>
  );
};

const AccordionItem = ({
  title,
  children,
  isOpen,
  onToggle,
  className,
  ...rest
}) => {
  return (
    <div
      className={classNames("border border-gray-300 rounded-lg", className)}
      {...rest}
    >
      <button
        className="w-full text-left px-4 py-2  hover:bg-gray-100 focus:outline-none duration-300"
        onClick={onToggle}
      >
        <span className="font-semibold">{title}</span>
      </button>
      {isOpen && <div className="p-4 bg-gray-50">{children}</div>}
    </div>
  );
};

Accordion.Item = AccordionItem;

export default Accordion;
