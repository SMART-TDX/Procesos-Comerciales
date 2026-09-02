(function () {
  "use strict";

  const cityCenters = Object.freeze({
    "Bogotá": [-74.0721, 4.7110], "Soacha": [-74.2168, 4.5794], "Chía": [-74.0537, 4.8588],
    "Mosquera": [-74.2302, 4.7059], "Cajicá": [-74.0275, 4.9186], "Medellín": [-75.5812, 6.2442],
    "Bello": [-75.5678, 6.3373], "Envigado": [-75.5867, 6.1706], "Sabaneta": [-75.6166, 6.1515],
    "Itagüí": [-75.6114, 6.1846], "Rionegro": [-75.3749, 6.1532], "Floridablanca": [-73.0864, 7.0622],
    "Bucaramanga": [-73.1198, 7.1254], "Piedecuesta": [-73.0495, 6.9879], "Manizales": [-75.5138, 5.0703],
    "Pereira": [-75.6946, 4.8087], "Armenia": [-75.6811, 4.5339], "Ibagué": [-75.2322, 4.4389],
    "Sincelejo": [-75.3978, 9.3047], "Villavicencio": [-73.6266, 4.1420], "Cali": [-76.5319, 3.4516],
    "Barranquilla / Soledad": [-74.7646, 10.9170]
  });

  // [city, name, address, zone, sourceRow, requiresValidation]
  const inventory = [
    ["Medellín","Olaya","C.C. De Moda Outlet, Calle 16 #55-129, piso 3","Norte",18],
    ["Bello","Tierragro","Diagonal 50A #38-20, Centro Empresarial Tierragro, local 801","Norte",19],
    ["Bello","Bello","C.C. Estación Niquía, Diagonal 55 #37-41","Norte",20],
    ["Medellín","Calasanz","Carrera 80 #49A-98","Occidente",22],
    ["Medellín","Laureles","Transversal 39B #3-6","Occidente",23],
    ["Medellín","Centro Medellín Sede B","C.C. El Punto de la Oriental, Carrera 46 #47-66, local 4035","Centro",25],
    ["Medellín","La Central","C.C. La Central, Calle 49B #21-38, local 420A","Centro",26],
    ["Medellín","Arkadia","Carrera 70 #1-141, piso 5","Sur",28],
    ["Medellín","Mall Gran Vía","Diagonal 75B #5-106, local 106","Sur",29],
    ["Medellín","Santafé Medellín","C.C. Santafé, Carrera 43A, Calle 7 Sur #170, piso 4","Sur",30],
    ["Envigado","Envigado","Carrera 43 #31 Sur-12","Sur",31],
    ["Sabaneta","Mayorca","Calle 52 Sur #44-45","Sur",32,true],
    ["Itagüí","Itagüí","C.C. Plaza Arrayanes, Carrera 50A #36-90, local 401","Sur",33],
    ["Itagüí","Itagüí sede B","C.C. Plaza Arrayanes, Carrera 50A #36-90, locales 314 a 321","Sur",34],
    ["Medellín","Castropol","Carrera 43A #14-80","Sur",35],
    ["Rionegro","Rionegro","Calle 41 #50BB-65, Mall Plaza de Riogrande, locales 118-119","Oriente",37],
    ["Floridablanca","Floridablanca La Florida","C.C. La Florida, Calle 31 #26A-19, locales 108-110","Santander",39,true],
    ["Floridablanca","Floridablanca Restrepo","Calle 41 #5-40, barrio Restrepo","Santander",40,true],
    ["Bucaramanga","Cabecera","Carrera 33 #36-40","Santander",41,true],
    ["Piedecuesta","Piedecuesta","C.C. Delacuesta, Carrera 15 #3AN-10, local 215","Santander",42],
    ["Manizales","Manizales","C.C. Fundadores, Calle 33B #20-03, piso 3","Eje Cafetero",44],
    ["Pereira","Pereira","Avenida 30 de Agosto #74-09","Eje Cafetero",45],
    ["Armenia","Armenia",null,"Eje Cafetero",46,true],
    ["Ibagué","Ibagué","Calle 42 #5-40, barrio Restrepo","Regionales",48],
    ["Sincelejo","Sincelejo","Calle 28 #25B-365, Parque Comercial Guacarí","Regionales",49],
    ["Villavicencio","Villavicencio","C.C. Unicentro, Avenida 40 #26C-10, local 301","Regionales",50],
    ["Cali","Cali","C.C. Cosmocentro, Calle 5 #50-103, piso 4","Regionales",51],
    ["Barranquilla / Soledad","Barranquilla","C.C. Carnaval, Calle 30 Autopista Aeropuerto #13-65, Soledad","Regionales",52,true],
    ["Bogotá","Restrepo","Avenida Caracas #17-22 Sur","Sur",54],
    ["Bogotá","Madelena A","C.C. Gran Plaza El Ensueño, Calle 59C Sur #51-21","Sur",55],
    ["Bogotá","Kennedy","Transversal 78H #41-73 Sur","Sur",56],
    ["Bogotá","Madelena B","C.C. Gran Plaza El Ensueño, Calle 59C Sur #51-21","Sur",57],
    ["Bogotá","Bosa","Calle 65 Sur #78L-43","Sur",58],
    ["Bogotá","Plaza de las Américas","C.C. Plaza de las Américas, Carrera 71D #6-94 Sur","Sur",59],
    ["Bogotá","Centro Mayor","Transversal 35 #38B Sur-69","Sur",60],
    ["Bogotá","Villa del Río","C.C. Paseo Villa del Río, Diagonal 57C Sur #62-60","Sur",61],
    ["Bogotá","Tunal","C.C. Ciudad Tunal, Calle 47B Sur #24B-33","Sur",62],
    ["Soacha","Soacha","C.C. Gran Plaza Soacha, Carrera 7 #30B-139","Sur",63],
    ["Soacha","Soacha sede B","C.C. Gran Plaza Soacha, Carrera 7 #30B-139","Sur",64],
    ["Bogotá","Unicentro de Occidente","C.C. Unicentro de Occidente, Carrera 111C #86-05","Occidente",66],
    ["Bogotá","Unicentro de Occidente B","C.C. Unicentro de Occidente, Carrera 111C #86-05","Occidente",67],
    ["Bogotá","Suba","C.C. Fiesta Suba, Calle 147 #101-56","Suba",69],
    ["Bogotá","Suba Alpaso","Calle 145 con Avenida Ciudad de Cali","Suba",70],
    ["Bogotá","Suba sede B","C.C. Fiesta Suba, Calle 147 #101-56","Suba",71],
    ["Bogotá","Hayuelos","C.C. Hayuelos, Calle 20 #82-52","Suba",72],
    ["Bogotá","Plaza Central","Calle 13 con Carrera 62, piso 3","Central",74],
    ["Bogotá","Nuestro Bogotá","C.C. Nuestro Bogotá, Carrera 86 #52A-75","Central",75],
    ["Bogotá","Modelia","Carrera 74A #23F-04","Central",76],
    ["Bogotá","Multiplaza","Avenida Boyacá con Calle 13, local B-114","Central",77],
    ["Bogotá","Chapinero","Avenida Calle 63 #9-68","Central",78],
    ["Chía","Chía","C.C. La Libertad, Calle 10 #11-36","Central",79],
    ["Bogotá","Mall Plaza Calima","Avenida Carrera 30 #19, local B04","Central",80],
    ["Bogotá","San Martín","C.C. San Martín, Carrera 7 #32-84","Central",81],
    ["Bogotá","Fontibón","Carrera 100 #18-37","Central",82],
    ["Bogotá","Palatino","C.C. Palatino, Carrera 7 #138-33","Norte",84],
    ["Bogotá","Multidrive","Calle 153 #59-15","Norte",85],
    ["Bogotá","Santafé","C.C. Santafé, Calle 185 #45-03","Norte",86],
    ["Mosquera","Mosquera","C.C. Novaterra, Carrera 3A #17 Sur-96","Cundinamarca",88],
    ["Cajicá","Cajicá","Carrera 6 #1-16","Cundinamarca",89],
    ["Cajicá","Fontanar","C.C. Fontanar, vía Chía km 2.5, local 3-05","Cundinamarca",90]
  ];

  const locations = inventory.map(([city, name, address, zone, sourceRow, requiresValidation = false], index) => Object.freeze({
    id: `smart-co-${String(index + 1).padStart(3, "0")}`,
    country: "Colombia",
    city,
    name,
    address,
    zone,
    latitude: null,
    longitude: null,
    cityLatitude: cityCenters[city][1],
    cityLongitude: cityCenters[city][0],
    image: null,
    status: "active",
    requiresValidation,
    source: Object.freeze({ file: "SEDES SMART ORGANIZADAS.xlsx", sheet: "Hoja1", row: sourceRow })
  }));

  window.SMART_EXPERIENCE_SMART_LOCATIONS = Object.freeze({
    version: "2026-08-21",
    sourceStatus: "INVENTARIO_FISICO_CLASIFICADO_CON_VALIDACIONES_PENDIENTES",
    coordinatePolicy: "Las coordenadas de sede permanecen nulas; los marcadores nacionales usan centroides de ciudad.",
    locations: Object.freeze(locations),
    international: Object.freeze([
      Object.freeze({ country: "Colombia", status: "consolidated", label: "PRESENCIA CONSOLIDADA" }),
      Object.freeze({ country: "Perú", status: "expanding", label: "EN EXPANSIÓN" }),
      Object.freeze({ country: "Estados Unidos", status: "expanding", label: "EN EXPANSIÓN" })
    ])
  });
})();
