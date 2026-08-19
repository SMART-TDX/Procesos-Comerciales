(function () {
  "use strict";

  const plantillaMensual = window.SMART_MONTHLY_CONFIG || {};
  const campanaMensual = Array.isArray(plantillaMensual.campanas)
    ? plantillaMensual.campanas.find(function (campana) { return campana && campana.estado === "ACTIVA" && campana.nombre; })
    : null;
  const valoresBeneficios = Object.freeze({
    ebookUnitario: 152000,
    linguaskill: Object.freeze({ 1: 170000, 2: 304000, 4: 456000 }),
    cursosCortos: Object.freeze({
      "curso-business": 823800,
      "curso-chef": 549200,
      "curso-office": 755400
    })
  });

  window.SMART_COMMERCIAL_CONFIG = Object.freeze({
    version: "1.0.0",
    identidad: Object.freeze({
      logoDisponible: true,
      logoRuta: "logo-smart.svg.png"
    }),
    campana: Object.freeze({
      id: "campana-mensual",
      activa: Boolean(campanaMensual),
      aprobada: Boolean(campanaMensual),
      nombre: campanaMensual ? campanaMensual.nombre : "",
      descripcion: campanaMensual ? campanaMensual.beneficio : "",
      valorComercial: null,
      objetivo: campanaMensual ? campanaMensual.objetivo : "",
      condiciones: campanaMensual ? campanaMensual.condiciones : [],
      argumentos: campanaMensual ? campanaMensual.argumentos : [],
      boton: campanaMensual ? campanaMensual.boton : { texto: "", destino: "" },
      inicio: plantillaMensual.informacionGeneral && plantillaMensual.informacionGeneral.vigencia ? plantillaMensual.informacionGeneral.vigencia.inicio : null,
      fin: plantillaMensual.informacionGeneral && plantillaMensual.informacionGeneral.vigencia ? plantillaMensual.informacionGeneral.vigencia.fin : null,
      beneficioIds: campanaMensual ? ["campana-mes-beneficio"] : []
    }),
    beneficios: Object.freeze([
      Object.freeze({
        id: "linguaskill-1",
        tipo: "EXAMEN",
        nombre: "Examen Linguaskill · 1 habilidad",
        descripcion: "Evaluación Linguaskill de una habilidad.",
        valorComercial: valoresBeneficios.linguaskill[1],
        activa: true,
        aprobada: true,
        seleccion: "EXCLUSIVA_TIPO",
        reglas: Object.freeze({
          lineas: ["SMART_ONLINE", "SMART_FLEX"],
          nivelesMinimosFlex: 2,
          nivelesIncluidosFlex: ["B1"],
          modulosMinimosOnline: 2,
          requiereIntermedioOnline: true
        })
      }),
      Object.freeze({
        id: "linguaskill-2",
        tipo: "EXAMEN",
        nombre: "Examen Linguaskill · 2 habilidades",
        descripcion: "Evaluación Linguaskill de dos habilidades.",
        valorComercial: valoresBeneficios.linguaskill[2],
        activa: true,
        aprobada: true,
        seleccion: "EXCLUSIVA_TIPO",
        reglas: Object.freeze({
          lineas: ["SMART_ONLINE", "SMART_FLEX"],
          nivelesMinimosFlex: 2,
          nivelesIncluidosFlex: ["B1"],
          modulosMinimosOnline: 2,
          requiereIntermedioOnline: true
        })
      }),
      Object.freeze({
        id: "linguaskill-4",
        tipo: "EXAMEN",
        nombre: "Examen Linguaskill · 4 habilidades",
        descripcion: "Evaluación Linguaskill de cuatro habilidades.",
        valorComercial: valoresBeneficios.linguaskill[4],
        activa: true,
        aprobada: true,
        seleccion: "EXCLUSIVA_TIPO",
        reglas: Object.freeze({
          lineas: ["SMART_ONLINE", "SMART_FLEX"],
          nivelesMinimosFlex: 2,
          nivelesIncluidosFlex: ["B1"],
          modulosMinimosOnline: 2,
          requiereIntermedioOnline: true
        })
      }),
      ...[0, 1, 2, 3, 4, 5].map(function (cantidad) {
        return Object.freeze({
          id: "ebooks-" + cantidad,
          tipo: "EBOOK",
          nombre: cantidad === 0 ? "Ninguno" : cantidad + (cantidad === 1 ? " E-Book" : " E-Books"),
          nombrePresentacion: cantidad === 0 ? "Sin E-Books" : cantidad + (cantidad === 1 ? " E-Book" : " E-Books"),
          descripcion: cantidad === 0 ? "Sin E-Books incluidos." : "Material digital complementario.",
          valorComercial: cantidad === 0 ? null : cantidad * valoresBeneficios.ebookUnitario,
          esNinguno: cantidad === 0,
          activa: true,
          aprobada: true,
          seleccion: "EXCLUSIVA_TIPO",
          reglas: Object.freeze({ lineas: ["SMART_FLEX"] })
        });
      }),
      ...[
        ["curso-business", "Smart Business English"],
        ["curso-chef", "Smart Chef"],
        ["curso-office", "Smart Office Suite Skills"]
      ].map(function (curso) {
        return Object.freeze({
          id: curso[0],
          tipo: "CURSO_CORTO",
          nombre: curso[1],
          descripcion: "Curso corto complementario.",
          valorComercial: valoresBeneficios.cursosCortos[curso[0]],
          activa: true,
          aprobada: true,
          seleccion: "EXCLUSIVA_TIPO",
          reglas: Object.freeze({ lineas: ["SMART_FLEX"] })
        });
      }),
      Object.freeze({
        id: "campana-mes-beneficio",
        tipo: "CAMPANA",
        nombre: campanaMensual ? campanaMensual.nombre : "Campaña del Mes",
        descripcion: campanaMensual ? campanaMensual.beneficio : "Beneficio comercial vigente configurado para el período actual.",
        valorComercial: null,
        activa: true,
        aprobada: true,
        seleccion: "EXCLUSIVA_TIPO",
        reglas: Object.freeze({ lineas: ["SMART_ONLINE", "SMART_FLEX"] })
      })
    ].flat())
  });
})();
