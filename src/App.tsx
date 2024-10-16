import React from "react";
import HelloWorld from "./components/HelloWorld";

const App: React.FC = () => {
  const [value, setValue] = React.useState<string>("zatial nic");

  return (
    <>
      <HelloWorld value={value} setValue={setValue} />
    </>
  );
};

export default App;
