const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/story-nodes.json','utf8'));
const defined = new Set(Object.keys(data));
const refs = new Set();
const re = /"nextNode"\s*:\s*"([^"]+)"/g;
const text = fs.readFileSync('src/data/story-nodes.json','utf8');
let m;
while ((m = re.exec(text))) {
  if (!defined.has(m[1])) refs.add(m[1]);
}
if (refs.size) console.log('Missing nextNode targets:\n' + [...refs].join('\n'));
else console.log('No missing nextNode targets');
fs.writeFileSync('scripts/missing_nextNode.json', JSON.stringify([...refs], null, 2));
console.log('Saved scripts/missing_nextNode.json');