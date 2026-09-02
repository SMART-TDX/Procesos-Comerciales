(function () {
  "use strict";

  /*
   * SMART SALES HUB · PLANTILLA MAESTRA MENSUAL
   * ------------------------------------------------------------
   * Este es el único archivo que debe diligenciarse cada mes.
   * Conserva los nombres de los campos y modifica únicamente datos.
   * Los campos vacíos no se publican en la plataforma.
   */
  window.SMART_MONTHLY_CONFIG = {
    informacionGeneral: {
      mes: "",
      anio: null,
      vigencia: {
        inicio: "",
        fin: ""
      },
      fechaCorte: "",
      mensajePrincipal: "",
      mensajeDirector: ""
    },

    metas: {
      metaGeneral: null,
      recaudo: null,
      contado: null,
      metaSmartOnline: null,
      metaSmartFlex: null,
      metaPorEjecutivo: null,
      promedioDiario: null
    },

    novedadesDelMes: [],

    campanas: [
      {
        nombre: "",
        objetivo: "",
        beneficio: "",
        condiciones: [],
        argumentos: [],
        boton: {
          texto: "",
          destino: ""
        },
        estado: "INACTIVA"
      }
    ],

    indicadores: [],

    nuestroNorte: "",

    erroresFrecuentes: [],

    recursos: [
      {
        nombre: "",
        descripcion: "",
        categoria: "",
        icono: "",
        link: ""
      }
    ],

    documentos: [],

    multimedia: {
      videoDirector: "",
      imagenDirector: "",
      audioDelMes: ""
    }
  };
})();
