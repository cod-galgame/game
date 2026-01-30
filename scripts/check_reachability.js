const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/story-nodes.json','utf8'));
const nodes = Object.keys(data);
const initialState = { username: 'Player', favorability: { ghost: 0, konig: 0 }, reputation: 0, hasReported: 0 };

function applyEffect(state, effect) {
  const s = JSON.parse(JSON.stringify(state));
  if (!effect) return s;
  if (effect.resetGame) return JSON.parse(JSON.stringify(initialState));
  for (const k of Object.keys(effect)) {
    if (k === 'resetGame') continue;
    if (k === 'ghost' || k === 'konig' || k === 'reputation' || k === 'hasReported') {
      if (k === 'reputation' || k === 'hasReported') s[k] = (s[k] || 0) + effect[k];
      else s.favorability[k] = (s.favorability[k] || 0) + effect[k];
    }
  }
  return s;
}

function evalCond(cond, state) {
  if (!cond) return true;
  if (cond.field) {
    const val = cond.field === 'reputation' ? state.reputation : (state.favorability[cond.field] || 0);
    const op = cond.op;
    const v = cond.value;
    switch (op) {
      case 'eq': return val === v;
      case 'ne': return val !== v;
      case 'gt': return val > v;
      case 'lt': return val < v;
      case 'gte': return val >= v;
      case 'lte': return val <= v;
      default: return false;
    }
  } else {
    if (cond.op === 'and') return cond.conds.every(c => evalCond(c, state));
    return cond.conds.some(c => evalCond(c, state));
  }
}

function reachableToTargets(start) {
  const targets = new Set(['bedend','to_be_continued']);
  const seen = new Set();
  const stack = [{ node: start, state: initialState }];
  while (stack.length) {
    const cur = stack.pop();
    const key = JSON.stringify({n:cur.node, g:cur.state.favorability.ghost, k:cur.state.favorability.konig, r:cur.state.reputation, h:cur.state.hasReported});
    if (seen.has(key)) continue;
    seen.add(key);
    if (targets.has(cur.node)) return true;
    const node = data[cur.node];
    if (!node) continue;
    if (node.nextNode) { stack.push({ node: node.nextNode, state: cur.state }); continue; }
    const opts = node.options || [];
    if (opts.length === 0) continue;
    for (const o of opts) {
      if (o.visibilityCondition && !evalCond(o.visibilityCondition, cur.state)) continue;
      const ns = applyEffect(cur.state, o.effect);
      if (o.nextNode) stack.push({ node: o.nextNode, state: ns });
    }
  }
  return false;
}

const notReach = nodes.filter(id => !reachableToTargets(id));
console.log('Nodes that cannot reach bedend or to_be_continued (count):', notReach.length);
if (notReach.length) console.log(notReach.join('\n'));
fs.writeFileSync('scripts/check_reachability_result.json', JSON.stringify(notReach, null, 2));
console.log('Saved scripts/check_reachability_result.json');