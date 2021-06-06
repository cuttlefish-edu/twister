import * as fs from 'fs';
import {jjencode} from './jjencode.mjs'
const data = fs.readFileSync(0, "utf-8");
console.log(jjencode('$',data));