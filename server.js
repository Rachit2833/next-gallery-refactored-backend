const express = require("express");
const app =require("./app")
const PORT = 2833;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
