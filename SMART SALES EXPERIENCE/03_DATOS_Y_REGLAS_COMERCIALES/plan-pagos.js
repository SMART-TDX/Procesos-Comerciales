(function () {
  "use strict";

  function fechaDesdeIso(valor) {
    const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor || "");
    if (!partes) return null;
    const fecha = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
    return fecha.getFullYear() === Number(partes[1]) && fecha.getMonth() === Number(partes[2]) - 1 && fecha.getDate() === Number(partes[3]) ? fecha : null;
  }

  function fechaIso(fecha) {
    return [fecha.getFullYear(), String(fecha.getMonth() + 1).padStart(2, "0"), String(fecha.getDate()).padStart(2, "0")].join("-");
  }

  function sumarDias(valor, dias) {
    const fecha = fechaDesdeIso(valor);
    if (!fecha) return "";
    fecha.setDate(fecha.getDate() + dias);
    return fechaIso(fecha);
  }

  function diferenciaDias(desde, hasta) {
    const a = fechaDesdeIso(desde);
    const b = fechaDesdeIso(hasta);
    if (!a || !b) return NaN;
    return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
  }

  function fechaMensual(segundaFecha, desplazamiento) {
    const base = fechaDesdeIso(segundaFecha);
    if (!base) return "";
    const diaObjetivo = base.getDate();
    const primerDia = new Date(base.getFullYear(), base.getMonth() + desplazamiento, 1);
    const ultimoDia = new Date(primerDia.getFullYear(), primerDia.getMonth() + 1, 0).getDate();
    return fechaIso(new Date(primerDia.getFullYear(), primerDia.getMonth(), Math.min(diaObjetivo, ultimoDia)));
  }

  function aCentavos(valor) {
    return Math.round((Number(valor) + Number.EPSILON) * 100);
  }

  function validarPrimeraCuota(valor, minimo, total) {
    if (!Number.isFinite(valor) || Math.abs(aCentavos(valor) - valor * 100) > 0.000001) return "Ingresa un valor válido con máximo dos decimales.";
    if (valor < minimo) return "La primera cuota no puede ser inferior al mínimo oficial.";
    if (valor > total) return "La primera cuota no puede superar el valor total oficial.";
    return "";
  }

  function validarSegundaFecha(primeraFecha, segundaFecha) {
    const diferencia = diferenciaDias(primeraFecha, segundaFecha);
    if (!Number.isFinite(diferencia)) return "Selecciona una fecha de segunda cuota válida.";
    if (diferencia < 30 || diferencia > 40) return "La segunda cuota debe estar entre 30 y 40 días calendario después del primer pago.";
    return "";
  }

  function generarPlanPagos(total, primeraCuota, numeroCuotas, primeraFecha, segundaFecha) {
    if (![total, primeraCuota].every(Number.isFinite) || !Number.isInteger(numeroCuotas) || total < 0 || numeroCuotas < 1) {
      throw new Error("Los valores del plan de pagos no son válidos.");
    }
    const errorPrimera = validarPrimeraCuota(primeraCuota, 0, total);
    if (errorPrimera || !fechaDesdeIso(primeraFecha)) throw new Error(errorPrimera || "Fecha del primer pago inválida.");

    const totalCentavos = aCentavos(total), primeraCentavos = aCentavos(primeraCuota);
    const pagos = [{ numero: 1, fecha: primeraFecha, valor: primeraCentavos / 100, tipo: primeraCentavos === totalCentavos ? "Pago total" : "Pago inicial" }];
    if (primeraCentavos === totalCentavos || numeroCuotas === 1) return pagos;
    const errorFecha = validarSegundaFecha(primeraFecha, segundaFecha);
    if (errorFecha) throw new Error(errorFecha);

    const pendientes = numeroCuotas - 1;
    const saldoCentavos = totalCentavos - primeraCentavos;
    const cuotaBasePesos = Math.floor(saldoCentavos / (pendientes * 100));
    const cuotaBaseCentavos = cuotaBasePesos * 100;
    for (let indice = 0; indice < pendientes; indice += 1) {
      const esUltima = indice === pendientes - 1;
      pagos.push({
        numero: indice + 2,
        fecha: fechaMensual(segundaFecha, indice),
        valor: (esUltima ? saldoCentavos - cuotaBaseCentavos * (pendientes - 1) : cuotaBaseCentavos) / 100,
        tipo: esUltima && (saldoCentavos - cuotaBaseCentavos * pendientes !== 0) ? "Cuota final — ajuste de cierre" : esUltima ? "Cuota final" : "Cuota mensual"
      });
    }
    return pagos;
  }

  window.SmartPlanPagos = Object.freeze({ aCentavos, fechaDesdeIso, fechaIso, sumarDias, diferenciaDias, fechaMensual, validarPrimeraCuota, validarSegundaFecha, generarPlanPagos });
})();
