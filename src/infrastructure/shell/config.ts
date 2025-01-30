const script = document.getElementById('refined-prun-js')!;
const config = JSON.parse(script.textContent!) as RefinedPrunConfig;
script.textContent = null;
export default config;
