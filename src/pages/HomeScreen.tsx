import { Button } from "@mui/material";
import React from "react";
import axios from "axios";

const HomeScreen: React.FC = () => {
  const [value, setValue] = React.useState<string>("zatial nic");

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
    <div>
      <h1>This is the Home screen</h1>
      {value}
      <Button
        variant="contained"
        onClick={() => {
          getData();
        }}
      >
        Get data
      </Button>
    </div>
  );
};

export default HomeScreen;
