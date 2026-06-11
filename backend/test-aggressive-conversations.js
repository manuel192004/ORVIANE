/**
 * TEST AGRESIVO DE CONVERSACIONES LARGAS - ORVIA
 * 
 * Escenarios multi-turno complejos, contradicciones, refinamientos encadenados,
 * presupuesto + restricciones, pérdida de contexto, etc.
 */

const { createAssistantV2RulesReply } = require('./src/assistant-v2/service');

let total = 0;
let problems = [];

function runConversation(name, turns) {
  total++;
  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`ESCENARIO AGRESIVO #${total}: ${name}`);
  console.log(`═══════════════════════════════════════════════════════════\n`);

  let memory = {};
  let conversation = [];

  turns.forEach((turn, i) => {
    console.log(`\n--- Turno ${i+1} ---`);
    console.log(`Usuario: "${turn}"`);

    const payload = {
      message: turn,
      memory: { ...memory },
      conversation: [...conversation],
      clientContext: { currentPath: '/cuenta' }
    };

    const reply = createAssistantV2RulesReply(payload);
    const text = reply.assistantMessage || '(sin respuesta)';

    console.log(`Orvia: "${text}"`);
    console.log(`[Memoria] avoided: ${JSON.stringify(reply.memory.avoidedFeatures || [])}, budgetMax: ${reply.memory.budgetMaxCop || '—'}, jewelry: ${reply.memory.jewelryType || '—'}`);

    // Detectar problemas comunes
    const lower = text.toLowerCase();
    if (lower.includes('dime al menos una de estas tres') && i > 1) {
      problems.push(`${name} - Turno ${i+1}: Siguió usando la frase genérica después de varios turnos`);
    }
    if (lower.length < 50 && !turn.toLowerCase().includes('gracias')) {
      problems.push(`${name} - Turno ${i+1}: Respuesta muy corta`);
    }

    conversation.push({ role: 'user', text: turn });
    conversation.push({ role: 'assistant', text: text });
    memory = { ...reply.memory };
  });
}

// =====================================================
// ESCENARIOS AGRESIVOS
// =====================================================

// 1. Cadena larga de refinamientos
runConversation('Cadena de refinamientos (5 turnos)', [
  'Hola, buenos días',
  'Quiero un anillo de compromiso',
  'Quiero algo más grande',
  'Pero más discreto, nada de pave',
  'Y con presupuesto máximo de 1.2 millones'
]);

// 2. Contradicción fuerte + recuperación
runConversation('Contradicción y recuperación', [
  'Quiero algo muy brillante y llamativo',
  'En realidad no, prefiero algo minimalista y discreto',
  'Muéstrame opciones en oro blanco',
  '¿Qué me recomiendas de lo que hablamos?'
]);

// 3. Presupuesto muy bajo + varias recomendaciones
runConversation('Presupuesto estricto 350 mil', [
  'Tengo máximo 350 mil pesos',
  'Quiero ver anillos',
  '¿Qué me puedes mostrar con ese presupuesto?',
  'Muéstrame algo en plata entonces'
]);

// 4. Conversación de 7 turnos con memoria
runConversation('Conversación larga de 7 turnos', [
  'Hola Orvia, ¿cómo estás?',
  'Estoy buscando un regalo para mi mamá',
  'Algo delicado, en oro',
  'Prefiero aretes o cadena',
  'Nada muy caro, digamos hasta 800 mil',
  'Muéstrame opciones de aretes',
  '¿Cuál de las que me mostraste es la más elegante?'
]);

// 5. Pide algo que contradice todo lo anterior
runConversation('Contradicción total de restricciones', [
  'Quiero algo discreto y minimal',
  'Presupuesto hasta 500 mil',
  'Nada de diamantes',
  'Muéstrame algo bien grande y brillante con diamantes grandes'
]);

// 6. Refinamientos encadenados sin perder el hilo
runConversation('Refinamientos encadenados', [
  'Quiero ver pulseras',
  'Una más gruesa',
  'Pero en plata',
  'Más económica que lo normal',
  '¿Tienes algo así en las colecciones?'
]);

// 7. Saludo + contexto + refinamiento + pregunta de precio
runConversation('Flujo completo realista', [
  'Buenas tardes',
  'Busco algo para compromiso',
  'En oro amarillo',
  'Quiero algo más grande que los solitarios normales',
  '¿Cuánto más o menos costaría algo así?'
]);

// 8. Usuario cambia de opinión varias veces
runConversation('Cambio de opinión múltiple', [
  'Quiero algo moderno',
  'Mejor algo clásico',
  'En realidad algo romántico',
  'Con perlas',
  'No, mejor sin piedras'
]);

// 9. Escenario muy difícil: muchas restricciones + refinamiento tardío
runConversation('Restricciones acumuladas + refinamiento', [
  'Quiero algo para uso diario',
  'Presupuesto máximo 600 mil',
  'Nada de pave ni muy brillante',
  'En plata o oro blanco',
  'Pero que sea más grande de lo normal',
  '¿Qué me recomiendas ahora?'
]);

// 10. Conversación con corrección fuerte
runConversation('Corrección fuerte después de recomendación', [
  'Muéstrame aretes',
  'Quiero los más elegantes que tengas',
  'No, en realidad prefiero algo muy discreto y barato',
  'Olvídate de lo anterior, quiero algo para mamá'
]);

// 11. Refinamiento repetido + presupuesto que llega tarde
runConversation('Refinamiento + presupuesto tardío', [
  'Quiero un anillo',
  'Más grande',
  'Más elegante',
  'Pero con presupuesto de 700 mil máximo',
  '¿Qué opciones tengo realmente?'
]);

// 12. Saludo cordial + contexto + refinamiento + pregunta personal
runConversation('Flujo muy humano', [
  'Hola Orvia, ¿qué tal? ¿Cómo estás?',
  'Estoy buscando un regalo especial',
  'Algo discreto en oro blanco',
  'Más pequeño que los normales',
  '¿Cuál me recomiendas de verdad?'
]);

// 13. Usuario pide algo que viola todas sus restricciones anteriores
runConversation('Petición que contradice todo', [
  'Quiero algo minimalista y barato',
  'Nada de brillos ni pave',
  'Máximo 400 mil',
  'Muéstrame el anillo más grande y brillante que tengas con diamantes'
]);

// 14. Memoria de varios turnos + cambio de metal
runConversation('Cambio de metal en medio', [
  'Quiero ver pulseras',
  'En oro amarillo',
  'Pero más gruesa',
  'En realidad prefiero en plata',
  '¿Qué me puedes mostrar ahora?'
]);

// =====================================================
// RESUMEN
// =====================================================

console.log('\n\n╔════════════════════════════════════════════════════════════╗');
console.log('║           RESUMEN DE PRUEBAS AGRESIVAS                       ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log(`\nEscenarios ejecutados: ${total}`);
console.log(`Problemas detectados automáticamente: ${problems.length}`);

if (problems.length > 0) {
  console.log('\nProblemas encontrados:');
  problems.forEach((p, i) => console.log(`${i+1}. ${p}`));
} else {
  console.log('\nNo se detectaron problemas automáticos graves en esta ronda.');
}

console.log('\nNota: Revisa manualmente las conversaciones completas arriba para incoherencias sutiles de memoria y tono.\n');