export const guideFlow = [
  {
    "id": "objetivo",
    "question": "¿Qué deseas hacer?",
    "options": [
      {
        "value": "proteger",
        "label": "Proteger una creación propia"
      },
      {
        "value": "usar",
        "label": "Utilizar una creación ajena"
      },
      {
        "value": "registrar",
        "label": "Registrar una obra"
      },
      {
        "value": "entender",
        "label": "Comprender mis derechos"
      }
    ],
    "next": "tipo"
  },
  {
    "id": "tipo",
    "question": "¿De qué tipo de creación se trata?",
    "options": [
      {
        "value": "fotografia",
        "label": "Fotografía"
      },
      {
        "value": "musica",
        "label": "Música"
      },
      {
        "value": "texto",
        "label": "Texto"
      },
      {
        "value": "ilustracion",
        "label": "Ilustración"
      },
      {
        "value": "video",
        "label": "Video"
      },
      {
        "value": "software",
        "label": "Software"
      },
      {
        "value": "otra",
        "label": "Otra creación"
      }
    ],
    "next": "contexto"
  },
  {
    "id": "contexto",
    "question": "Selecciona las condiciones que describen tu caso",
    "options": [
      {
        "value": "es_tuya",
        "label": "La creación es tuya"
      },
      {
        "value": "conoces_titular",
        "label": "Conoces al titular de derechos"
      },
      {
        "value": "hay_licencia",
        "label": "Existe una licencia"
      },
      {
        "value": "quieres_usar",
        "label": "Quiero usarla en un contexto concreto"
      },
      {
        "value": "hay_modificacion",
        "label": "Hay una modificación"
      },
      {
        "value": "quieres_registrar",
        "label": "Quieres registrar la obra"
      }
    ],
    "next": "resultado"
  }
];
export const guideResults = {
  "proteger": {
    "title": "Protección de una creación propia",
    "summary": "Es importante verificar la originalidad, la autoría y la posible necesidad de registro o prueba documental.",
    "concepts": [
      "Obras protegidas",
      "Autoría y titularidad",
      "Registro de obras"
    ],
    "example": "Una fotografía original puede estar protegida desde la creación y puede facilitarse la prueba con evidencias y registro.",
    "steps": [
      "Revisa la originalidad.",
      "Documenta la creación.",
      "Consulta fuentes y posibles registros."
    ]
  },
  "usar": {
    "title": "Uso de una creación ajena",
    "summary": "Debe revisarse si existe licencia, autorización, cita o una excepción aplicable, junto con la finalidad del uso.",
    "concepts": [
      "Derechos patrimoniales",
      "Límites y excepciones",
      "Licencias"
    ],
    "example": "Usar una imagen en una campaña comercial exige analizar permisos y atribución, no solo la disponibilidad en Internet.",
    "steps": [
      "Verifica la licencia.",
      "Revisa la finalidad del uso.",
      "Consulta la atribución y la autorización."
    ]
  },
  "registrar": {
    "title": "Registro de una obra",
    "summary": "El registro es una herramienta útil de prueba, pero la protección no depende únicamente de él.",
    "concepts": [
      "Registro de obras",
      "Obras protegidas",
      "Prueba"
    ],
    "example": "Un escritor puede registrar su texto para reforzar la evidencia, pero la protección ya nace con la creación.",
    "steps": [
      "Documenta la obra.",
      "Consulta el procedimiento oficial.",
      "Usa el registro como prueba y no como único criterio."
    ]
  },
  "entender": {
    "title": "Comprender mis derechos",
    "summary": "Las dudas jurídicas suelen resolverse con educación, revisión de fuentes y un análisis contextual.",
    "concepts": [
      "Derechos morales",
      "Derechos patrimoniales",
      "Fuentes oficiales"
    ],
    "example": "Conocer sus derechos morales y patrimoniales ayuda a entender mejor la protección y el uso de obras ajenas.",
    "steps": [
      "Explora los módulos.",
      "Revisa la guía de casos.",
      "Consulta las fuentes oficiales."
    ]
  }
};
