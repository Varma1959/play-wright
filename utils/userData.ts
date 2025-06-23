// import * as fs from 'fs';

// const userData = JSON.parse(fs.readFileSync('./test-data/user.json', 'utf-8'));
// export default userData;
import * as fs from "fs";

const rawData = fs.readFileSync("./test-data/user.json", "utf-8");
const userData = JSON.parse(rawData);

export default userData;
