/**
 * TEST INTEGRAL DE INTELIGENCIA Y COHERENCIA - ORVIA
 * 
 * Este script prueba el asistente en muchos escenarios reales para encontrar
 * incoherencias, respuestas cortas, falta de memoria, problemas de cordialidad, etc.
 * 
 * Ejecutar: node test-assistant-intelligence.js
 */

const { createAssistantV2RulesReply } = require('./src/assistant-v2/service');

let totalTests = 0;
let issuesFound = [];

function logTest(name, message, memory = {}, conversation = []) {
  totalTests++;
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`TEST #${totalTests}: ${name}`);
  console.log(`Usuario: "${message}"`);
  
  const payload = {
    message,
    memory: { ...memory },
    conversation: conversation || [],
    clientContext: { currentPath: '/cuenta' },
  };

  const reply = createAssistantV2RulesReply(payload);
  const text = reply.assistantMessage || '(sin respuesta)';
  const mem = reply.memory || {};

  console.log(`\nOrvia: "${text}"`);
  console.log(`\n[Memoria actual]`);
  console.log(`  avoidedFeatures: ${JSON.stringify(mem.avoidedFeatures || [])}`);
  console.log(`  budget: ${mem.budget || '—'} | budgetMaxCop: ${mem.budgetMaxCop || '—'}`);
  console.log(`  jewelryType: ${mem.jewelryType || '—'} | metal: ${mem.metal || '—'}`);
  console.log(`  refinement: ${mem.refinement || '—'}`);
  console.log(`  lastIntent: ${reply.detectedIntent || '—'}`);

  return { reply, text, memory: mem };
}

function flagIssue(testName, description) {
  issuesFound.push({ test: testName, issue: description });
  console.log(`\n⚠️  POSIBLE PROBLEMA: ${description}`);
}

// =====================================================
// BATERÍA DE PRUEBAS
// =====================================================

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║   TEST INTEGRAL DE INTELIGENCIA - ORVIA v2                 ║');
console.log('║   Buscando incoherencias, respuestas cortas y falta de     ║');
console.log('║   memoria / cordialidad / refinamiento                     ║');
console.log('╚════════════════════════════════════════════════════════════╝');

// ─────────────────────────────────────────────────────
// 1. SALUDOS Y SMALL TALK (cordialidad)
// ─────────────────────────────────────────────────────

console.log('\n\n========== CATEGORÍA 1: SALUDOS Y CORDIALIDAD ==========\n');

let r = logTest('Saludo simple', 'Hola');
if (r.text.length < 40 || r.text.toLowerCase().includes('dime') && !r.text.toLowerCase().includes('hola')) {
  flagIssue('Saludo simple', 'Respuesta demasiado corta o poco cordial para un saludo');
}

r = logTest('Buenos días con pregunta', 'Buenos días, ¿cómo estás?');
if (!r.text.toLowerCase().includes('buenos') && !r.text.toLowerCase().includes('bien') && !r.text.toLowerCase().includes('gracias')) {
  flagIssue('Buenos días ¿cómo estás?', 'No respondió de forma cálida a la pregunta personal');
}

r = logTest('¿Cómo estás Orvia?', 'Hola Orvia, ¿cómo estás hoy?');
if (r.text.length < 50) {
  flagIssue('¿Cómo estás?', 'Respuesta muy corta para una pregunta personal');
}

r = logTest('Solo "Hola"', 'Hola');
if (r.text.toLowerCase().startsWith('para orientarte')) {
  flagIssue('Solo Hola', 'Saltó directamente a vender sin responder al saludo con calidez');
}

// ─────────────────────────────────────────────────────
// 2. REFINAMIENTOS (el problema que reportó el usuario)
// ─────────────────────────────────────────────────────

console.log('\n\n========== CATEGORÍA 2: REFINAMIENTOS ("más grande", etc.) ==========\n');

r = logTest('Primera pieza', 'Quiero ver anillos de compromiso');
const firstRing = r.reply.suggestedAction?.productReference || 'NINGUNA';

r = logTest('Pide algo más grande', 'Quiero uno más grande', r.memory);
if (r.text.toLowerCase().includes('anillo') && !r.text.toLowerCase().includes('grande') && !r.text.toLowerCase().includes('presencia')) {
  flagIssue('Más grande', 'No reconoció el ajuste de tamaño y repitió recomendación similar');
}

r = logTest('Pide más discreto', 'Algo más discreto y minimal', r.memory);
if (r.text.toLowerCase().includes('pave') || r.text.toLowerCase().includes('brillante')) {
  flagIssue('Más discreto', 'Siguió recomendando algo brillante después de pedir discreto');
}

r = logTest('Otra versión', 'Muéstrame otra versión en oro blanco', r.memory);

// ─────────────────────────────────────────────────────
// 3. MEMORIA DE RESTRICCIONES (presupuesto + avoided)
// ─────────────────────────────────────────────────────

console.log('\n\n========== CATEGORÍA 3: MEMORIA DE RESTRICCIONES ==========\n');

r = logTest('Declara presupuesto y evita algo', 'Quiero algo hasta 700 mil, nada de pave ni muy brillante');
const budgetMem = r.memory;

r = logTest('Pide ver anillos (debería respetar restricciones)', 'Muéstrame anillos', budgetMem);
if (r.text.toLowerCase().includes('pave') || r.text.toLowerCase().includes('brillante')) {
  flagIssue('Respeto de restricciones', 'Recomendó algo con pave/brillante después de que el usuario dijo que no lo quería');
}

r = logTest('Presupuesto muy bajo + pieza cara', 'Tengo máximo 400 mil', { budget: 'máximo 400 mil', budgetMaxCop: 400000 });

// ─────────────────────────────────────────────────────
// 4. SEGUIMIENTO DE CONVERSACIÓN (multi-turn)
// ─────────────────────────────────────────────────────

console.log('\n\n========== CATEGORÍA 4: SEGUIMIENTO DE CONVERSACIÓN ==========\n');

let conv = [];
r = logTest('Turno 1 - Saludo', 'Hola, buenos días', {}, conv);
conv.push({ role: 'user', text: 'Hola, buenos días' });
conv.push({ role: 'assistant', text: r.text });

r = logTest('Turno 2 - Contexto', 'Quiero un anillo para compromiso', r.memory, conv);
conv.push({ role: 'user', text: 'Quiero un anillo para compromiso' });
conv.push({ role: 'assistant', text: r.text });

r = logTest('Turno 3 - Refinamiento', 'Pero más grande que el que me mostraste', r.memory, conv);
if (!r.text.toLowerCase().includes('grande') && !r.text.toLowerCase().includes('ajust')) {
  flagIssue('Seguimiento multi-turn', 'Perdió el contexto del anillo anterior al pedir "más grande"');
}

// ─────────────────────────────────────────────────────
// 5. PREGUNTAS DE PRECIO (moneda + coherencia)
// ─────────────────────────────────────────────────────

console.log('\n\n========== CATEGORÍA 5: PREGUNTAS DE PRECIO ==========\n');

r = logTest('Precio de oro', '¿Cuánto cuesta el oro de 18 quilates por gramo?');
if (!r.text.toLowerCase().includes('pesos')) {
  flagIssue('Precio de oro', 'No aclaró que está en pesos colombianos');
}

r = logTest('Valoración con piedra', 'Quiero valorar un anillo en oro blanco con esmeralda de 0.6 quilates');

// ─────────────────────────────────────────────────────
// 6. PREGUNTAS TRICKY / FUERA DE CONTEXTO
// ─────────────────────────────────────────────────────

console.log('\n\n========== CATEGORÍA 6: PREGUNTAS TRICKY / LÍMITE ==========\n');

r = logTest('Pregunta personal fuera de tema', '¿Tienes novio?');
if (!r.text.toLowerCase().includes('joy') && !r.text.toLowerCase().includes('orvia') && r.text.length > 30) {
  // Si responde algo largo que no redirige, es problema
}

r = logTest('Pregunta sobre otro negocio', '¿Venden relojes?');
if (!r.text.toLowerCase().includes('joy') && r.text.length > 25) {
  flagIssue('Fuera de tema', 'No redirigió claramente al dominio de joyería');
}

r = logTest('Pregunta técnica compleja', '¿Cuál es la diferencia entre oro 18k y 14k en durabilidad y precio?');

// ─────────────────────────────────────────────────────
// 7. CONTRADICCIONES DEL USUARIO
// ─────────────────────────────────────────────────────

console.log('\n\n========== CATEGORÍA 7: CAMBIOS DE OPINIÓN ==========\n');

r = logTest('Primero quiere brillante', 'Quiero algo bien brillante y llamativo');
r = logTest('Luego dice que no', 'En realidad no, prefiero algo discreto', r.memory);
if (r.text.toLowerCase().includes('brillante') || r.text.toLowerCase().includes('pave')) {
  flagIssue('Cambio de opinión', 'No respetó el cambio de "brillante" a "discreto"');
}

// ─────────────────────────────────────────────────────
// 8. RESPUESTAS MUY CORTAS O REPETITIVAS
// ─────────────────────────────────────────────────────

console.log('\n\n========== CATEGORÍA 8: RESPUESTAS CORTAS / ROBÓTICAS ==========\n');

r = logTest('Pide ver colecciones', 'Quiero ver las colecciones');
if (r.text.length < 60) {
  flagIssue('Ver colecciones', 'Respuesta demasiado corta y genérica');
}

r = logTest('Pide recomendación sin datos', 'Recomiéndame algo bonito');
if (r.text.length < 70 || r.text.includes('dime al menos')) {
  flagIssue('Recomendación sin datos', 'Respuesta corta o pide demasiada información de golpe');
}

// ─────────────────────────────────────────────────────
// RESUMEN FINAL
// ─────────────────────────────────────────────────────

console.log('\n\n');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                    RESUMEN DE PRUEBAS                      ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log(`\nTotal de escenarios probados: ${totalTests}`);
console.log(`Incoherencias o problemas detectados: ${issuesFound.length}`);

if (issuesFound.length > 0) {
  console.log('\n\nLISTADO DE PROBLEMAS ENCONTRADOS:\n');
  issuesFound.forEach((item, i) => {
    console.log(`${i + 1}. [${item.test}]`);
    console.log(`   → ${item.issue}\n`);
  });
} else {
  console.log('\n¡No se detectaron problemas graves en esta batería de pruebas!');
}

console.log('\nNota: Estas pruebas usan principalmente el motor de reglas.');
console.log('Cuando se usa LLM (OpenAI/Gemini) los comportamientos pueden variar.\n');