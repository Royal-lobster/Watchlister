import React, { useState, useEffect } from "react";
export const SettingsContext = React.createContext();

export const SettingsProvider = ({ children }) => {
  let getInitialState = (storageName) => {
    return typeof window !== "undefined"
      ? localStorage.getItem(storageName)
        ? JSON.parse(localStorage.getItem(storageName))
        : false
      : false;
  };

  const [whereToWatchSetting, setWhereToWatchSetting] = useState(
    getInitialState("WHERE_TO_WATCH_SETTING")
  );

  useEffect(() => {
    console.log("SETTING WHERE TO WATCH SETTING", whereToWatchSetting);
    localStorage.setItem(
      "WHERE_TO_WATCH_SETTING",
      JSON.parse(whereToWatchSetting)
    );
  }, [whereToWatchSetting]);

  return (
    <SettingsContext.Provider
      value={[whereToWatchSetting, setWhereToWatchSetting]}
    >
      {children}
    </SettingsContext.Provider>
  );
};
