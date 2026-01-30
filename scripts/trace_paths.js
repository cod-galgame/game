const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/story-nodes.json','utf8'));
const start = 'day1_morning_clinic';
const initial = { username: 'Player', favorability: { ghost: 0, konig: 0 }, reputation: 0, hasReported: 0 };

function applyEffect(s, effect) {
  const state = JSON.parse(JSON.stringify(s));
  if (!effect) return state;
  if (effect.resetGame) return JSON.parse(JSON.stringify(initial));
  for (const k of Object.keys(effect)) {
    if (k === 'resetGame') continue;
    if (k === 'ghost' || k === 'konig') state.favorability[k] = (state.favorability[k] || 0) + effect[k];
    if (k === 'reputation' || k === 'hasReported') state[k] = (state[k] || 0) + effect[k];
  }
  return state;
}

function evalCond(cond, state) {
  if (!cond) return true;
  if (cond.field) {
    const val = cond.field === 'reputation' ? state.reputation : (state.favorability[cond.field] || 0);
    const v = cond.value; const op = cond.op;
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

const results = { totalPaths: 0, endCounts: {}, samplePaths: [] };
const seen = new Set();

function stateKey(nodeId, state) {
  return `${nodeId}|g=${state.favorability.ghost||0}|k=${state.favorability.konig||0}|r=${state.reputation||0}|h=${state.hasReported||0}`;
}

function dfs(nodeId, state, path, depth=0) {
  if (depth > 200) {
    // prevent runaway
    results.totalPaths++;
    const key = '<TRUNCATED_PATH>' + (results.samplePaths.length<20?JSON.stringify(path):'');
    results.endCounts[key] = (results.endCounts[key]||0)+1;
    if (results.samplePaths.length<20) results.samplePaths.push([...path, '<TRUNCATED>']);
    return;
  }
  const key = stateKey(nodeId, state);
  if (seen.has(key)) return; // already explored this (node,state)
  seen.add(key);

  const node = data[nodeId];
  if (!node) {
    const miss = `<MISSING:${nodeId}>`;
    results.totalPaths++;
    results.endCounts[miss] = (results.endCounts[miss] || 0) + 1;
    if (results.samplePaths.length < 20) results.samplePaths.push([...path, miss]);
    return;
  }
  if ((node.options && node.options.length === 0) && !node.nextNode) {
    // terminal node
    results.totalPaths++;
    results.endCounts[nodeId] = (results.endCounts[nodeId] || 0) + 1;
    if (results.samplePaths.length < 20) results.samplePaths.push([...path, nodeId]);
    return;
  }
  if (node.nextNode) {
    dfs(node.nextNode, state, [...path, `${nodeId}->${node.nextNode}`], depth+1);
    return;
  }
  for (const o of (node.options||[])) {
    if (o.visibilityCondition && !evalCond(o.visibilityCondition, state)) continue;
    const ns = applyEffect(state, o.effect);
    if (o.nextNode) dfs(o.nextNode, ns, [...path, `${nodeId}#${o.text || o.nextNode}`], depth+1);
    else {
      // no nextNode -> terminal option
      results.totalPaths++;
      const term = `${nodeId}#${o.text || '<no-next>'}`;
      results.endCounts[term] = (results.endCounts[term] || 0) + 1;
      if (results.samplePaths.length < 20) results.samplePaths.push([...path, term]);
    }
  }
}

dfs(start, initial, []);
fs.writeFileSync('scripts/trace_paths_result.json', JSON.stringify(results, null, 2));
console.log('Saved scripts/trace_paths_result.json:', results.totalPaths, 'paths');
console.log('Ends sample:', Object.entries(results.endCounts).slice(0,10));
