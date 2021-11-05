import React, { useState } from "react";
export const NotionCredContext = React.createContext();

export const NotionCredProvider = ({ children }) => {
  const [notionUserCredentials, setNotionUserCredentials] = useState({});
  return (
    <NotionCredContext.Provider value={[notionUserCredentials, setNotionUserCredentials]}>
      {children}
    </NotionCredContext.Provider>
  );
};
