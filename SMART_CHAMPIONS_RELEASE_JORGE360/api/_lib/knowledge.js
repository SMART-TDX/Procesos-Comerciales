'use strict';

const database = require('../../knowledge/jorge-knowledge-base.json');

function activeRecords() {
  return database.records.filter((record) => record.Estado === 'VIGENTE');
}

function sourceFor(record) {
  return {
    knowledgeId: record.KnowledgeID,
    title: record.Titulo,
    document: record.Documento,
    location: record.Ubicacion,
    status: record.Estado,
    validFrom: record.VigenteDesde,
    validUntil: record.VigenteHasta,
    priority: record.Prioridad,
    type: record.Tipo,
  };
}

module.exports = { database, activeRecords, sourceFor };
