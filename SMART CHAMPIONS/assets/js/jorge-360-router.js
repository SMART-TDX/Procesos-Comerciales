(function (global) {
  'use strict';
  const normalize = (value) => global.JorgeKnowledgeBankCore.normalize(value);
  const RULES = [
    { domain:'COMPLIANCE', priority:1000, pattern:/no (me )?(vuelvan|llamen)|no quiero.*llamad|no quiere.*contact|no contactar|no autoriz|elimin.*dato|borr.*dato|nunca (deje|di).*dato|de donde.*dato|molest|privacidad/ },
    { domain:'TMK_PROCESSES', priority:800, pattern:/que hago|sac|servicio al cliente|ya es estudiante|reprogram|seguimiento|contrato|beneficiario|proceso|cofae|actualizacion de costos|atencion al cliente|ruta administrativa|caso especial/ },
    { domain:'INTERNATIONAL_EXAMS', priority:700, pattern:/\bb2\b|certific|universidad|gradu|ielts|toefl|linguaskill|\bmet\b|examen|visa|migracion|puntaje/ },
    { domain:'COMMERCIAL_TMK', priority:690, pattern:/menor|\b1[5-7] anos|desemple|sin empleo|hibrid|mitad virtual|mas adelante|no tiene tiempo|no tiene plata|tampoco tiene plata|muy caro/ },
    { domain:'COMMERCIAL_TMK', priority:680, pattern:/no quiere desplaz|lejos.*no quiere|otra academia.*barat/ },
    { domain:'LOCATIONS_SMART', priority:650, pattern:/vive|trabaja en|sede|ubicacion|direccion|barrio|localidad|suba|chapinero|cerca|lejos|desplaz/ },
    { domain:'PRODUCTS_SMART', priority:600, pattern:/online|flex|instituto|producto|modalidad|presencial|virtual|idioma|ingles|frances|metodologia|diferencia/ },
    { domain:'COMMERCIAL_TMK', priority:550, pattern:/no (tengo|tiene|puede)|tampoco tiene plata|menor|\b1[5-7] años|desemple|sin empleo|hibrid|mitad virtual|mas adelante|adelante|quiero esperar|otro mes|precio|caro|barat|cobra menos|cuesta menos|pensar|tiempo|horario|sabado|domingo|fin de semana|otra academia|compar|no (le )?interesa|consultar|pareja|trabaj|objec|quiero estudiar|quiere aprender|si quiere|duda|cotiz|descuento|ocupad|agenda|mala experiencia|confia|alcanza|no sabe/ },
    { domain:'INSTITUTIONAL_SMART', priority:400, pattern:/smart|diferencia|beneficio|caracteristica|institucion|metodologia/ }
  ];
  function route(text, memory) {
    const normalized = normalize(text);
    const hits = RULES.filter((rule) => rule.pattern.test(normalized)).sort((a,b)=>b.priority-a.priority);
    let domains = Array.from(new Set(hits.map((hit)=>hit.domain)));
    if (!domains.length) domains=['INSTITUTIONAL_SMART'];
    if (domains.includes('COMPLIANCE')) domains=['COMPLIANCE'].concat(domains.filter((domain)=>domain!=='COMPLIANCE'));
    return { principal:domains[0], secundarios:domains.slice(1), dominios:domains, tipoNecesidad:domains[0], textoNormalizado:normalized, memoriaDisponible:Boolean(memory && memory.turnos && memory.turnos.length) };
  }
  global.JORGE_360_ROUTER=Object.freeze({route,RULES});
})(typeof window!=='undefined'?window:globalThis);
