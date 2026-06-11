/**
 * Test script para verificar que el asistente Orvia ya no confunde pesos con dólares.
 * 
 * Ejecutar con:
 *   node test-currency-guard.js
 */

const { createAssistantV2RulesReply } = require('./src/assistant-v2/service');
const {
  buildValuationKnowledgePrompt,
  buildCurrencySafetyBlock,
} = require('./src/assistant-v2/valuation');

// Importar las funciones de sanitizer desde openai.js y vertex.js
// (las expongo temporalmente copiando la lógica para el test)
function forceColombianPesos(text) {
  if (!text) return text;
  let fixed = text;
  fixed = fixed.replace(/\b(dólares|dolares|dólar|dolar|USD|US\s*dollars?)\b/gi, 'pesos colombianos');
  fixed = fixed.replace(/\b(dólar americano|dolar americano)\b/gi, 'peso colombiano');
  if (/\$\s*[\d.,]/.test(fixed) && !/pesos colombianos|COP|pesos colombianos/i.test(fixed)) {
    fixed = fixed.replace(/(\$\s*[\d.,]+(?:\s*[\d.,]+)?)/g, '$1 pesos colombianos');
  }
  return fixed;
}

const FORBIDDEN = ['dólar', 'dolares', 'dólares', 'USD', 'dolar americano', 'US dollars'];
const MUST_CONTAIN = ['pesos colombianos', 'COP'];

function hasForbidden(text) {
  const lower = (text || '').toLowerCase();

  // Permitir la palabra "dólar" solo en contexto legítimo de explicación de TRM / tipo de cambio
  const trmContext = /trm|tipo de cambio|por un dólar|dólar estadounidense/i.test(text || '');

  const realForbidden = FORBIDDEN.filter(w => {
    if ((w === 'dólar' || w === 'dolar') && trmContext) return false;
    return true;
  });

  return realForbidden.some(w => lower.includes(w));
}

function hasCurrencyClarity(text) {
  const lower = (text || '').toLowerCase();
  return MUST_CONTAIN.some(w => lower.includes(w));
}

function runTest(name, message, options = {}) {
  console.log(`\n=== ${name} ===`);
  console.log(`Usuario: "${message}"`);

  const payload = {
    message,
    conversation: options.conversation || [],
    memory: options.memory || {},
    clientContext: options.clientContext || { currentPath: '/cuenta' },
    accountContext: options.accountContext || {},
  };

  const reply = createAssistantV2RulesReply(payload);
  const msg = reply.assistantMessage || '';

  const forbiddenFound = hasForbidden(msg);
  const hasClarity = hasCurrencyClarity(msg);
  const hasPrice = /\$|\b(pesos|millones|mil|gramo|quilate)\b/i.test(msg);

  console.log(`Respuesta: ${msg.substring(0, 280)}${msg.length > 280 ? '...' : ''}`);
  console.log(`→ ¿Contiene palabras prohibidas? ${forbiddenFound ? '❌ SÍ (MALO)' : '✅ No'}`);
  console.log(`→ ¿Menciona "pesos colombianos" o "COP"? ${hasClarity ? '✅ Sí' : (hasPrice ? '⚠️  Parcial (menciona precio pero no aclara moneda)' : '— (no hay precio)')}`);

  if (reply.diagnostics?.valuation) {
    console.log(`→ Valoración detectada: ${reply.diagnostics.valuation.ready ? 'lista' : 'incompleta'} | ${reply.diagnostics.valuation.estimatedRange || ''}`);
  }

  return { forbiddenFound, hasClarity, reply };
}

console.log('========================================');
console.log('  PRUEBAS DE GUARDA DE MONEDA - ORVIA');
console.log('========================================\n');

// 1. Precio directo de material (el caso clásico que fallaba)
runTest(
  'Precio de oro por gramo',
  'cuánto cuesta el oro de 18 quilates por gramo'
);

// 2. Valoración de pieza terminada
runTest(
  'Valorar anillo con peso',
  'quiero valorar un anillo en oro amarillo de 18 quilates de 5 gramos'
);

// 3. Valoración con piedra
runTest(
  'Valorar con diamante',
  'cuánto vale un anillo de oro blanco con diamante de 0.30 quilates'
);

// 4. Precio de piedra suelta
runTest(
  'Precio de esmeralda',
  'precio de una esmeralda colombiana de 0.8 quilates'
);

// 5. Caso con presupuesto explícito (nueva mejora)
runTest(
  'Valoración con presupuesto',
  'quiero valorar una pulsera en plata de 8 gramos, mi presupuesto es hasta 600 mil',
  { memory: { budget: 'hasta 600 mil' } }
);

// 6. Simulación de alucinación del LLM (el sanitizer debe rescatar)
console.log('\n=== SIMULACIÓN DE ALUCINACIÓN DEL LLM (post-procesamiento) ===');
const badLLMOutputs = [
  'El oro de 18k está alrededor de $45 dólares por gramo.',
  'Un diamante fino de 0.5 quilates puede costar entre 3000 y 8000 USD.',
  'Para esa pieza el rango sería de $1,800 a $2,400 dólares aproximadamente.',
  'El platino está en unos $28 por gramo.',
];

badLLMOutputs.forEach((bad, i) => {
  const fixed = forceColombianPesos(bad);
  const stillBad = hasForbidden(fixed);
  const nowClear = hasCurrencyClarity(fixed);
  console.log(`\nEntrada mala #${i + 1}: ${bad}`);
  console.log(`Salida corregida: ${fixed}`);
  console.log(`→ ¿Sigue teniendo problema? ${stillBad ? '❌ SÍ' : '✅ No'} | ¿Aclaró moneda? ${nowClear ? '✅' : '⚠️'}`);
});

// 7. Verificar que los bloques de seguridad están presentes
console.log('\n=== VERIFICACIÓN DE PROMPTS ===');
const knowledge = buildValuationKnowledgePrompt();
const safety = buildCurrencySafetyBlock();

const knowledgeHasCOP = knowledge.includes('PESOS COLOMBIANOS') || knowledge.includes('pesos colombianos');
const safetyHasCOP = safety.includes('PESOS COLOMBIANOS') || safety.includes('pesos colombianos');

console.log(`buildValuationKnowledgePrompt contiene referencia fuerte a COP: ${knowledgeHasCOP ? '✅' : '❌'}`);
console.log(`buildCurrencySafetyBlock existe y es fuerte: ${safetyHasCOP ? '✅' : '❌'}`);
console.log(`Longitud del bloque de seguridad: ${safety.length} caracteres`);

// =====================================================
// NUEVAS PRUEBAS: RESTRICCIONES (Presupuesto + Avoided Features)
// =====================================================

console.log('\n========================================');
console.log('  PRUEBAS DE RESTRICCIONES (Presupuesto + Evitar)');
console.log('========================================\n');

function runRestrictionTest(name, message, memory = {}) {
  console.log(`\n--- ${name} ---`);
  console.log(`Usuario: "${message}"`);

  const payload = {
    message,
    memory,
    conversation: [],
    clientContext: { currentPath: '/cuenta' },
  };

  const reply = createAssistantV2RulesReply(payload);
  const msg = reply.assistantMessage || '';
  const mem = reply.memory || {};

  console.log(`Respuesta: ${msg.substring(0, 220)}${msg.length > 220 ? '...' : ''}`);
  console.log(`→ avoidedFeatures en memoria: ${JSON.stringify(mem.avoidedFeatures || [])}`);
  console.log(`→ budgetMaxCop: ${mem.budgetMaxCop || 'null'}`);

  return reply;
}

// Test 1: Usuario rechaza pave
runRestrictionTest(
  'Rechazo de pave',
  'no me gusta el pave, prefiero algo más discreto',
  { avoidedFeatures: [] }
);

// Test 2: Usuario declara presupuesto + evita algo
runRestrictionTest(
  'Presupuesto + evita diamantes',
  'quiero algo hasta 800 mil, nada de diamantes grandes',
  {}
);

// Test 3: Continuación con memoria previa
runRestrictionTest(
  'Continuación respetando restricciones previas',
  'muéstrame opciones de anillos',
  {
    avoidedFeatures: ['pave', 'diamantes grandes'],
    budget: 'hasta 800 mil',
    budgetMaxCop: 800000,
  }
);

console.log('\n========================================');
console.log('  FIN DE TODAS LAS PRUEBAS');
console.log('========================================');