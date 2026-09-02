(function () {
  "use strict";
  const base = "assets/images/executives/";
  const source = [
    ["alison-aldana", "ALISON ALDANA GARCIA", "Alison", "Aldana", "ALISON ALDANA GARCIA.jpg"],
    ["angie-briceno", "ANGIE STHEFANY BRICEÑO GONZALEZ", "Angie", "Briceño", "ANGIE STHEFANY BRICEÑO GONZALEZ.jpg"],
    ["juliana-rodriguez", "Juliana Carolina Rodriguez Moncaleano", "Juliana", "Rodriguez", "Juliana Carolina Rodriguez Moncaleano.jpg"],
    ["ivette-nieto", "IVETTE TATIANA NIETO ARENAS", "Ivette", "Nieto", "IVETTE TATIANA NIETO ARENAS.jpg"],
    ["jhon-avila", "JHON ALEXANDER AVILA QUIROGA", "Jhon", "Avila", "JHON ALEXANDER AVILA QUIROGA.jpg"],
    ["juan-romero", "JUAN SEBASTIAN ROMERO LONDOÑO", "Juan", "Romero", "JUAN SEBASTIAN ROMERO LONDOÑO.png"],
    ["erick-rocha", "ERICK JOHAN ROCHA BENITEZ", "Erick", "Rocha", "ERICK JOHAN ROCHA BENITEZ.jpg"],
    ["gian-chinome", "GIAN FRANCO CHINOME CALVO", "Gian", "Chinome", "GIAN FRANCO CHINOME CALVO.jpg"],
    ["paola-restrepo", "PAOLA ANDREA RESTREPO TORRES", "Paola", "Restrepo", "PAOLA ANDREA RESTREPO TORRES.jpg"],
    ["german-sierra", "GERMAN ANDRES SIERRA ORTIZ", "German", "Sierra", "GERMAN ANDRES SIERRA ORTIZ.jpg"],
    ["nicolle-murcia", "NICOLLE YURANI MURCIA AVILA", "Nicolle", "Murcia", "NICOLLE YURANI MURCIA AVILA.jpg"],
    ["brigeth-varon", "BRIGETH SAMANTA VARON ORTIZ", "Brigeth", "Varon", "BRIGETH SAMANTA VARON ORTIZ.jpg"],
    ["claudia-gonzalez", "CLAUDIA LILIANA GONZALEZ LOPEZ", "Claudia", "Gonzalez", "CLAUDIA LILIANA GONZALEZ LOPEZ.jpg"],
    ["cristian-garcia", "CRISTIAN JAVIER GARCIA BARRETO", "Cristian", "Garcia", "CRISTIAN JAVIER GARCIA BARRETO.jpg"],
    ["daniel-galindo", "DANIEL ESTEBAN GALINDO FANDIÑO", "Daniel", "Galindo", "DANIEL ESTEBAN GALINDO FANDIÑO.jpg"],
    ["laura-daza", "LAURA SOFIA DAZA ZEA", "Laura", "Daza", "LAURA SOFIA DAZA ZEA.jpg"],
    ["flor-castaneda", "VIVIANA CASTAÑEDA", "VIVIANA", "CASTAÑEDA", "FLOR VIVIANA CASTAÑEDA LOZADA.jpg"]
  ];
  window.SMART_EXPERIENCE_EXECUTIVES = Object.freeze(source.map(([id, fullName, firstName, firstLastName, file]) => Object.freeze({
    id, fullName, firstName, firstLastName, name: firstName, role: "Ejecutivo de Cuenta Smart", photo: base + encodeURIComponent(file), photoAlt: `Fotografía de ${firstName} ${firstLastName}`,
    phrase: "Voy a acompañarte para encontrar la experiencia que mejor se ajuste a lo que quieres lograr."
  })));
})();
