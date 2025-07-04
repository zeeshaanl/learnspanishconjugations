// Verb database with conjugations
export const verbs = {
  regular: {
    hablar: {
      type: '-ar',
      presente: { yo: 'hablo', tú: 'hablas', 'él/ella': 'habla', nosotros: 'hablamos', vosotros: 'habláis', 'ellos/ellas': 'hablan' },
      pretérito: { yo: 'hablé', tú: 'hablaste', 'él/ella': 'habló', nosotros: 'hablamos', vosotros: 'hablasteis', 'ellos/ellas': 'hablaron' },
      imperfecto: { yo: 'hablaba', tú: 'hablabas', 'él/ella': 'hablaba', nosotros: 'hablábamos', vosotros: 'hablabais', 'ellos/ellas': 'hablaban' },
      futuro: { yo: 'hablaré', tú: 'hablarás', 'él/ella': 'hablará', nosotros: 'hablaremos', vosotros: 'hablaréis', 'ellos/ellas': 'hablarán' }
    },
    comer: {
      type: '-er',
      presente: { yo: 'como', tú: 'comes', 'él/ella': 'come', nosotros: 'comemos', vosotros: 'coméis', 'ellos/ellas': 'comen' },
      pretérito: { yo: 'comí', tú: 'comiste', 'él/ella': 'comió', nosotros: 'comimos', vosotros: 'comisteis', 'ellos/ellas': 'comieron' },
      imperfecto: { yo: 'comía', tú: 'comías', 'él/ella': 'comía', nosotros: 'comíamos', vosotros: 'comíais', 'ellos/ellas': 'comían' },
      futuro: { yo: 'comeré', tú: 'comerás', 'él/ella': 'comerá', nosotros: 'comeremos', vosotros: 'comeréis', 'ellos/ellas': 'comerán' }
    },
    vivir: {
      type: '-ir',
      presente: { yo: 'vivo', tú: 'vives', 'él/ella': 'vive', nosotros: 'vivimos', vosotros: 'vivís', 'ellos/ellas': 'viven' },
      pretérito: { yo: 'viví', tú: 'viviste', 'él/ella': 'vivió', nosotros: 'vivimos', vosotros: 'vivisteis', 'ellos/ellas': 'vivieron' },
      imperfecto: { yo: 'vivía', tú: 'vivías', 'él/ella': 'vivía', nosotros: 'vivíamos', vosotros: 'vivíais', 'ellos/ellas': 'vivían' },
      futuro: { yo: 'viviré', tú: 'vivirás', 'él/ella': 'vivirá', nosotros: 'viviremos', vosotros: 'viviréis', 'ellos/ellas': 'vivirán' }
    },
    llegar: {
      type: '-ar',
      presente: { yo: 'llego', tú: 'llegas', 'él/ella': 'llega', nosotros: 'llegamos', vosotros: 'llegáis', 'ellos/ellas': 'llegan' },
      pretérito: { yo: 'llegué', tú: 'llegaste', 'él/ella': 'llegó', nosotros: 'llegamos', vosotros: 'llegasteis', 'ellos/ellas': 'llegaron' },
      imperfecto: { yo: 'llegaba', tú: 'llegabas', 'él/ella': 'llegaba', nosotros: 'llegábamos', vosotros: 'llegabais', 'ellos/ellas': 'llegaban' },
      futuro: { yo: 'llegaré', tú: 'llegarás', 'él/ella': 'llegará', nosotros: 'llegaremos', vosotros: 'llegaréis', 'ellos/ellas': 'llegarán' }
    },
    pasar: {
      type: '-ar',
      presente: { yo: 'paso', tú: 'pasas', 'él/ella': 'pasa', nosotros: 'pasamos', vosotros: 'pasáis', 'ellos/ellas': 'pasan' },
      pretérito: { yo: 'pasé', tú: 'pasaste', 'él/ella': 'pasó', nosotros: 'pasamos', vosotros: 'pasasteis', 'ellos/ellas': 'pasaron' },
      imperfecto: { yo: 'pasaba', tú: 'pasabas', 'él/ella': 'pasaba', nosotros: 'pasábamos', vosotros: 'pasabais', 'ellos/ellas': 'pasaban' },
      futuro: { yo: 'pasaré', tú: 'pasarás', 'él/ella': 'pasará', nosotros: 'pasaremos', vosotros: 'pasaréis', 'ellos/ellas': 'pasarán' }
    }
  },
  irregular: {
    ser: {
      type: 'irregular',
      presente: { yo: 'soy', tú: 'eres', 'él/ella': 'es', nosotros: 'somos', vosotros: 'sois', 'ellos/ellas': 'son' },
      pretérito: { yo: 'fui', tú: 'fuiste', 'él/ella': 'fue', nosotros: 'fuimos', vosotros: 'fuisteis', 'ellos/ellas': 'fueron' },
      imperfecto: { yo: 'era', tú: 'eras', 'él/ella': 'era', nosotros: 'éramos', vosotros: 'erais', 'ellos/ellas': 'eran' },
      futuro: { yo: 'seré', tú: 'serás', 'él/ella': 'será', nosotros: 'seremos', vosotros: 'seréis', 'ellos/ellas': 'serán' }
    },
    estar: {
      type: 'irregular',
      presente: { yo: 'estoy', tú: 'estás', 'él/ella': 'está', nosotros: 'estamos', vosotros: 'estáis', 'ellos/ellas': 'están' },
      pretérito: { yo: 'estuve', tú: 'estuviste', 'él/ella': 'estuvo', nosotros: 'estuvimos', vosotros: 'estuvisteis', 'ellos/ellas': 'estuvieron' },
      imperfecto: { yo: 'estaba', tú: 'estabas', 'él/ella': 'estaba', nosotros: 'estábamos', vosotros: 'estabais', 'ellos/ellas': 'estaban' },
      futuro: { yo: 'estaré', tú: 'estarás', 'él/ella': 'estará', nosotros: 'estaremos', vosotros: 'estaréis', 'ellos/ellas': 'estarán' }
    },
    tener: {
      type: 'irregular',
      presente: { yo: 'tengo', tú: 'tienes', 'él/ella': 'tiene', nosotros: 'tenemos', vosotros: 'tenéis', 'ellos/ellas': 'tienen' },
      pretérito: { yo: 'tuve', tú: 'tuviste', 'él/ella': 'tuvo', nosotros: 'tuvimos', vosotros: 'tuvisteis', 'ellos/ellas': 'tuvieron' },
      imperfecto: { yo: 'tenía', tú: 'tenías', 'él/ella': 'tenía', nosotros: 'teníamos', vosotros: 'teníais', 'ellos/ellas': 'tenían' },
      futuro: { yo: 'tendré', tú: 'tendrás', 'él/ella': 'tendrá', nosotros: 'tendremos', vosotros: 'tendréis', 'ellos/ellas': 'tendrán' }
    },
    hacer: {
      type: 'irregular',
      presente: { yo: 'hago', tú: 'haces', 'él/ella': 'hace', nosotros: 'hacemos', vosotros: 'hacéis', 'ellos/ellas': 'hacen' },
      pretérito: { yo: 'hice', tú: 'hiciste', 'él/ella': 'hizo', nosotros: 'hicimos', vosotros: 'hicisteis', 'ellos/ellas': 'hicieron' },
      imperfecto: { yo: 'hacía', tú: 'hacías', 'él/ella': 'hacía', nosotros: 'hacíamos', vosotros: 'hacíais', 'ellos/ellas': 'hacían' },
      futuro: { yo: 'haré', tú: 'harás', 'él/ella': 'hará', nosotros: 'haremos', vosotros: 'haréis', 'ellos/ellas': 'harán' }
    },
    ir: {
      type: 'irregular',
      presente: { yo: 'voy', tú: 'vas', 'él/ella': 'va', nosotros: 'vamos', vosotros: 'vais', 'ellos/ellas': 'van' },
      pretérito: { yo: 'fui', tú: 'fuiste', 'él/ella': 'fue', nosotros: 'fuimos', vosotros: 'fuisteis', 'ellos/ellas': 'fueron' },
      imperfecto: { yo: 'iba', tú: 'ibas', 'él/ella': 'iba', nosotros: 'íbamos', vosotros: 'ibais', 'ellos/ellas': 'iban' },
      futuro: { yo: 'iré', tú: 'irás', 'él/ella': 'irá', nosotros: 'iremos', vosotros: 'iréis', 'ellos/ellas': 'irán' }
    },
    poder: {
      type: 'irregular',
      presente: { yo: 'puedo', tú: 'puedes', 'él/ella': 'puede', nosotros: 'podemos', vosotros: 'podéis', 'ellos/ellas': 'pueden' },
      pretérito: { yo: 'pude', tú: 'pudiste', 'él/ella': 'pudo', nosotros: 'pudimos', vosotros: 'pudisteis', 'ellos/ellas': 'pudieron' },
      imperfecto: { yo: 'podía', tú: 'podías', 'él/ella': 'podía', nosotros: 'podíamos', vosotros: 'podíais', 'ellos/ellas': 'podían' },
      futuro: { yo: 'podré', tú: 'podrás', 'él/ella': 'podrá', nosotros: 'podremos', vosotros: 'podréis', 'ellos/ellas': 'podrán' }
    },
    decir: {
      type: 'irregular',
      presente: { yo: 'digo', tú: 'dices', 'él/ella': 'dice', nosotros: 'decimos', vosotros: 'decís', 'ellos/ellas': 'dicen' },
      pretérito: { yo: 'dije', tú: 'dijiste', 'él/ella': 'dijo', nosotros: 'dijimos', vosotros: 'dijisteis', 'ellos/ellas': 'dijeron' },
      imperfecto: { yo: 'decía', tú: 'decías', 'él/ella': 'decía', nosotros: 'decíamos', vosotros: 'decíais', 'ellos/ellas': 'decían' },
      futuro: { yo: 'diré', tú: 'dirás', 'él/ella': 'dirá', nosotros: 'diremos', vosotros: 'diréis', 'ellos/ellas': 'dirán' }
    },
    dar: {
      type: 'irregular',
      presente: { yo: 'doy', tú: 'das', 'él/ella': 'da', nosotros: 'damos', vosotros: 'dais', 'ellos/ellas': 'dan' },
      pretérito: { yo: 'di', tú: 'diste', 'él/ella': 'dio', nosotros: 'dimos', vosotros: 'disteis', 'ellos/ellas': 'dieron' },
      imperfecto: { yo: 'daba', tú: 'dabas', 'él/ella': 'daba', nosotros: 'dábamos', vosotros: 'dabais', 'ellos/ellas': 'daban' },
      futuro: { yo: 'daré', tú: 'darás', 'él/ella': 'dará', nosotros: 'daremos', vosotros: 'daréis', 'ellos/ellas': 'darán' }
    },
    poner: {
      type: 'irregular',
      presente: { yo: 'pongo', tú: 'pones', 'él/ella': 'pone', nosotros: 'ponemos', vosotros: 'ponéis', 'ellos/ellas': 'ponen' },
      pretérito: { yo: 'puse', tú: 'pusiste', 'él/ella': 'puso', nosotros: 'pusimos', vosotros: 'pusisteis', 'ellos/ellas': 'pusieron' },
      imperfecto: { yo: 'ponía', tú: 'ponías', 'él/ella': 'ponía', nosotros: 'poníamos', vosotros: 'poníais', 'ellos/ellas': 'ponían' },
      futuro: { yo: 'pondré', tú: 'pondrás', 'él/ella': 'pondrá', nosotros: 'pondremos', vosotros: 'pondréis', 'ellos/ellas': 'pondrán' }
    },
    ver: {
      type: 'irregular',
      presente: { yo: 'veo', tú: 'ves', 'él/ella': 've', nosotros: 'vemos', vosotros: 'veis', 'ellos/ellas': 'ven' },
      pretérito: { yo: 'vi', tú: 'viste', 'él/ella': 'vio', nosotros: 'vimos', vosotros: 'visteis', 'ellos/ellas': 'vieron' },
      imperfecto: { yo: 'veía', tú: 'veías', 'él/ella': 'veía', nosotros: 'veíamos', vosotros: 'veíais', 'ellos/ellas': 'veían' },
      futuro: { yo: 'veré', tú: 'verás', 'él/ella': 'verá', nosotros: 'veremos', vosotros: 'veréis', 'ellos/ellas': 'verán' }
    },
    saber: {
      type: 'irregular',
      presente: { yo: 'sé', tú: 'sabes', 'él/ella': 'sabe', nosotros: 'sabemos', vosotros: 'sabéis', 'ellos/ellas': 'saben' },
      pretérito: { yo: 'supe', tú: 'supiste', 'él/ella': 'supo', nosotros: 'supimos', vosotros: 'supisteis', 'ellos/ellas': 'supieron' },
      imperfecto: { yo: 'sabía', tú: 'sabías', 'él/ella': 'sabía', nosotros: 'sabíamos', vosotros: 'sabíais', 'ellos/ellas': 'sabían' },
      futuro: { yo: 'sabré', tú: 'sabrás', 'él/ella': 'sabrá', nosotros: 'sabremos', vosotros: 'sabréis', 'ellos/ellas': 'sabrán' }
    },
    querer: {
      type: 'irregular',
      presente: { yo: 'quiero', tú: 'quieres', 'él/ella': 'quiere', nosotros: 'queremos', vosotros: 'queréis', 'ellos/ellas': 'quieren' },
      pretérito: { yo: 'quise', tú: 'quisiste', 'él/ella': 'quiso', nosotros: 'quisimos', vosotros: 'quisisteis', 'ellos/ellas': 'quisieron' },
      imperfecto: { yo: 'quería', tú: 'querías', 'él/ella': 'quería', nosotros: 'queríamos', vosotros: 'queríais', 'ellos/ellas': 'querían' },
      futuro: { yo: 'querré', tú: 'querrás', 'él/ella': 'querrá', nosotros: 'querremos', vosotros: 'querréis', 'ellos/ellas': 'querrán' }
    },
    venir: {
      type: 'irregular',
      presente: { yo: 'vengo', tú: 'vienes', 'él/ella': 'viene', nosotros: 'venimos', vosotros: 'venís', 'ellos/ellas': 'vienen' },
      pretérito: { yo: 'vine', tú: 'viniste', 'él/ella': 'vino', nosotros: 'vinimos', vosotros: 'vinisteis', 'ellos/ellas': 'vinieron' },
      imperfecto: { yo: 'venía', tú: 'venías', 'él/ella': 'venía', nosotros: 'veníamos', vosotros: 'veníais', 'ellos/ellas': 'venían' },
      futuro: { yo: 'vendré', tú: 'vendrás', 'él/ella': 'vendrá', nosotros: 'vendremos', vosotros: 'vendréis', 'ellos/ellas': 'vendrán' }
    }
  }
};

export const tenseNames = {
  presente: 'Present',
  pretérito: 'Preterite',
  imperfecto: 'Imperfect',
  futuro: 'Future'
};

export const persons = ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas']; 