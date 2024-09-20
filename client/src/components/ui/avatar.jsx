import React from "react";

const Avatar = React.memo(
  ({ hostName, avatar }) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return (
      <div>
        {avatar && avatar.length > 0 ? (
          <img
            src={avatar}
            alt={hostName}
            className="w-8 h-8 rounded-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `#${randomColor}` }}
          >
            <p className="text-sm text-white">
              {hostName?.charAt(0).toUpperCase()}
            </p>
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.hostName === nextProps.hostName &&
      prevProps.avatar === nextProps.avatar
    );
  }
);

export default Avatar;
