'use strict';

const { normalize } = require('./text');

const RULES = Object.freeze([
  { id: 'NO_CONTACT', patterns: ['no me llamen', 'no me vuelvan a llamar', 'no vuelvan a llamar', 'no contacten', 'dejen de llamar'], response: 'Entiendo y lamento la molestia. Registraré tu solicitud para que se gestione por el procedimiento correspondiente.', nextMove: 'Finaliza respetuosamente y aplica el procedimiento institucional de no contacto.', objective: 'RESPETAR LA SOLICITUD · NO AGENDAR', alert: 'No argumentes, no insistas y no programes seguimiento.' },
  { id: 'DATA_DELETION', patterns: ['borren mis datos', 'borrar mis datos', 'eliminen mis datos', 'eliminar mis datos'], response: 'Entiendo tu solicitud. Debe registrarse y gestionarse por el procedimiento institucional correspondiente.', nextMove: 'Finaliza la gestión comercial y registra la solicitud de eliminación.', objective: 'PROTEGER LOS DATOS · NO AGENDAR', alert: 'No continúes con recuperación comercial.' },
  { id: 'DATA_ORIGIN', patterns: ['de donde sacaron', 'origen de mis datos', 'como obtuvieron mis datos'], response: 'Entiendo tu inquietud. No quiero darte información incorrecta sobre el origen del registro; debe validarse por el procedimiento interno.', nextMove: 'Aclara si también solicita no contacto y registra la inquietud sin especular.', objective: 'VALIDAR EL ORIGEN DEL DATO', alert: 'No afirmes el origen sin soporte verificable.' },
  { id: 'PRIVACY', patterns: ['privacidad', 'proteccion de datos', 'habeas data'], response: 'La inquietud debe gestionarse por el procedimiento institucional de privacidad y protección de datos.', nextMove: 'Registra la solicitud y utiliza únicamente el canal institucional.', objective: 'PROTEGER LA INFORMACIÓN', alert: 'No solicites ni compartas información personal innecesaria.' },
  { id: 'CURRENT_STUDENT', patterns: ['ya soy estudiante', 'soy estudiante de smart', 'estudiante actual'], response: 'Como ya eres estudiante, primero debemos identificar tu solicitud y orientarte al proceso institucional correspondiente.', nextMove: 'Clasifica la consulta y remítela al canal o proceso oficial aplicable.', objective: 'ENRUTAR CORRECTAMENTE · NO TRATAR COMO VENTA NUEVA', alert: 'No prometas resolver procesos de Servicio al Cliente desde Telemercadeo.' },
  { id: 'SAC_ROUTE', patterns: ['servicio al cliente', 'estado del contrato', 'cambio de beneficiario', 'obligacion cofae'], response: 'Esta consulta debe seguir la orientación establecida por Servicio al Cliente.', nextMove: 'Identifica el tipo de solicitud y aplica la ruta oficial de SAC.', objective: 'ENRUTAR AL PROCESO CORRECTO', alert: 'No improvises requisitos, canales ni resultados.' },
]);

function evaluateCompliance(query) {
  const text = normalize(query);
  for (const rule of RULES) {
    const match = rule.patterns.find((pattern) => text.includes(normalize(pattern)));
    if (match) return Object.assign({ matched: true, match }, rule);
  }
  return { matched: false };
}

module.exports = { RULES, evaluateCompliance };
