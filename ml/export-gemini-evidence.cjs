// Export trusted results so the Python API never accepts invented browser guidance.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'troubleshooting-data.js'));
const context = vm.createContext({});
vm.runInContext(source.toString(), context);
const catalog = vm.runInContext(`(() => {
    const models = {}, summaries = [], index = new Map();
    for (const [id, model] of Object.entries(TROUBLESHOOTING_MODELS)) {
        if (!canDiagnose(model)) continue;
        const tree = buildDiagnosisTree(model), routes = {};
        function visit(nodeId, history) {
            const node = tree.nodes[nodeId];
            if (node.type === 'result') {
                const diagnosis = getDiagnosis(model, node.kind, history);
                const text = JSON.stringify(diagnosis);
                if (!index.has(text)) { index.set(text, summaries.length); summaries.push(diagnosis); }
                routes[history.map(a => a.answer).join('|')] = index.get(text);
                return;
            }
            for (const [answer, next] of Object.entries(node.next)) {
                visit(next, [...history, {nodeId, question: node.text, answer}]);
            }
        }
        visit(tree.start, []);
        models[id] = {name: model.name, tree, routes};
    }
    return {models, summaries, identities: Object.fromEntries(Object.entries(TROUBLESHOOTING_MODELS).map(([id, model]) => [id, model.name]))};
})()`, context);
catalog.source_sha256 = crypto.createHash('sha256').update(source).digest('hex');
fs.writeFileSync(path.join(__dirname, 'gemini-evidence.json'), JSON.stringify(catalog));
console.log('Exported trusted Gemini context for ' + Object.keys(catalog.models).length + ' models.');
