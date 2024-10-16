import { Button } from "@mui/material";
import React from "react";
import axios from "axios";

interface HelloWorldProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const HelloWorld: React.FC<HelloWorldProps> = ({ value, setValue }) => {
  const getData = () => {
    axios
      .get("/helloworld")
      .then((res) => {
        setValue(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {value}
      <Button variant="contained" onClick={getData}>
        Get data
      </Button>
    </>
  );
};

export default HelloWorld;
