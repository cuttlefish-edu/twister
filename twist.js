let {jjencode} = require("./jjencode")
const fs = require("fs");
const data = fs.readFileSync(0, "utf-8");
console.log(jjencode('$',data));