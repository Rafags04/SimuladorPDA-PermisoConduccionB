(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const Je="modulepreload",Ye=function(e,a){return new URL(e,a).href},ye={},Ze=function(a,n,i){let o=Promise.resolve();if(n&&n.length>0){let h=function(b){return Promise.all(b.map(v=>Promise.resolve(v).then(k=>({status:"fulfilled",value:k}),k=>({status:"rejected",reason:k}))))};const l=document.getElementsByTagName("link"),d=document.querySelector("meta[property=csp-nonce]"),f=d?.nonce||d?.getAttribute("nonce");o=h(n.map(b=>{if(b=Ye(b,i),b in ye)return;ye[b]=!0;const v=b.endsWith(".css"),k=v?'[rel="stylesheet"]':"";if(i)for(let C=l.length-1;C>=0;C--){const y=l[C];if(y.href===b&&(!v||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${b}"]${k}`))return;const z=document.createElement("link");if(z.rel=v?"stylesheet":Je,v||(z.as="script"),z.crossOrigin="",z.href=b,f&&z.setAttribute("nonce",f),document.head.appendChild(z),v)return new Promise((C,y)=>{z.addEventListener("load",C),z.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${b}`)))})}))}function r(l){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=l,window.dispatchEvent(d),!d.defaultPrevented)throw l}return o.then(l=>{for(const d of l||[])d.status==="rejected"&&r(d.reason);return a().catch(r)})},W=JSON.parse('[{"id":1,"bloque":"1. Comprobaciones previas","tipo":"L","nivel":"Leve","falta":"No comprobar correctamente el estado general del vehículo","obs":"Mandos, neumáticos, luces, niveles, claxon, batería, capó, chaleco, preseñalización y documentación. Se califica con una sola falta leve.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":2,"bloque":"2. Instalación","tipo":"L","nivel":"Leve","falta":"No adoptar la postura correcta","obs":"Asiento y posición de conducción antes de iniciar la prueba.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":3,"bloque":"2. Instalación","tipo":"L","nivel":"Leve","falta":"No regular correctamente los espejos retrovisores","obs":"Debe hacerse antes de iniciar la marcha.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":4,"bloque":"2. Instalación","tipo":"L","nivel":"Leve","falta":"No utilizar el cinturón de seguridad","obs":"Una vez calificado, se indica que lo coloque.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":5,"bloque":"2. Instalación","tipo":"L","nivel":"Leve","falta":"No ajustarse correctamente el cinturón de seguridad","obs":"Cinturón mal colocado o sin ajustar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":6,"bloque":"3. Incorporación","tipo":"D","nivel":"Deficiente","falta":"Realizar la incorporación obstaculizando a los demás usuarios","obs":"La falta sube de nivel cuando obliga a otros a modificar su marcha.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":7,"bloque":"3. Incorporación","tipo":"D","nivel":"Deficiente","falta":"Recorrer marcha atrás más de 15 m o invadir un cruce para incorporarse, obstaculizando","obs":"Si además se obstaculiza, pasa a deficiente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":8,"bloque":"3. Incorporación","tipo":"D","nivel":"Deficiente","falta":"Utilizar inadecuadamente el carril de aceleración, obstaculizando","obs":"No ajustarse a la velocidad o entrada al carril.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":9,"bloque":"3. Incorporación","tipo":"D","nivel":"Deficiente","falta":"Incorporarse invadiendo sin necesidad el arcén, sentido contrario o carriles contiguos","obs":"Por mala trayectoria o mala elección del espacio.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":10,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"No observar el tráfico delante, detrás y/o lateralmente","obs":"Mirar antes de iniciar la marcha.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":11,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Omitir la señal reglamentaria","obs":"No usar intermitente cuando procede.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":12,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Señalizar al contrario","obs":"Indicar el lado incorrecto.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":13,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Señalizar sin suficiente antelación","obs":"Intermitente tardío.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":14,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"No extinguir la señal una vez finalizada la maniobra","obs":"Dejar el intermitente puesto más de lo necesario.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":15,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Realizar la incorporación de forma no gradual","obs":"Entrada brusca o poco progresiva.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":16,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Demorar la incorporación evidenciando inseguridad","obs":"Cuando las condiciones de distancia y velocidad son idóneas.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":17,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Realizar más movimientos de los necesarios","obs":"Según el espacio disponible.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":18,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Incorporarse con velocidad inadecuada","obs":"Por exceso o defecto, según la situación.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":19,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Forzar o golpear fuertemente el bordillo sin llegar a subirlo","obs":"Si se sube al bordillo puede ser más grave según circunstancias.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":20,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Recorrer marcha atrás más de 15 m o invadir un cruce para incorporarse","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":21,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Utilización inadecuada de los carriles de aceleración","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":22,"bloque":"4. Progresión normal","tipo":"E","nivel":"Eliminatoria","falta":"Reducir peligrosamente la separación lateral con peatones o ciclistas","obs":"Se valora según separación, velocidad y actitud del peatón/ciclista.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":23,"bloque":"4. Progresión normal","tipo":"E","nivel":"Eliminatoria","falta":"Circular a velocidad inadecuada por estado de la vía o meteorología causando riesgo o peligro","obs":"Lluvia intensa, niebla densa, hielo, humo, viento fuerte, etc.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":24,"bloque":"4. Progresión normal","tipo":"E","nivel":"Eliminatoria","falta":"No adaptarse al ritmo del tráfico o de la vía tras ser invitado a ello","obs":"Cuando se circula de forma continuada muy por debajo del ritmo posible.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":25,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"No circular por el carril derecho cuando sea reglamentario, obstaculizando","obs":"En vías con varios carriles o situaciones en que debe circularse por la derecha.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":26,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Circular por carril no autorizado para el vehículo, obstaculizando","obs":"En vías fuera de poblado con tres o más carriles, si procede.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":27,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Mantenerse circulando notablemente próximo a otros vehículos","obs":"Distancia frontal claramente insuficiente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":28,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Reducir notablemente la separación lateral con peatones, ciclistas o animales","obs":"Sin llegar a peligro directo.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":29,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Reducir notablemente la separación lateral con otros vehículos u obstáculos","obs":"Separación lateral insuficiente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":30,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Circular a velocidad anormalmente reducida sin causa justificada, obstaculizando","obs":"No basta con ir lento: debe obstaculizar.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":31,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Salirse de la calzada donde no exista arcén, sin pérdida de dominio","obs":"Por circular demasiado próximo al borde.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":32,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"No detenerse en túnel o paso inferior lo más lejos posible del vehículo precedente","obs":"Cuando sea necesario detenerse por la circulación.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":33,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Exceder la velocidad máxima en más de 20 km/h y hasta 30 km/h","obs":"Criterio general de velocidad máxima.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":34,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"No circular por el carril derecho cuando sea reglamentario","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":35,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"Mantenerse junto al eje de la calzada en vía de un carril por sentido","obs":"Cuando debe circularse más centrado en el carril propio/derecha.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":36,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"No circular lo más cerca posible del borde derecho en curvas o rasantes de reducida visibilidad","obs":"En vías de un carril por sentido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":37,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"Circular por el arcén parcial o totalmente","obs":"Salvo supuestos permitidos.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":38,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"Circular a velocidad anormalmente reducida sin causa justificada","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":39,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"Exceder la velocidad máxima en más de 10 km/h y hasta 20 km/h","obs":"Criterio general de velocidad máxima.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":40,"bloque":"5. Desplazamientos laterales","tipo":"E","nivel":"Eliminatoria","falta":"Obligar a modificar bruscamente trayectoria o velocidad en paso estrecho sin prioridad","obs":"Cuando corresponde prioridad a otro vehículo.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":41,"bloque":"5. Desplazamientos laterales","tipo":"D","nivel":"Deficiente","falta":"Reducir considerablemente la velocidad sin observar, valorar o advertir","obs":"Frenada o reducción que afecta al tráfico.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":42,"bloque":"5. Desplazamientos laterales","tipo":"D","nivel":"Deficiente","falta":"Realizar el desplazamiento obstaculizando a vehículos por detrás o en sentido contrario","obs":"Cambio de carril, salida o entrada sin margen suficiente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":43,"bloque":"5. Desplazamientos laterales","tipo":"D","nivel":"Deficiente","falta":"No guardar separación frontolateral adecuada con vehículos u obstáculos","obs":"Durante el desplazamiento lateral.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":44,"bloque":"5. Desplazamientos laterales","tipo":"D","nivel":"Deficiente","falta":"No penetrar lo antes posible en carril de deceleración, obstaculizando","obs":"Entrada tardía al carril de salida.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":45,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"No observar el tráfico delante, detrás y/o lateralmente","obs":"Antes de desplazar el vehículo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":46,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"Omitir señal reglamentaria","obs":"No indicar el desplazamiento.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":47,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"Señalizar al contrario","obs":"Intermitente erróneo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":48,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"Señalizar sin suficiente antelación","obs":"Indicación tardía.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":49,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"Señalizar con excesiva antelación","obs":"Indicación que puede confundir.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":50,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"No extinguir la señalización tras la maniobra","obs":"Intermitente mantenido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":51,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"Realizar el desplazamiento de forma brusca","obs":"Sin peligro ni obstaculización notable.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":52,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"No penetrar lo antes posible en carril de deceleración","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":53,"bloque":"6. Adelantamientos","tipo":"E","nivel":"Eliminatoria","falta":"Adelantar en intersecciones o proximidades sin visibilidad lateral suficiente","obs":"Especialmente a vehículos de más de dos ruedas.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":54,"bloque":"6. Adelantamientos","tipo":"E","nivel":"Eliminatoria","falta":"Adelantar obstaculizando a los que circulan en sentido contrario","obs":"Riesgo directo en sentido contrario.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":55,"bloque":"6. Adelantamientos","tipo":"E","nivel":"Eliminatoria","falta":"No disminuir la velocidad cuando exista peligro durante el adelantamiento","obs":"Para evitar riesgo a cualquier usuario.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":56,"bloque":"6. Adelantamientos","tipo":"E","nivel":"Eliminatoria","falta":"Adelantar sin dejar separación lateral reglamentaria con riesgo","obs":"Especial atención a ciclistas, peatones y vehículos vulnerables.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":57,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Iniciar el adelantamiento demasiado próximo al vehículo precedente","obs":"No mantener separación frontal reglamentaria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":58,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Iniciar el adelantamiento demasiado lejos y prolongar innecesariamente, obstaculizando","obs":"Maniobra demasiado larga.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":59,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Adelantar con lentitud o sin suficiente diferencia de velocidad, obstaculizando","obs":"No completar con fluidez cuando es posible.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":60,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"No intentar el adelantamiento tras ser invitado, evidenciando inseguridad","obs":"Cuando las circunstancias son idóneas.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":61,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Adelantar obstaculizando a los vehículos del carril contiguo","obs":"Mala valoración del carril al que se entra.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":62,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Adelantar en pasos de peatones, pasos a nivel, vías ciclistas o túneles cuando esté prohibido","obs":"Según lugar y riesgo, puede ser eliminatoria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":63,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Iniciar el adelantamiento cuando el precedente ya indicó desplazarse al mismo lado, obstaculizando","obs":"No respetar la intención del vehículo precedente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":64,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Demorar excesivamente la vuelta al carril derecho, obstaculizando","obs":"No regresar tras terminar el adelantamiento.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":65,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"Iniciar el adelantamiento demasiado lejos prolongando innecesariamente la maniobra","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":66,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"Adelantar con lentitud o sin suficiente diferencia de velocidad","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":67,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"No observar tráfico lateral y posterior al adelantar","obs":"Mirar espejos y ángulo muerto.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":68,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"Omitir, señalizar mal o tarde el desplazamiento del adelantamiento","obs":"Intermitentes en salida o retorno.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":69,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"No extinguir la señalización tras el adelantamiento","obs":"Intermitente mantenido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":70,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"Demorar la vuelta al carril derecho","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":71,"bloque":"7. Intersecciones y glorietas","tipo":"E","nivel":"Eliminatoria","falta":"Circular por sentido contrario en intersección o glorieta","obs":"Dejar a la derecha mediana, refugio, isleta o centro de glorieta.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":72,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"Franquear la intersección a velocidad inadecuada","obs":"Cuando afecta a la seguridad o fluidez.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":73,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"No llevar posición adecuada para o durante el franqueo, obstaculizando","obs":"Mala colocación en carril o trayectoria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":74,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"Aproximarse o franquear a velocidad excesivamente reducida sin causa, obstaculizando","obs":"Exceso de indecisión.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":75,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"Detenerse sin necesidad, obstaculizando","obs":"Parada innecesaria que afecta al tráfico.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":76,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"Detenerse rebasada la posición de entrada obstaculizando la circulación transversal","obs":"Parada dentro de la intersección.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":77,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"No detenerse, obstaculizando a vehículo con prioridad","obs":"Sin llegar a producir peligro eliminatorio.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":78,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"No detenerse, obstaculizando a ciclistas con prioridad","obs":"En carril bici o paso ciclista.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":79,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"No detenerse, obstaculizando a peatones o animales con prioridad","obs":"Cruces de arcén, zona peatonal, cañada, giros a otra vía.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":80,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"Al reanudar la marcha, obstaculizar al usuario con prioridad","obs":"Salida precipitada tras parada.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":81,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"No reanudar la marcha en el momento oportuno, obstaculizando","obs":"Demora excesiva.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":82,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"No mantener la señalización durante el giro o maniobra","obs":"Intermitente que se apaga o no se mantiene.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":83,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"No extinguir la señalización al finalizar","obs":"Intermitente mantenido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":84,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"No llevar la posición adecuada para o durante el franqueo","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":85,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"Aproximarse o franquear a velocidad excesivamente reducida sin causa","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":86,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"Aproximarse a velocidad inadecuada","obs":"Defecto de anticipación.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":87,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"Detenerse súbitamente ante semáforo, stop, ceda, etc.","obs":"Por no anticipar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":88,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"Detenerse antes de alcanzar la zona de máxima visibilidad posible","obs":"Cuando no permite valorar correctamente.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":89,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"Detenerse sin necesidad","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":90,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"No reanudar la marcha en el momento oportuno","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":91,"bloque":"8. Cambio de sentido","tipo":"E","nivel":"Eliminatoria","falta":"Realizar hacia atrás tres o más movimientos de los necesarios","obs":"Según espacio disponible.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":92,"bloque":"8. Cambio de sentido","tipo":"D","nivel":"Deficiente","falta":"Realizar la maniobra en lugar prohibido por norma, obstaculizando","obs":"Lugar no permitido y afecta al tráfico.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":93,"bloque":"8. Cambio de sentido","tipo":"D","nivel":"Deficiente","falta":"Realizar la maniobra obstaculizando la circulación","obs":"Aunque el lugar pudiera ser válido.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":94,"bloque":"8. Cambio de sentido","tipo":"D","nivel":"Deficiente","falta":"Realizar hacia atrás dos movimientos más de los necesarios","obs":"Según espacio disponible.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":95,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"No observar el tráfico delante, detrás y/o lateralmente","obs":"Antes y durante la maniobra.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":96,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"Omitir, señalizar al contrario, tarde o con excesiva antelación","obs":"Uso incorrecto de intermitentes.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":97,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"No extinguir la señalización al terminar","obs":"Intermitente mantenido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":98,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"Realizar la maniobra en lugar prohibido por norma","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":99,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"Realizar hacia atrás un movimiento más de los necesarios","obs":"Según espacio disponible.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":100,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"Forzar o golpear fuertemente el bordillo sin llegar a subirlo","obs":"En cambio de sentido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":101,"bloque":"9. Paradas y estacionamientos","tipo":"E","nivel":"Eliminatoria","falta":"Dejar el vehículo estacionado sobresaliendo más de la mitad respecto a la alineación","obs":"Respecto a otros vehículos o marcas de estacionamiento.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":102,"bloque":"9. Paradas y estacionamientos","tipo":"E","nivel":"Eliminatoria","falta":"En batería, sobresalir más de un metro invadiendo zona de circulación","obs":"Especialmente en estacionamiento en batería.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":103,"bloque":"9. Paradas y estacionamientos","tipo":"D","nivel":"Deficiente","falta":"Realizar parada o estacionamiento en lugar prohibido, obstaculizando","obs":"Lugar incorrecto y afectación a otros.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":104,"bloque":"9. Paradas y estacionamientos","tipo":"D","nivel":"Deficiente","falta":"Obstaculizar durante la ejecución de parada o estacionamiento","obs":"Maniobra que dificulta la circulación.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":105,"bloque":"9. Paradas y estacionamientos","tipo":"D","nivel":"Deficiente","falta":"Dejar el vehículo sobresaliendo menos de la mitad de la alineación","obs":"Deficiente si la colocación afecta.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":106,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"No observar tráfico delante, detrás y/o lateralmente","obs":"Antes de iniciar o finalizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":107,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"Omitir, señalizar al contrario, tarde o demasiado pronto","obs":"Intermitente de parada/estacionamiento.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":108,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"Realizar la maniobra en lugar prohibido por norma","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":109,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"Seleccionar un espacio claramente inferior a la longitud del vehículo","obs":"Cuando se entra totalmente con la parte posterior.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":110,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"Superar el tiempo máximo de 2 minutos en estacionamiento","obs":"Criterio de duración de la maniobra.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":111,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"No accionar el freno de estacionamiento al finalizar","obs":"Si procede por seguridad.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":112,"bloque":"11. Señales: agentes y paneles","tipo":"E","nivel":"Eliminatoria","falta":"No respetar señal de agente de circulación","obs":"También señales de policía militar, protección civil u obras.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":113,"bloque":"11. Señales: agentes y paneles","tipo":"D","nivel":"Deficiente","falta":"Detenerse o demorar reanudación cuando el agente permite el paso","obs":"Si afecta al tráfico.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":114,"bloque":"11. Señales: agentes y paneles","tipo":"D","nivel":"Deficiente","falta":"Incumplir señales de reglamentación en panel variable","obs":"Aplicando criterio de señal vertical.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":115,"bloque":"11. Semáforos","tipo":"E","nivel":"Eliminatoria","falta":"No respetar semáforo en rojo","obs":"Aunque no se invada completamente si se pierde la visión de la luz o se penetra en la intersección.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":116,"bloque":"11. Semáforos","tipo":"E","nivel":"Eliminatoria","falta":"No respetar luz roja intermitente o dos rojas alternas","obs":"No detenerse ante ellas.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":117,"bloque":"11. Semáforos","tipo":"E","nivel":"Eliminatoria","falta":"No respetar semáforo con franja blanca horizontal","obs":"Señal de detención para vehículos afectados.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":118,"bloque":"11. Semáforos","tipo":"E","nivel":"Eliminatoria","falta":"Ocupar o no abandonar carril con aspa roja","obs":"Carril cerrado.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":119,"bloque":"11. Semáforos","tipo":"D","nivel":"Deficiente","falta":"Detenerse o no reanudar ante franja blanca vertical u oblicua, obstaculizando","obs":"Cuando las circunstancias permiten continuar.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":120,"bloque":"11. Semáforos","tipo":"D","nivel":"Deficiente","falta":"Rebasar dispositivo delimitador móvil en movimiento sin causar peligro","obs":"Con peligro sería eliminatoria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":121,"bloque":"11. Semáforos","tipo":"D","nivel":"Deficiente","falta":"No ceder al seguir flecha verde de semáforo circular","obs":"Vehículos del carril al que se incorpora o peatones.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":122,"bloque":"11. Semáforos","tipo":"D","nivel":"Deficiente","falta":"Detenerse sin necesidad o no reanudar en verde/amarillo intermitente, obstaculizando","obs":"Cuando puede continuar.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":123,"bloque":"11. Semáforos","tipo":"D","nivel":"Deficiente","falta":"No seguir dirección de flecha verde sobre fondo negro, obstaculizando","obs":"Especialmente si se incumple selección de carril.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":124,"bloque":"11. Semáforos","tipo":"L","nivel":"Leve","falta":"Rebasar semáforo amarillo fijo pudiendo detenerse con seguridad","obs":"No confundir con amarillo intermitente.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":125,"bloque":"11. Semáforos","tipo":"L","nivel":"Leve","falta":"Rebasar franja blanca vertical u oblicua intermitente pudiendo detenerse con seguridad","obs":"Cuando proceda detenerse.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":126,"bloque":"11. Semáforos","tipo":"L","nivel":"Leve","falta":"Detenerse sin necesidad o no reanudar en verde/amarillo intermitente","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":127,"bloque":"11. Señales verticales","tipo":"E","nivel":"Eliminatoria","falta":"Incumplir CEDA EL PASO, STOP o prioridad en sentido contrario","obs":"Si implica el incumplimiento principal de prioridad.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":128,"bloque":"11. Señales verticales","tipo":"E","nivel":"Eliminatoria","falta":"Incumplir circulación prohibida o entrada prohibida","obs":"Entrada en vía no permitida.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":129,"bloque":"11. Señales verticales","tipo":"E","nivel":"Eliminatoria","falta":"Incumplir restricción de paso u otras prohibiciones/restricciones","obs":"Cuando tiene consideración grave según criterio DGT.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":130,"bloque":"11. Señales verticales","tipo":"E","nivel":"Eliminatoria","falta":"Exceder la velocidad máxima en más de 30 km/h","obs":"Velocidad máxima señalizada.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":131,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"No hacer uso de la preferencia ante señal de prioridad, obstaculizando","obs":"Por ejemplo no avanzar cuando se tiene prioridad y se dificulta la circulación.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":132,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"Exceder la velocidad máxima en más de 20 km/h y hasta 30 km/h","obs":"Velocidad máxima señalizada.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":133,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"No moderar la velocidad ante luz amarilla intermitente","obs":"O dos luces amarillas alternas.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":134,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"Incumplir señales de obligación","obs":"Tras ser requerido, no cumplir pudiendo hacerlo puede ser eliminatoria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":135,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"No respetar vía reservada a ciclos, VMP o carril reservado","obs":"Según señalización de la vía.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":136,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"Incumplir velocidad mínima","obs":"Si afecta a la circulación.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":137,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"Obstaculizar peatones en calle residencial, zona 30 o zona de coexistencia","obs":"Donde la señal está instalada.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":138,"bloque":"11. Señales verticales","tipo":"L","nivel":"Leve","falta":"Exceder la velocidad máxima en más de 10 km/h y hasta 20 km/h","obs":"Velocidad máxima señalizada.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":139,"bloque":"11. Señales verticales","tipo":"L","nivel":"Leve","falta":"Incumplir advertencias acústicas prohibidas","obs":"Uso indebido del claxon.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":140,"bloque":"11. Marcas viales","tipo":"E","nivel":"Eliminatoria","falta":"Circular parcial o totalmente por la izquierda de línea continua que separa sentidos opuestos","obs":"Invadir sentido contrario.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":141,"bloque":"11. Marcas viales","tipo":"E","nivel":"Eliminatoria","falta":"Atravesar línea continua que separa sentidos opuestos","obs":"Cruzar la marca vial prohibida.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":142,"bloque":"11. Marcas viales","tipo":"E","nivel":"Eliminatoria","falta":"No dejar pasar a peatones o ciclistas que ya cruzan en pasos señalizados","obs":"Paso de peatones, carril bici o paso ciclista.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":143,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"Atravesar o circular sobre línea continua que separa carriles del mismo sentido","obs":"Sin llegar a eliminatoria por sentido contrario.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":144,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"Circular sobre líneas discontinuas obstaculizando","obs":"Uso indebido de marcas discontinuas.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":145,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"Obstaculizar a peatones o ciclistas que esperan o cruzan en pasos señalizados","obs":"Si no llega a eliminatoria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":146,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"No seguir dirección indicada por una señal de orientación","obs":"Por no observar adecuadamente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":147,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"No seguir flecha de selección de carriles","obs":"La DGT lo recoge en marcas/inscripciones.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":148,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"Entrar en cebreado que separa carriles","obs":"Según el cebreado y la situación.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":149,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"No respetar cuadrícula amarilla cuando previsiblemente se queda inmovilizado obstaculizando","obs":"Bloquear intersección o zona marcada.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":150,"bloque":"11. Marcas viales","tipo":"L","nivel":"Leve","falta":"Circular sobre líneas discontinuas","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":151,"bloque":"11. Marcas viales","tipo":"L","nivel":"Leve","falta":"Detenerse sin justificación sobre paso para peatones o ciclistas","obs":"Sin obstaculización grave.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":152,"bloque":"11. Marcas viales","tipo":"L","nivel":"Leve","falta":"Rebasar línea transversal de detención continua o discontinua","obs":"En stop, ceda, semáforo, etc.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":153,"bloque":"11. Marcas viales","tipo":"L","nivel":"Leve","falta":"Exceder señal de velocidad en más de 10 km/h y hasta 20 km/h","obs":"Cuando se valora por marca/señal.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":154,"bloque":"11. Marcas viales","tipo":"L","nivel":"Leve","falta":"No respetar cuadrícula amarilla sin obstaculizar","obs":"Entrar pudiendo quedar inmovilizado.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":155,"bloque":"12. Luces","tipo":"E","nivel":"Eliminatoria","falta":"Circular sin alumbrado en condiciones de notable falta de visibilidad","obs":"Conducción negligente por no llevar luces.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":156,"bloque":"12. Luces","tipo":"E","nivel":"Eliminatoria","falta":"Usar alumbrado produciendo deslumbramiento y causando peligro","obs":"Especialmente carretera/larga.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":157,"bloque":"12. Luces","tipo":"E","nivel":"Eliminatoria","falta":"No utilizar antiniebla trasera obligatoria causando peligro","obs":"Falta o disminución de visibilidad.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":158,"bloque":"12. Luces","tipo":"E","nivel":"Eliminatoria","falta":"No activar luces tras ser indicado después de falta leve","obs":"Por desconocimiento del mando.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":159,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"No utilizar alumbrado cuando es obligatorio","obs":"El examinador puede indicar que lo encienda; si no sabe, puede ser E.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":160,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"No activar manualmente luces automáticas cuando no se activan y son imprescindibles","obs":"Con falta de visibilidad.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":161,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"No utilizar luz de cruce cuando es obligatoria","obs":"Supuestos reglamentarios.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":162,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"Utilizar luz de carretera cuando está prohibido o deslumbrando sin peligro","obs":"Sin llegar a riesgo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":163,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"No utilizar antiniebla cuando corresponde","obs":"Según condiciones.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":164,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"Usar antiniebla trasera cuando no corresponde","obs":"Sin condiciones reglamentarias.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":165,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"No utilizar luces de emergencia cuando son obligatorias","obs":"O utilizarlas cuando no procede.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":166,"bloque":"13. Manejo de mandos","tipo":"E","nivel":"Eliminatoria","falta":"Confusión de pedal con peligro","obs":"Si concurren circunstancias de peligro.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":167,"bloque":"13. Manejo de mandos","tipo":"E","nivel":"Eliminatoria","falta":"Dejar caer el vehículo más de 50 cm en sentido contrario al pretendido con riesgo","obs":"En pendientes o salidas.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":168,"bloque":"13. Manejo de mandos","tipo":"D","nivel":"Deficiente","falta":"No desactivar el freno de estacionamiento afectando ostensiblemente a la marcha","obs":"Ruedas frenadas, calados sucesivos o dificultad clara.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":169,"bloque":"13. Manejo de mandos","tipo":"D","nivel":"Deficiente","falta":"Soltar momentáneamente las dos manos del volante sin pérdida de dominio","obs":"Sin llegar a perder el control.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":170,"bloque":"13. Manejo de mandos","tipo":"D","nivel":"Deficiente","falta":"Dejar caer el vehículo más de 50 cm en sentido contrario al pretendido","obs":"Según velocidad o espacio.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":171,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No conseguir el encendido del motor","obs":"Tras margen suficiente, se indica cómo hacerlo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":172,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Accionar la puesta en marcha con una velocidad seleccionada provocando salto","obs":"Mala preparación del arranque.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":173,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Insistir en la puesta en marcha con el motor ya funcionando","obs":"Mal uso del contacto/arranque.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":174,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No apagar el motor cuando sea reglamentario","obs":"Al finalizar o en supuestos necesarios.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":175,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Desembragar sin justificación","obs":"Uso incorrecto del embrague.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":176,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Frenar de forma brusca por no anticipar","obs":"En permiso B se valora generalmente como leve salvo peligro.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":177,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No usar acelerador con progresividad, suavidad y decisión","obs":"Aceleraciones pobres o bruscas.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":178,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No usar relación de marcha adecuada según velocidad, tráfico o vía","obs":"Marcha demasiado larga/corta.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":179,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Poner punto muerto antes de detenerse sin aprovechar retención del motor","obs":"Mala técnica de conducción.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":180,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No usar marcha adecuada en descensos prolongados para que el motor actúe como freno","obs":"En turismos se valora como leve según criterio.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":181,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Calado del motor por no seleccionar relación adecuada","obs":"Una falta leve por cada calado.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":182,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No desactivar freno de estacionamiento aunque no afecte a la marcha","obs":"Se indica que lo desactive.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":183,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Calados por no desactivar freno de estacionamiento","obs":"Se anotan y se indica si se repiten.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":184,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Sujeción con una sola mano sin justificación","obs":"Mano fuera del volante sin necesidad.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":185,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Ligeras desviaciones de trayectoria","obs":"Con ambas manos o al cambiar de marcha.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":186,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Giro brusco del volante por no anticipar la trayectoria","obs":"Manejo brusco.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":187,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Mantener las manos cruzadas durante un giro o coger el volante por el interior","obs":"Estando el vehículo en movimiento.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":188,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No realizar conducción eficiente durante la prueba","obs":"Se anota una sola vez al finalizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":189,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Usar embrague antes que freno o simultáneamente sin necesidad","obs":"Operación combinada incorrecta.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":190,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Calado del motor","obs":"Una falta leve por cada calado.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":191,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Aceleraciones en vacío","obs":"Según revoluciones.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":192,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Arranque brusco o a saltos","obs":"En permiso B, generalmente leve salvo riesgo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":193,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Realizar cambios con brusquedad","obs":"En permiso B, generalmente leve salvo riesgo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":194,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Rascar o tener dificultad al introducir marcha por mal uso del embrague","obs":"Error de coordinación.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":195,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Reducir a marcha inferior y no soltar embrague","obs":"Mala operación embrague/cambio.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":196,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Desembragar en curva o cambio de dirección","obs":"Según velocidad y trazado puede subir.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":197,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Frenar en curva sin necesidad","obs":"Según velocidad y trazado puede subir.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":198,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Mantener acelerador accionado al cambiar de marcha","obs":"Mala coordinación.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":199,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No revolucionar suficiente al cambiar a marchas largas, produciendo traqueteo","obs":"Mala relación marcha/velocidad.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":200,"bloque":"14. Otros mandos","tipo":"E","nivel":"Eliminatoria","falta":"Desconocer mando imprescindible por visibilidad o seguridad tras indicación","obs":"Luces, limpia, desempañado, dispositivos de seguridad.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":201,"bloque":"14. Otros mandos","tipo":"D","nivel":"Deficiente","falta":"No desactivar freno eléctrico afectando ostensiblemente a la marcha","obs":"Si el vehículo lo equipa.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":202,"bloque":"14. Otros mandos","tipo":"L","nivel":"Leve","falta":"No utilizar limpiaparabrisas cuando sea necesario","obs":"Si el sistema automático no actúa, debe activarlo manualmente.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":203,"bloque":"14. Otros mandos","tipo":"L","nivel":"Leve","falta":"Usar señales acústicas de forma antirreglamentaria","obs":"Claxon sin causa reglamentaria.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":204,"bloque":"14. Otros mandos","tipo":"L","nivel":"Leve","falta":"Iniciar la marcha con una puerta abierta o mal cerrada","obs":"Tras advertencia en el cuadro/instrumentos.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":205,"bloque":"14. Otros mandos","tipo":"L","nivel":"Leve","falta":"No usar sistemas de desempañado o protección frente al deslumbramiento cuando es necesario","obs":"Parasol, luneta, ventilación, desempañado.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":206,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Golpear a personas, animales, vehículos o elementos","obs":"Accidente imputable al aspirante.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":207,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Crear riesgo cierto y relevante que obliga a otros a modificar bruscamente trayectoria o velocidad","obs":"Maniobra o actuación evasiva de otro usuario.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":208,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Invadir sentido contrario en lugar o circunstancias de reducida visibilidad","obs":"Giro o circulación con falta de visibilidad.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":209,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Perder el dominio del vehículo","obs":"No controlar la trayectoria en relación con la velocidad.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":210,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Intervención del profesor o sistema AEB por causa imputable al aspirante","obs":"Acción directa sobre mandos o frenado de emergencia.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":211,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Subir al bordillo con alguna rueda","obs":"Excepto supuestos de bordillo rebajado/poca altura en maniobras; en turismo con rueda posterior puede ser leve.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":212,"bloque":"15. Durante la prueba","tipo":"L","nivel":"Leve","falta":"Subir al bordillo con la rueda posterior de un turismo","obs":"Criterio específico de la DGT.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":213,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"No seguir reiteradamente las indicaciones del examinador","obs":"Se entiende reiterado cuando, advertido cada vez, sucede al menos tres veces.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."}]'),Ke="simulador_permiso_b_db",Xe=5;let X;function w(e="id"){return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`}function qe(){return X||(X=new Promise((e,a)=>{if(!("indexedDB"in window)){a(new Error("IndexedDB no está disponible en este navegador."));return}const n=indexedDB.open(Ke,Xe);n.onupgradeneeded=()=>{const i=n.result;if(i.objectStoreNames.contains("simulations")){const o=n.transaction.objectStore("simulations");o.indexNames.contains("studentId")||o.createIndex("studentId","studentId")}else{const o=i.createObjectStore("simulations",{keyPath:"id"});o.createIndex("updatedAt","updatedAt"),o.createIndex("studentId","studentId")}if(!i.objectStoreNames.contains("students")){const o=i.createObjectStore("students",{keyPath:"id"});o.createIndex("name","name"),o.createIndex("updatedAt","updatedAt")}i.objectStoreNames.contains("settings")||i.createObjectStore("settings",{keyPath:"key"})},n.onsuccess=()=>e(n.result),n.onerror=()=>a(n.error),n.onblocked=()=>a(new Error("La base de datos está bloqueada por otra pestaña abierta."))}),X)}function N(e,a="readonly"){return qe().then(n=>n.transaction(e,a).objectStore(e))}function M(e){return new Promise((a,n)=>{e.onsuccess=()=>a(e.result),e.onerror=()=>n(e.error)})}async function J(e){const a=await N("simulations","readwrite");return await M(a.put(e)),e}async function te(e){const a=await N("simulations");return M(a.get(e))}async function ea(e){const a=await N("simulations","readwrite");return M(a.delete(e))}async function aa(){const e=await N("simulations");return(await M(e.getAll())).sort((n,i)=>String(i.updatedAt||"").localeCompare(String(n.updatedAt||"")))}async function Y(e){const a=await N("students","readwrite");return await M(a.put(e)),e}async function De(e){const a=await N("students");return M(a.get(e))}async function ta(e){const a=await N("students","readwrite");return M(a.delete(e))}async function na(){const e=await N("students");return(await M(e.getAll())).sort((n,i)=>String(n.name||"").localeCompare(String(i.name||""),"es"))}async function R(e,a){const n=await N("settings","readwrite");return M(n.put({key:e,value:a}))}async function le(e,a=null){const n=await N("settings"),i=await M(n.get(e));return i?i.value:a}function ia(e=[]){return e.reduce((a,n)=>{const i=n.tipo||n.snapshot?.tipo;return i==="L"&&(a.L+=1),i==="D"&&(a.D+=1),i==="E"&&(a.E+=1),a.total+=1,a},{L:0,D:0,E:0,total:0})}function _(e=[]){const a=ia(e),n=a.E>=1||a.D>=2||a.D>=1&&a.L>=5||a.L>=10,i=[];return a.E>=1&&i.push("1 falta eliminatoria"),a.D>=2&&i.push("2 faltas deficientes"),a.D>=1&&a.L>=5&&i.push("1 deficiente + 5 leves"),a.L>=10&&i.push("10 faltas leves"),{...a,result:n?"NO APTO":"APTO",noApto:n,reasons:i}}function ne(e){return e==="L"?"Leve":e==="D"?"Deficiente":e==="E"?"Eliminatoria":"Sin clasificar"}const ce="Revisa que Safari/Chrome permita guardar datos de sitios web y que el dispositivo tenga espacio disponible.";class oa extends Error{constructor(a,n={}){super(a),this.name="UserVisibleError",this.code=n.code||"USER_VISIBLE_ERROR",this.title=n.title||"No se pudo completar la acción",this.cause=n.cause}}function T(e,a={}){return new oa(e,a)}function xe(e,a="general"){return e?.name==="UserVisibleError"?{title:e.title,message:e.message,code:e.code}:e?.name==="QuotaExceededError"?{title:"No queda espacio para guardar",message:`El navegador no ha podido guardar los datos porque el almacenamiento parece estar lleno. ${ce}`,code:"STORAGE_FULL"}:e?.name==="InvalidStateError"||e?.name==="NotFoundError"?{title:"No se pudo acceder al historial",message:`No se ha podido abrir la base de datos local del navegador. Cierra y vuelve a abrir la app. ${ce}`,code:"DATABASE_UNAVAILABLE"}:e?.name==="SecurityError"?{title:"El navegador ha bloqueado el almacenamiento",message:"La app no puede guardar datos en este contexto. Prueba a abrirla desde una URL HTTPS o desde Safari/Chrome normal, no desde navegación privada.",code:"STORAGE_BLOCKED"}:e instanceof SyntaxError||a==="import"?{title:"No se pudo leer la copia",message:"El archivo seleccionado no parece ser una copia JSON válida del simulador. Elige una copia exportada desde esta app.",code:"BAD_IMPORT_FILE"}:a==="pdf"?{title:"No se pudo generar el PDF",message:"No se ha podido crear el informe. Guarda la simulación y vuelve a intentarlo. Si el problema continúa, prueba desde Safari o Chrome actualizado.",code:"PDF_ERROR"}:a==="save"?{title:"No se pudieron guardar los cambios",message:`La simulación sigue abierta, pero los últimos cambios podrían no haberse guardado. ${ce}`,code:"SAVE_ERROR"}:a==="export"?{title:"No se pudo descargar la copia",message:"El navegador no ha permitido descargar el archivo. Prueba de nuevo o usa el botón de compartir/descargar del navegador.",code:"EXPORT_ERROR"}:{title:"Ha ocurrido un problema",message:"La acción no se ha completado. Puedes seguir usando la app; si vuelve a ocurrir, cierra y abre de nuevo antes de desplegar.",code:"UNKNOWN_ERROR"}}const Ee=new Set(["L","D","E"]),ra=8*1024*1024,Ae=1500*1e3;function Q(e=new Date){const a=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0");return`${a}-${n}-${i}`}function sa(e){if(!e)return null;const a=String(e).trim(),n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(a);if(n){const o=Number(n[1]),r=Number(n[2])-1,l=Number(n[3]),d=new Date(o,r,l);return d.getFullYear()===o&&d.getMonth()===r&&d.getDate()===l?d:null}const i=new Date(a);return Number.isNaN(i.getTime())?null:i}function H(e,a="Sin fecha"){if(!e)return a;const n=sa(e);if(!n)return String(e);try{return new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}).format(n)}catch{return String(e)}}function la(e){const a=Number(e);return!Number.isFinite(a)||a<1?1:a>180?180:Math.round(a)}function ca(e){const a=[];if(!Array.isArray(e))return["El catálogo de faltas no es una lista."];const n=new Set;return e.forEach((i,o)=>{Number.isInteger(i.id)||a.push(`Falta ${o+1}: id inválido.`),n.has(i.id)&&a.push(`Falta ${o+1}: id duplicado ${i.id}.`),n.add(i.id),Ee.has(i.tipo)||a.push(`Falta ${i.id}: tipo inválido.`),String(i.falta||"").trim()||a.push(`Falta ${i.id}: falta sin texto.`),String(i.bloque||"").trim()||a.push(`Falta ${i.id}: bloque vacío.`)}),a}function da(e){if(!e||typeof e!="object")throw T("No hay una simulación activa para generar el PDF.",{title:"No hay simulación activa",code:"NO_ACTIVE_SIMULATION"});const a=[];return String(e.studentName||"").trim()||a.push("No has indicado el nombre del alumno/a."),e.date||a.push("No has indicado la fecha de la simulación."),a}function ua(e){if(!e)throw T("No se ha seleccionado ningún archivo.",{title:"Archivo no seleccionado",code:"NO_FILE_SELECTED"});if(e.size>ra)throw T("El archivo es demasiado grande. Exporta una copia más pequeña o importa menos simulaciones.",{title:"Archivo demasiado grande",code:"IMPORT_TOO_LARGE"});const a=String(e.name||"").toLowerCase();if(a&&!a.endsWith(".json"))throw T("El archivo debe ser una copia .json exportada desde el simulador.",{title:"Tipo de archivo no válido",code:"IMPORT_NOT_JSON"})}function ma(e){const a=Array.isArray(e)?e:e?.simulations,n=!Array.isArray(e)&&Array.isArray(e?.students)?e.students:[];if(!Array.isArray(a)&&!n.length)throw T("La copia no tiene el formato esperado. Debe contener simulaciones o alumnos.",{title:"Copia no compatible",code:"IMPORT_BAD_SHAPE"});const i=Array.isArray(a)?a:[];if(!i.length&&!n.length)throw T("La copia está vacía y no contiene datos para importar.",{title:"Copia vacía",code:"IMPORT_EMPTY"});const o=[],r=[];if(i.forEach((l,d)=>{l&&typeof l=="object"&&!Array.isArray(l)?o.push(l):r.push(d+1)}),!o.length&&!n.length)throw T("No se ha encontrado ninguna simulación válida dentro del archivo.",{title:"Copia no válida",code:"IMPORT_NO_VALID_ROWS"});return{simulations:o,students:n,invalidIndexes:r}}function Ne(e,{makeId:a,nowIso:n,catalogById:i=null}){if(!Array.isArray(e))return[];const o=n();return e.filter(r=>r&&typeof r=="object"&&!Array.isArray(r)).map(r=>{const l=Number(r.faultId??r.id),d=Number.isInteger(l)?l:null,f=d!==null&&i?i.get(d):null,h=r.tipo||r.snapshot?.tipo||f?.tipo||"L",b=Ee.has(h)?h:"L",v=r.snapshot&&typeof r.snapshot=="object"?r.snapshot:f||r;return{uid:String(r.uid||"").trim()||a("fault"),faultId:d,tipo:b,note:String(r.note||"").slice(0,1e3),snapshot:{id:d??v.id??0,bloque:String(v.bloque||"General").slice(0,160),tipo:b,nivel:String(v.nivel||"").slice(0,40),falta:String(v.falta||"Falta registrada").slice(0,400),obs:String(v.obs||"").slice(0,600)},createdAt:String(r.createdAt||o).slice(0,40)}})}function ie(e,{makeId:a,nowIso:n}){const i=e&&typeof e=="object"?e:{},o=i.exam&&typeof i.exam=="object"?i.exam:{},r=i.parking&&typeof i.parking=="object"?i.parking:{},l=i.countdown&&typeof i.countdown=="object"?i.countdown:{},d=(y,se=0)=>{const O=Number(y);return Number.isFinite(O)&&O>=0?Math.floor(O):se},f=(y,se)=>{if(!y)return null;const O=Number(se);return Number.isFinite(O)&&O>0?O:null},h=d(l.durationMs,Ae)||Ae,b=l.remainingMs!==void 0?d(l.remainingMs,h):h,v=!!o.running,k=!!r.running,z=!!l.running,C=Array.isArray(r.records)?r.records.filter(y=>y&&typeof y=="object").map(y=>({id:String(y.id||"").trim()||a("time"),label:String(y.label||"Maniobra").slice(0,80),elapsedMs:d(y.elapsedMs,0),note:String(y.note||"").slice(0,240),createdAt:String(y.createdAt||y.date||n()).slice(0,40)})):[];return{exam:{label:String(o.label||"Examen completo").slice(0,80),elapsedMs:d(o.elapsedMs,0),running:v&&f(v,o.startedAt)!==null,startedAt:f(v,o.startedAt)},parking:{label:String(r.label||"Maniobra").slice(0,80),elapsedMs:d(r.elapsedMs,0),running:k&&f(k,r.startedAt)!==null,startedAt:f(k,r.startedAt),records:C},countdown:{label:String(l.label||"Examen temporizado").slice(0,80),durationMs:h,remainingMs:Math.min(h*2,b),running:z&&f(z,l.startedAt)!==null,startedAt:f(z,l.startedAt),endedAt:l.endedAt?String(l.endedAt).slice(0,40):null}}}function Z(e,a=Date.now()){if(!e||typeof e!="object")return!1;let n=!1;for(const o of["exam","parking"]){const r=e[o];if(r?.running){const l=Number(r.elapsedMs||0),d=r.startedAt?Math.max(0,a-Number(r.startedAt)):0;r.elapsedMs=Math.max(0,l+d),r.running=!1,r.startedAt=null,n=!0}}const i=e.countdown;if(i?.running){const o=Number(i.remainingMs??i.durationMs??0),r=i.startedAt?Math.max(0,a-Number(i.startedAt)):0;i.remainingMs=Math.max(0,o-r),i.running=!1,i.startedAt=null,n=!0}return n}function me(e){return!e||typeof e!="object"?!1:!!(e.exam?.running||e.parking?.running||e.countdown?.running)}function pa(e,{makeId:a,nowIso:n}){if(!e||typeof e!="object")return null;const i=n(),o=String(e.name||e.studentName||"").trim().slice(0,120);return o?{id:String(e.id||"").trim()||a("stu"),name:o,phone:String(e.phone||"").trim().slice(0,60),email:String(e.email||"").trim().slice(0,120),notes:String(e.notes||"").slice(0,4e3),createdAt:String(e.createdAt||i).slice(0,40),updatedAt:String(e.updatedAt||i).slice(0,40)}:null}function ba(e,{makeId:a,nowIso:n,catalogById:i=null}){const o=n(),r=String(e.id||"").trim()||a("sim"),l=e.status==="finalized"?"finalized":"draft",d=ie(e.timers,{makeId:a,nowIso:n});return l==="finalized"&&Z(d),{id:r,studentId:e.studentId?String(e.studentId).trim():null,studentName:String(e.studentName||"").trim().slice(0,120),date:String(e.date||"").trim().slice(0,20),zone:String(e.zone||"").trim().slice(0,160),teacher:String(e.teacher||"").trim().slice(0,120),vehicle:String(e.vehicle||"").trim().slice(0,120),generalNotes:String(e.generalNotes||"").slice(0,4e3),faults:Ne(e.faults,{makeId:a,nowIso:n,catalogById:i}),timers:d,status:l,createdAt:String(e.createdAt||o).slice(0,40),updatedAt:o}}const U=document.querySelector("#app"),V=new Map(W.map(e=>[e.id,e])),fa=25,c={home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6.5h-5V21H4a1 1 0 0 1-1-1v-9.5Z"/></svg>',users:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',userPlus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>',exam:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v6.5M4.2 16.5l5.6-3.2M19.8 16.5l-5.6-3.2"/></svg>',faults:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',summary:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/></svg>',history:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>',settings:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',back:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',plus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',play:'<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>',pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/></svg>',reset:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',flag:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>',download:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/></svg>',upload:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/></svg>',print:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',trash:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'},t={screen:"home",previousScreen:"home",catalog:W,current:null,history:[],students:[],selectedStudentId:null,query:"",studentQuery:"",historyQuery:"",historyFilter:"ALL",filter:"ALL",openBlocks:new Set,openFault:null,toast:"",userAlert:null,installedHintDismissed:!1,pdfBusy:!1,wakeLockEnabled:!1,wakeLockSentinel:null,studentDraft:Me()},g=()=>new Date().toISOString(),oe=()=>Date.now();let G=null;function va(){return!!(window.matchMedia?.("(display-mode: standalone)").matches||window.navigator?.standalone===!0)}function Me(){return{name:"",phone:"",email:"",notes:""}}function ga(){return ie({},{makeId:w,nowIso:g})}function Ie(e={}){const a=g();return{id:w("stu"),name:"",phone:"",email:"",notes:"",createdAt:a,updatedAt:a,...e}}function ke(e=null){const a=g();return{id:w("sim"),studentId:e?.id||null,studentName:e?.name||"",date:Q(),zone:"",teacher:"",vehicle:"",generalNotes:"",faults:[],timers:ga(),status:"draft",createdAt:a,updatedAt:a}}function p(e){return e?(e.studentId=e.studentId||null,e.studentName=String(e.studentName||""),e.date=e.date||Q(),e.zone=String(e.zone||""),e.teacher=String(e.teacher||""),e.vehicle=String(e.vehicle||""),e.generalNotes=String(e.generalNotes||""),e.faults=Ne(e.faults,{makeId:w,nowIso:g,catalogById:V}),e.timers=ie(e.timers,{makeId:w,nowIso:g}),e.status=e.status==="finalized"?"finalized":"draft",e):null}function ha(e){if(!e)return null;const a=g();return{id:e.id||w("stu"),name:String(e.name||e.studentName||"").slice(0,120),phone:String(e.phone||"").slice(0,60),email:String(e.email||"").slice(0,120),notes:String(e.notes||"").slice(0,4e3),createdAt:e.createdAt||a,updatedAt:e.updatedAt||a}}function s(e){return String(e??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[a])}function S(e){return String(e??"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}function j(e){const a=Number(e?.elapsedMs||0);return!e?.running||!e.startedAt?a:Math.max(0,a+(oe()-Number(e.startedAt)))}function E(e){const a=Number(e?.remainingMs??e?.durationMs??0);return!e?.running||!e.startedAt?Math.max(0,a):Math.max(0,a-(oe()-Number(e.startedAt)))}function D(e,{showTenths:a=!0}={}){const n=Math.max(0,Math.floor(Number(e||0))),i=Math.floor(n%1e3/100),o=Math.floor(n/1e3),r=o%60,l=Math.floor(o/60),d=l%60,f=Math.floor(l/60),h=String(r).padStart(2,"0"),b=String(d).padStart(2,"0"),v=f>0?`${String(f).padStart(2,"0")}:${b}:${h}`:`${b}:${h}`;return a?`${s(v)}<span class="clock-tenths">.${i}</span>`:s(v)}function ue(e){return Math.max(1,Math.round(Number(e?.durationMs||fa*60*1e3)/6e4))}function ya(){try{navigator.vibrate&&navigator.vibrate([220,100,220,100,320])}catch{}try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;const a=new e,n=(i,o,r)=>{const l=a.createOscillator(),d=a.createGain();l.type="sine",l.frequency.value=o,d.gain.setValueAtTime(.001,a.currentTime+i),d.gain.exponentialRampToValueAtTime(.18,a.currentTime+i+.02),d.gain.exponentialRampToValueAtTime(.001,a.currentTime+i+r),l.connect(d),d.connect(a.destination),l.start(a.currentTime+i),l.stop(a.currentTime+i+r+.02)};n(0,880,.18),n(.24,880,.18),n(.48,1046,.28),window.setTimeout(()=>a.close().catch(()=>{}),1200)}catch{}}async function Pe(){if(!("wakeLock"in navigator))return;const e=t.wakeLockEnabled&&!!t.current&&t.current.status!=="finalized"&&document.visibilityState==="visible";try{if(e&&!t.wakeLockSentinel){const a=await navigator.wakeLock.request("screen");t.wakeLockSentinel=a,a.addEventListener("release",()=>{t.wakeLockSentinel===a&&(t.wakeLockSentinel=null)})}else!e&&t.wakeLockSentinel&&(await t.wakeLockSentinel.release(),t.wakeLockSentinel=null)}catch{}}function L(){const e=!!t.current&&me(t.current.timers)&&document.visibilityState==="visible";e&&!G?G=window.setInterval(P,80):!e&&G&&(window.clearInterval(G),G=null),Pe()}function Te(){return t.students.find(e=>e.id===t.selectedStudentId)||null}function pe(e){return t.history.filter(a=>a.studentId===e)}function K(){return _(t.current?.faults||[])}function Aa(){const e=new Map;for(const a of t.current?.faults||[])a.faultId!=null&&e.set(a.faultId,(e.get(a.faultId)||0)+1);return e}function x(e){e!==t.screen&&(t.previousScreen=t.screen,t.screen=e),t.openFault=null,u(),window.scrollTo({top:0,behavior:"instant"in window?"instant":"auto"})}function A(e){t.toast=e;const a=document.querySelector("#toast-root");a?a.innerHTML=Fe():u(),e&&(window.clearTimeout(A.timer),A.timer=window.setTimeout(()=>{t.toast="";const n=document.querySelector("#toast-root");n&&(n.innerHTML="")},2500))}function I(e,a,{type:n="error",code:i=""}={}){t.userAlert={title:e,message:a,type:n,code:i},u()}function we(){t.userAlert&&(t.userAlert=null,u())}function $(e,a="general"){console.error(e);const n=xe(e,a);I(n.title,n.message,{type:"error",code:n.code})}function be(e){const a=["L","D","E"].includes(e)?e:"L";return`<span class="fault-tag fault-tag-${a}" title="${s(ne(a))}">${a}</span>`}function re(e,a=!1){return`<span class="status-badge ${e.noApto?"status-noapto":"status-apto"} ${a?"is-compact":""}">${e.result}</span>`}function wa(){if(!t.userAlert)return"";const e=t.userAlert;return`
    <div class="alert-banner alert-${s(e.type)}" role="alert" aria-live="assertive">
      <div class="alert-body">
        <strong>${s(e.title)}</strong>
        <p>${s(e.message)}</p>
        ${e.code?`<span class="alert-code">Ref: ${s(e.code)}</span>`:""}
      </div>
      <button type="button" class="btn btn-ghost btn-sm" data-action="clear-alert">Cerrar</button>
    </div>
  `}function La(){const a={home:"Registro PDA · Permiso B","student-new":"Alta de alumno",students:"Alumnos","student-detail":Te()?.name||"Ficha de alumno",sim:"Datos y tiempos",faults:"Catálogo de faltas",summary:"Informe de prueba",history:"Historial",settings:"Ajustes y copias"},n={home:"Evaluación práctica de circulación","student-new":"Nuevo expediente local",students:`${t.students.length} registrado${t.students.length===1?"":"s"}`,"student-detail":"Expediente e historial",sim:t.current?t.current.studentName||"Examen libre":"Sin prueba activa",faults:t.current?t.current.studentName||"Examen libre":"Consulta de criterios",summary:t.current?`${H(t.current.date)}${t.current.zone?` · ${t.current.zone}`:""}`:"Sin prueba activa",history:`${t.history.length} prueba${t.history.length===1?"":"s"} guardada${t.history.length===1?"":"s"}`,settings:"Almacenamiento local y respaldos"},i=t.screen!=="home",o=t.current?K():null,r=[["home","Inicio"],["students","Alumnos"],["sim","Prueba"],["faults","Faltas"],["summary","Informe"],["history","Historial"],["settings","Ajustes"]];return`
    <header class="topbar">
      <div class="topbar-inner">
        <div class="topbar-left">
          ${i?`<button type="button" class="icon-btn" data-action="go-back" aria-label="Volver">${c.back}</button>`:'<span class="brand-mark" aria-hidden="true">B</span>'}
          <div class="topbar-titles">
            <h1>${s(a[t.screen]||"Permiso B")}</h1>
            <p>${s(n[t.screen]||"")}</p>
          </div>
        </div>

        <nav class="desktop-nav" aria-label="Navegación principal">
          ${r.map(([l,d])=>`
            <button type="button" class="desktop-nav-link ${t.screen===l||l==="students"&&["student-detail","student-new"].includes(t.screen)?"is-active":""}" data-action="screen" data-screen="${l}">
              ${d}
            </button>
          `).join("")}
        </nav>

        ${o?`
          <button type="button" class="topbar-status ${o.noApto?"is-danger":"is-ok"}" data-action="screen" data-screen="summary" title="Ver informe de la prueba activa">
            <span class="topbar-counts">${o.L}L · ${o.D}D · ${o.E}E</span>
            <strong>${o.result}</strong>
          </button>
        `:""}
      </div>
    </header>
  `}function za(){if(!t.current||!["faults","students","history"].includes(t.screen))return"";const e=t.current,a=K(),n=e.timers.exam;return`
    <div class="exam-strip">
      <div class="exam-strip-inner">
        <button type="button" class="exam-strip-info" data-action="screen" data-screen="sim">
          <span class="exam-strip-dot ${n.running?"is-running":""}"></span>
          <strong class="exam-strip-name">${s(e.studentName||"Examen libre")}</strong>
          <span class="exam-strip-clock" data-timer-display="elapsed:exam:compact">${D(j(n),{showTenths:!1})}</span>
        </button>
        <div class="exam-strip-right">
          <span class="exam-strip-tally"><b>${a.L}</b>L · <b>${a.D}</b>D · <b>${a.E}</b>E</span>
          <button type="button" class="btn btn-xs ${n.running?"btn-amber":"btn-outline-light"}" data-action="${n.running?"timer-pause":"timer-start"}" data-timer="exam" aria-label="${n.running?"Pausar cronómetro":"Iniciar cronómetro"}">
            ${n.running?c.pause:c.play}
          </button>
        </div>
      </div>
    </div>
  `}function $a(){const e=t.current?.faults?.length||0;return`
    <nav class="bottom-nav" aria-label="Navegación inferior">
      ${[{screen:"home",label:"Inicio",icon:c.home},{screen:"students",label:"Alumnos",icon:c.users,match:["students","student-detail","student-new"]},{screen:"sim",label:"Prueba",icon:c.exam},{screen:"faults",label:"Faltas",icon:c.faults,count:e},{screen:"summary",label:"Informe",icon:c.summary}].map(n=>`
          <button type="button" class="bottom-nav-item ${(n.match?n.match.includes(t.screen):t.screen===n.screen)?"is-active":""}" data-action="screen" data-screen="${n.screen}">
            <span class="bottom-nav-icon">
              ${n.icon}
              ${n.count?`<em class="nav-counter">${n.count>99?"99+":n.count}</em>`:""}
            </span>
            <span class="bottom-nav-label">${n.label}</span>
          </button>
        `).join("")}
    </nav>
  `}function fe(e){return`
    <div class="score-strip" role="group" aria-label="Cómputo de faltas">
      <div class="score-cell score-cell-L">
        <span class="score-label">Leves <small>(máx. 9)</small></span>
        <strong class="score-num">${e.L}</strong>
      </div>
      <div class="score-cell score-cell-D">
        <span class="score-label">Deficientes <small>(máx. 1)</small></span>
        <strong class="score-num">${e.D}</strong>
      </div>
      <div class="score-cell score-cell-E">
        <span class="score-label">Eliminatorias <small>(0)</small></span>
        <strong class="score-num">${e.E}</strong>
      </div>
      <div class="score-cell">
        <span class="score-label">Total</span>
        <strong class="score-num">${e.total}</strong>
      </div>
    </div>
  `}function Sa(){return t.installedHintDismissed||va()?"":`
    <section class="notice-bar">
      <div>
        <strong>Acceso directo sin conexión</strong>
        <span>En Safari (iPhone) o Chrome (Android), usa «Añadir a pantalla de inicio» para usarla como aplicación nativa en el vehículo.</span>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" data-action="dismiss-install">Ocultar</button>
    </section>
  `}function Le(){const e=t.history.slice(0,4),a=t.history.filter(i=>!_(i.faults||[]).noApto).length;let n="";if(t.current){const i=t.current,o=K();n=`
      <section class="panel panel-highlight">
        <div class="panel-header">
          <div>
            <span class="section-tag">${i.status==="finalized"?"Prueba finalizada":"Prueba activa"}</span>
            <h2 class="panel-title">${s(i.studentName||"Examen libre sin alumno")}</h2>
            <p class="panel-sub">${H(i.date)}${i.zone?` · ${s(i.zone)}`:""} · Tiempo: <span data-timer-display="elapsed:exam:compact">${D(j(i.timers.exam),{showTenths:!1})}</span></p>
          </div>
          ${re(o)}
        </div>
        ${fe(o)}
        <div class="btn-row btn-row-3 mt-12">
          <button type="button" class="btn btn-primary" data-action="screen" data-screen="faults">${c.plus} Anotar faltas</button>
          <button type="button" class="btn btn-secondary" data-action="screen" data-screen="sim">${c.exam} Tiempos y datos</button>
          <button type="button" class="btn btn-secondary" data-action="screen" data-screen="summary">${c.summary} Informe</button>
        </div>
      </section>
    `}return`
    <main class="workspace">
      ${Sa()}
      ${n}

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Operaciones</h2>
          <span class="text-muted text-sm">${t.students.length} alumnos · ${t.history.length} pruebas (${a} aptas)</span>
        </div>
        <div class="action-grid">
          <button type="button" class="action-tile action-tile-primary" data-action="new-quick-simulation">
            <span class="tile-icon">${c.exam}</span>
            <span class="tile-text">
              <strong>Nueva prueba libre</strong>
              <small>Iniciar simulación inmediata sin ficha previa</small>
            </span>
          </button>
          <button type="button" class="action-tile" data-action="screen" data-screen="students">
            <span class="tile-icon">${c.users}</span>
            <span class="tile-text">
              <strong>Alumnos (${t.students.length})</strong>
              <small>Seleccionar alumno e iniciar evaluación</small>
            </span>
          </button>
          <button type="button" class="action-tile" data-action="screen" data-screen="student-new">
            <span class="tile-icon">${c.userPlus}</span>
            <span class="tile-text">
              <strong>Dar de alta alumno</strong>
              <small>Registrar nombre, contacto y observaciones</small>
            </span>
          </button>
          <button type="button" class="action-tile" data-action="screen" data-screen="history">
            <span class="tile-icon">${c.history}</span>
            <span class="tile-text">
              <strong>Historial de pruebas</strong>
              <small>Consultar, duplicar o exportar evaluaciones</small>
            </span>
          </button>
          <button type="button" class="action-tile action-tile-wide" data-action="screen" data-screen="settings">
            <span class="tile-icon">${c.settings}</span>
            <span class="tile-text">
              <strong>Copias de seguridad y ajustes</strong>
              <small>Exportar/importar datos JSON y opciones de pantalla en vehículo</small>
            </span>
          </button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Pruebas recientes</h2>
          ${t.history.length>4?`<button type="button" class="btn btn-ghost btn-sm" data-action="screen" data-screen="history">Ver todas (${t.history.length})</button>`:""}
        </div>
        ${e.length?`<div class="record-list">${e.map(ge).join("")}</div>`:F("Sin pruebas registradas","Inicia una prueba libre o da de alta un alumno para comenzar.")}
      </section>
    </main>
  `}function ja(){const e=t.studentDraft;return`
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Ficha de nuevo alumno</h2>
            <p class="panel-sub">Los datos quedan almacenados únicamente en este dispositivo.</p>
          </div>
        </div>
        <div class="form-stack">
          <label class="field">
            <span class="field-label">Nombre y apellidos <abbr title="Obligatorio">*</abbr></span>
            <input type="text" data-student-draft="name" value="${s(e.name)}" placeholder="Ej.: Laura Gómez Martín" autocomplete="off" />
          </label>
          <div class="field-grid-2">
            <label class="field">
              <span class="field-label">Teléfono</span>
              <input type="tel" data-student-draft="phone" value="${s(e.phone)}" placeholder="600 000 000" inputmode="tel" autocomplete="off" />
            </label>
            <label class="field">
              <span class="field-label">Correo electrónico</span>
              <input type="email" data-student-draft="email" value="${s(e.email)}" placeholder="alumno@ejemplo.es" inputmode="email" autocomplete="off" />
            </label>
          </div>
          <label class="field">
            <span class="field-label">Notas de seguimiento</span>
            <textarea data-student-draft="notes" placeholder="Puntos a reforzar, horario habitual, vehículo...">${s(e.notes)}</textarea>
          </label>
        </div>
        <div class="btn-row mt-16">
          <button type="button" class="btn btn-primary" data-action="create-student-and-exam">${c.exam} Guardar e iniciar prueba</button>
          <button type="button" class="btn btn-secondary" data-action="create-student">Guardar ficha</button>
        </div>
      </section>
    </main>
  `}function Ce(){const e=S(t.studentQuery),a=t.students.filter(n=>e?S(`${n.name} ${n.phone} ${n.email} ${n.notes}`).includes(e):!0);return a.length?`<div class="record-list">${a.map(Da).join("")}</div>`:F(t.students.length?"Ningún alumno coincide con la búsqueda":"No hay alumnos dados de alta",t.students.length?"Prueba con otro nombre o limpia el filtro.":"Pulsa «Alta alumno» para crear el primer expediente.")}function qa(){return`
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Listado de alumnos</h2>
            <p class="panel-sub">${t.students.length} expediente${t.students.length===1?"":"s"} en este dispositivo</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-action="screen" data-screen="student-new">${c.plus} Alta alumno</button>
        </div>
        <div class="search-box">
          <span class="search-icon">${c.search}</span>
          <input type="search" data-search="students" value="${s(t.studentQuery)}" placeholder="Buscar por nombre, teléfono o notas..." autocomplete="off" />
        </div>
        <div id="student-results-container" class="mt-12">
          ${Ce()}
        </div>
      </section>
    </main>
  `}function Da(e){const a=pe(e.id),n=a[0],i=n?_(n.faults||[]):null;return`
    <article class="record-row">
      <div class="record-main">
        <div class="record-title-line">
          <h3>${s(e.name||"Alumno sin nombre")}</h3>
          ${i?re(i,!0):'<span class="meta-pill">Sin pruebas</span>'}
        </div>
        <p class="record-meta">
          ${a.length} prueba${a.length===1?"":"s"}
          ${n?` · Última: ${H(n.date)}`:""}
          ${e.phone?` · ${s(e.phone)}`:""}
        </p>
      </div>
      <div class="record-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-action="view-student" data-id="${s(e.id)}">Ficha</button>
        <button type="button" class="btn btn-primary btn-sm" data-action="new-exam-student" data-id="${s(e.id)}">Iniciar prueba</button>
      </div>
    </article>
  `}function xa(){const e=Te();if(!e)return`
      <main class="workspace">
        <section class="panel">
          ${F("Ficha no encontrada","Selecciona un alumno desde el listado.")}
          <div class="btn-row mt-12">
            <button type="button" class="btn btn-secondary" data-action="screen" data-screen="students">Ir al listado de alumnos</button>
          </div>
        </section>
      </main>
    `;const a=pe(e.id),n=a.filter(i=>!_(i.faults||[]).noApto).length;return`
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <span class="section-tag">Expediente de alumno</span>
            <h2 class="panel-title" id="student-detail-heading">${s(e.name)}</h2>
            <p class="panel-sub">${a.length} prueba${a.length===1?"":"s"} realizada${a.length===1?"":"s"} (${n} apta${n===1?"":"s"}) · Guardado automático</p>
          </div>
          <button type="button" class="btn btn-primary" data-action="new-exam-student" data-id="${s(e.id)}">${c.exam} Nueva prueba</button>
        </div>

        <div class="form-stack mt-12">
          <div class="field-grid-2">
            <label class="field">
              <span class="field-label">Nombre y apellidos</span>
              <input type="text" data-student-field="name" data-id="${s(e.id)}" value="${s(e.name)}" autocomplete="off" />
            </label>
            <label class="field">
              <span class="field-label">Teléfono</span>
              <input type="tel" data-student-field="phone" data-id="${s(e.id)}" value="${s(e.phone)}" inputmode="tel" autocomplete="off" />
            </label>
          </div>
          <label class="field">
            <span class="field-label">Correo electrónico</span>
            <input type="email" data-student-field="email" data-id="${s(e.id)}" value="${s(e.email)}" inputmode="email" autocomplete="off" />
          </label>
          <label class="field">
            <span class="field-label">Notas pedagógicas</span>
            <textarea data-student-field="notes" data-id="${s(e.id)}" placeholder="Evolución, puntos débiles, maniobras pendientes...">${s(e.notes)}</textarea>
          </label>
        </div>

        <div class="panel-footer-danger">
          <span class="text-muted text-sm">Eliminar la ficha conserva sus exámenes en el historial general como pruebas libres.</span>
          <button type="button" class="btn btn-danger-outline btn-sm" data-action="delete-student" data-id="${s(e.id)}">${c.trash} Eliminar alumno</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Historial del alumno (${a.length})</h2>
        </div>
        ${a.length?`<div class="record-list">${a.map(ge).join("")}</div>`:F("Sin pruebas todavía","Pulsa «Nueva prueba» para registrar la primera simulación de este alumno.")}
      </section>
    </main>
  `}function ve(e){return`
    <main class="workspace">
      <section class="panel">
        ${F("No hay ninguna prueba activa",e)}
        <div class="btn-row mt-12">
          <button type="button" class="btn btn-primary" data-action="new-quick-simulation">${c.exam} Iniciar prueba libre</button>
          <button type="button" class="btn btn-secondary" data-action="screen" data-screen="students">${c.users} Elegir alumno</button>
        </div>
      </section>
    </main>
  `}function Ea(){if(!t.current)return ve("Inicia una prueba libre o selecciona un alumno para registrar tiempos y faltas.");p(t.current);const e=t.current,a=K(),n=e.studentId?t.students.find(i=>i.id===e.studentId):null;return`
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <span class="section-tag">${e.status==="finalized"?"Prueba cerrada":"Prueba en curso"}</span>
            <h2 class="panel-title" id="sim-student-heading">${s(e.studentName||"Examen libre sin alumno")}</h2>
            <p class="panel-sub">${n?"Vinculado a expediente de alumno":"Sin vincular a ficha de alumno"}</p>
          </div>
          ${re(a)}
        </div>
        ${fe(a)}
        <div class="btn-row mt-12">
          <button type="button" class="btn btn-primary" data-action="screen" data-screen="faults">${c.plus} Añadir faltas (${e.faults.length})</button>
          <button type="button" class="btn btn-secondary" data-action="screen" data-screen="summary">${c.summary} Ver informe / PDF</button>
        </div>
      </section>

      ${Na()}

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Datos identificativos de la prueba</h2>
        </div>
        <div class="form-stack">
          ${n?`
            <div class="linked-banner">
              <div>
                <span class="field-label">Alumno asignado</span>
                <strong>${s(n.name)}</strong>
              </div>
              <div class="btn-row-inline">
                <button type="button" class="btn btn-secondary btn-sm" data-action="view-student" data-id="${s(n.id)}">Ver ficha</button>
                <button type="button" class="btn btn-ghost btn-sm" data-action="unlink-student">Desvincular</button>
              </div>
            </div>
          `:`
            <label class="field">
              <span class="field-label">Alumno/a</span>
              <input type="text" data-field="studentName" value="${s(e.studentName)}" placeholder="Nombre del aspirante" autocomplete="off" list="students-datalist" />
              <datalist id="students-datalist">
                ${t.students.map(i=>`<option value="${s(i.name)}"></option>`).join("")}
              </datalist>
            </label>
          `}

          <div class="field-grid-2">
            <label class="field">
              <span class="field-label">Fecha</span>
              <input type="date" data-field="date" value="${s(e.date)}" />
            </label>
            <label class="field">
              <span class="field-label">Zona / recorrido</span>
              <input type="text" data-field="zone" value="${s(e.zone)}" placeholder="Ej.: Centro exámenes / Ruta 3" autocomplete="off" />
            </label>
          </div>

          <div class="field-grid-2">
            <label class="field">
              <span class="field-label">Profesor/a evaluador</span>
              <input type="text" data-field="teacher" value="${s(e.teacher)}" placeholder="Opcional" autocomplete="off" />
            </label>
            <label class="field">
              <span class="field-label">Vehículo / matrícula</span>
              <input type="text" data-field="vehicle" value="${s(e.vehicle)}" placeholder="Ej.: 1234 MNP" autocomplete="off" />
            </label>
          </div>

          <label class="field">
            <span class="field-label">Observaciones generales de circulación</span>
            <textarea data-field="generalNotes" placeholder="Valoración general, fluidez, adaptación al tráfico, autonomía...">${s(e.generalNotes)}</textarea>
          </label>
        </div>
      </section>
    </main>
  `}function ee(e){p(t.current);const a=t.current.timers[e];if(e==="exam"){const n=j(a);return a.running?`
        <button type="button" class="btn btn-amber btn-sm" data-action="timer-pause" data-timer="exam">${c.pause} Pausar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="timer-reset" data-timer="exam">${c.reset} Reiniciar</button>`:n>0?`
        <button type="button" class="btn btn-primary btn-sm" data-action="timer-start" data-timer="exam">${c.play} Reanudar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="timer-reset" data-timer="exam">${c.reset} Reiniciar</button>`:`<button type="button" class="btn btn-success btn-sm" data-action="timer-start" data-timer="exam">${c.play} Iniciar</button>`}if(e==="parking"){const n=j(a);return a.running?`
        <button type="button" class="btn btn-secondary btn-sm" data-action="timer-save-record">${c.flag} Guardar</button>
        <button type="button" class="btn btn-amber btn-sm" data-action="timer-pause" data-timer="parking">${c.pause} Pausar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="timer-reset" data-timer="parking">${c.reset}</button>`:n>0?`
        <button type="button" class="btn btn-secondary btn-sm" data-action="timer-save-record">${c.flag} Guardar</button>
        <button type="button" class="btn btn-primary btn-sm" data-action="timer-start" data-timer="parking">${c.play} Seguir</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="timer-reset" data-timer="parking">${c.reset}</button>`:`<button type="button" class="btn btn-success btn-sm" data-action="timer-start" data-timer="parking">${c.play} Iniciar</button>`}if(e==="countdown"){const n=E(a),i=n<=0&&!a.running;return a.running?`
        <button type="button" class="btn btn-amber btn-sm" data-action="countdown-pause">${c.pause} Pausar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="countdown-reset">${c.reset} Reiniciar</button>`:i?`<button type="button" class="btn btn-primary btn-sm" data-action="countdown-reset">${c.reset} Restablecer</button>`:n<a.durationMs?`
        <button type="button" class="btn btn-primary btn-sm" data-action="countdown-start">${c.play} Reanudar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="countdown-reset">${c.reset} Reiniciar</button>`:`<button type="button" class="btn btn-success btn-sm" data-action="countdown-start">${c.play} Iniciar (${ue(a)}m)</button>`}return""}function ae(e,a){if(e==="countdown"){const i=E(a)<=0&&!a.running;return a.running?'<span class="timer-chip is-running">Activo</span>':i?'<span class="timer-chip is-finished">Tiempo agotado</span>':E(a)<a.durationMs?'<span class="timer-chip is-paused">En pausa</span>':'<span class="timer-chip">Preparado</span>'}const n=j(a);return a.running?'<span class="timer-chip is-running">En marcha</span>':n>0?'<span class="timer-chip is-paused">Pausado</span>':'<span class="timer-chip">En cero</span>'}function B(e){if(!t.current)return;p(t.current);const a=t.current.timers[e],n=document.querySelector(`[data-timer-buttons="${e}"]`);n&&(n.innerHTML=ee(e));const i=document.querySelector(`[data-timer-status="${e}"]`);i&&(i.innerHTML=ae(e,a))}function Na(){p(t.current);const{exam:e,parking:a,countdown:n}=t.current.timers,i=E(n)<=0&&!n.running;return`
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Control de tiempos</h2>
          <p class="panel-sub">La duración oficial habitual de circulación para permiso B es de 25 min.</p>
        </div>
        ${"wakeLock"in navigator?`
          <label class="switch-inline" title="Evita que el teléfono apague la pantalla durante el examen">
            <input type="checkbox" data-toggle="wake-lock" ${t.wakeLockEnabled?"checked":""} />
            <span>Pantalla activa</span>
          </label>
        `:""}
      </div>

      <div class="timers-grid">
        <article class="timer-box">
          <div class="timer-box-top">
            <span class="timer-box-label">Examen general</span>
            <span data-timer-status="exam">${ae("exam",e)}</span>
          </div>
          <div class="clock-readout" data-timer-display="elapsed:exam">${D(j(e))}</div>
          <div class="timer-controls" data-timer-buttons="exam">${ee("exam")}</div>
        </article>

        <article class="timer-box">
          <div class="timer-box-top">
            <input type="text" class="inline-label-input" data-timer-input="parkingLabel" value="${s(a.label||"Maniobra")}" aria-label="Nombre de la maniobra" placeholder="Maniobra" autocomplete="off" />
            <span data-timer-status="parking">${ae("parking",a)}</span>
          </div>
          <div class="clock-readout" data-timer-display="elapsed:parking">${D(j(a))}</div>
          <div class="timer-controls" data-timer-buttons="parking">${ee("parking")}</div>
        </article>

        <article class="timer-box timer-box-wide ${i?"is-expired":""}">
          <div class="timer-box-top">
            <span class="timer-box-label">Cuenta atrás programada</span>
            <span data-timer-status="countdown">${ae("countdown",n)}</span>
          </div>
          <div class="countdown-layout">
            <div class="clock-readout" data-timer-display="remaining:countdown">${D(E(n))}</div>
            <div class="countdown-config">
              <div class="preset-group" role="group" aria-label="Duración rápida">
                ${[20,25,30,45].map(r=>`
                  <button type="button" class="chip-btn ${ue(n)===r?"is-active":""}" data-action="set-countdown" data-minutes="${r}">${r} min</button>
                `).join("")}
                <label class="custom-min-input" title="Minutos personalizados">
                  <input type="number" min="1" max="180" step="1" data-timer-input="countdownMinutes" value="${ue(n)}" aria-label="Minutos cuenta atrás" />
                  <span>min</span>
                </label>
              </div>
              <div class="timer-controls" data-timer-buttons="countdown">${ee("countdown")}</div>
            </div>
          </div>
        </article>
      </div>

      ${a.records.length?`
        <div class="saved-times-list">
          <div class="saved-times-head">Maniobras guardadas (${a.records.length})</div>
          ${a.records.map(r=>`
            <div class="saved-time-row">
              <div>
                <strong>${s(r.label||"Maniobra")}</strong>
                <span class="text-muted text-xs">${H(r.createdAt)}</span>
              </div>
              <div class="saved-time-right">
                <span class="mono-time">${D(r.elapsedMs)}</span>
                <button type="button" class="btn btn-ghost btn-xs text-danger" data-action="remove-time-record" data-id="${s(r.id)}" aria-label="Borrar tiempo">${c.trash}</button>
              </div>
            </div>
          `).join("")}
        </div>
      `:""}
    </section>
  `}function Ma(){const e=S(t.query).trim(),a=t.filter,n=W.filter(o=>a==="ALL"||o.tipo===a?e?S(`${o.id} ${o.falta} ${o.obs} ${o.bloque} ${o.nivel}`).includes(e):!0:!1),i=new Map;return n.forEach(o=>{i.has(o.bloque)||i.set(o.bloque,[]),i.get(o.bloque).push(o)}),i}function Oe(){const e=Ma(),a=Aa(),n=!!t.query.trim()||t.filter!=="ALL";return e.size?[...e.entries()].map(([i,o])=>{const r=n||t.openBlocks.has(i),l=o.reduce((d,f)=>d+(a.get(f.id)||0),0);return`
      <details class="fault-group" data-block="${s(i)}" ${r?"open":""}>
        <summary class="fault-group-header">
          <span class="fault-group-title">${s(i)}</span>
          <span class="fault-group-badges">
            ${l>0?`<span class="marked-pill">${l} marcada${l===1?"":"s"}</span>`:""}
            <span class="count-pill">${o.length}</span>
          </span>
        </summary>
        <div class="fault-group-body">
          ${o.map(d=>{const f=a.get(d.id)||0;return`
              <div class="catalog-row ${f>0?"is-marked":""}">
                <button type="button" class="catalog-row-main" data-action="open-fault" data-id="${d.id}">
                  ${be(d.tipo)}
                  <span class="catalog-row-text">
                    <span class="catalog-row-title">
                      ${s(d.falta)}
                      ${f>0?`<em class="fault-hit-count" data-fault-count="${d.id}">×${f}</em>`:""}
                    </span>
                    ${d.obs?`<small class="catalog-row-obs">${s(d.obs)}</small>`:""}
                  </span>
                </button>
                <button type="button" class="quick-add-btn" data-action="quick-add-fault" data-id="${d.id}" title="Anotar +1 falta directamente" aria-label="Anotar falta: ${s(d.falta)}">
                  ${c.plus}
                </button>
              </div>
            `}).join("")}
        </div>
      </details>
    `}).join(""):`
      <div class="panel">
        ${F("Sin coincidencias en el catálogo","Prueba con otros términos (ej.: retrovisor, intermitente, carril, ceda) o restablece el filtro.")}
        <div class="btn-row mt-12">
          <button type="button" class="btn btn-secondary btn-sm" data-action="reset-fault-filters">Limpiar búsqueda y filtro</button>
        </div>
      </div>
    `}function Ia(){if(!t.current)return ve("Debes tener una prueba abierta para imputar faltas del catálogo oficial.");const e=[["ALL","Todas"],["L","Leves (L)"],["D","Deficientes (D)"],["E","Eliminatorias (E)"]];return`
    <main class="workspace">
      <section class="sticky-filter-bar">
        <div class="search-box">
          <span class="search-icon">${c.search}</span>
          <input type="search" id="fault-search-input" data-search="faults" value="${s(t.query)}" placeholder="Buscar criterio (intermitente, prioridad, embrague...)" autocomplete="off" />
          ${t.query?`<button type="button" class="search-clear" data-action="clear-fault-query" aria-label="Borrar búsqueda">${c.close}</button>`:""}
        </div>
        <div class="segmented-row" role="tablist" aria-label="Filtrar por gravedad">
          ${e.map(([a,n])=>`
            <button type="button" class="seg-btn ${t.filter===a?"is-active":""} seg-${a}" data-action="filter" data-filter="${a}">
              ${n}
            </button>
          `).join("")}
        </div>
      </section>

      <section id="fault-blocks-container" class="fault-groups-stack">
        ${Oe()}
      </section>

      ${ka()}
    </main>
  `}function ka(){if(!t.openFault)return"";const e=V.get(t.openFault);if(!e)return"";const a=(t.current?.faults||[]).filter(n=>n.faultId===e.id).length;return`
    <div class="sheet-backdrop" data-action="close-sheet"></div>
    <section class="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-fault-title">
      <div class="sheet-header">
        <div class="sheet-meta">
          ${be(e.tipo)}
          <span>${s(e.bloque)} · Falta ${s(ne(e.tipo).toLowerCase())}</span>
        </div>
        <button type="button" class="icon-btn icon-btn-light" data-action="close-sheet" aria-label="Cerrar">${c.close}</button>
      </div>

      <h2 id="sheet-fault-title" class="sheet-title">${s(e.falta)}</h2>
      ${e.obs?`<p class="sheet-criterion">${s(e.obs)}</p>`:""}
      ${a>0?`<p class="sheet-already">Ya anotada <strong>${a}</strong> ${a===1?"vez":"veces"} en esta prueba.</p>`:""}

      <label class="field mt-12">
        <span class="field-label">Observación concreta (ubicación, maniobra o detalle)</span>
        <textarea id="fault-note" rows="3" placeholder="Ej.: Glorieta Av. Europa, no observa retrovisor izquierdo..."></textarea>
      </label>

      <div class="btn-row mt-16">
        <button type="button" class="btn btn-primary" data-action="add-fault-continue" data-id="${e.id}">${c.plus} Añadir y seguir en catálogo</button>
        <button type="button" class="btn btn-secondary" data-action="add-fault" data-id="${e.id}">Añadir e ir al informe</button>
      </div>
    </section>
  `}function Pa(){if(!t.current)return ve("Abre una prueba del historial o inicia una nueva para generar su informe.");p(t.current);const e=t.current,a=K(),n=e.timers,i=n.parking?.records||[];return`
    <main class="workspace print-sheet">
      <section class="panel report-header-panel">
        <div class="report-top">
          <div>
            <span class="section-tag">Informe de simulación · Permiso B</span>
            <h2 class="report-student">${s(e.studentName||"Aspirante sin identificar")}</h2>
            <p class="panel-sub">
              Fecha: <strong>${H(e.date)}</strong>
              ${e.zone?` · Recorrido: <strong>${s(e.zone)}</strong>`:""}
              ${e.vehicle?` · Vehículo: <strong>${s(e.vehicle)}</strong>`:""}
              ${e.teacher?` · Evaluador: <strong>${s(e.teacher)}</strong>`:""}
            </p>
          </div>
          <div class="verdict-box ${a.noApto?"is-noapto":"is-apto"}">
            <strong>${a.result}</strong>
            <small>${e.status==="finalized"?"Prueba cerrada":"Resultado provisional"}</small>
          </div>
        </div>

        ${a.reasons.length?`
          <div class="verdict-reasons">
            <strong>Causa de calificación NO APTO:</strong> ${s(a.reasons.join(" · "))}.
          </div>
        `:""}

        ${fe(a)}

        <div class="btn-row wrap mt-16 no-print">
          <button type="button" class="btn btn-primary" data-action="pdf" ${t.pdfBusy?"disabled":""}>
            ${c.download} ${t.pdfBusy?"Generando PDF...":"Descargar PDF"}
          </button>
          <button type="button" class="btn btn-secondary" data-action="print">${c.print} Imprimir</button>
          ${e.status==="finalized"?`
            <button type="button" class="btn btn-secondary" data-action="reopen">${c.exam} Reabrir edición</button>
          `:`
            <button type="button" class="btn btn-success" data-action="finalize">${c.check} Finalizar prueba</button>
          `}
          <button type="button" class="btn btn-ghost" data-action="screen" data-screen="faults">${c.plus} Añadir falta</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Tiempos registrados</h2>
        </div>
        <div class="summary-times-row">
          <div class="summary-time-item">
            <span>Duración circulación</span>
            <strong data-timer-display="elapsed:exam">${D(j(n.exam))}</strong>
          </div>
          <div class="summary-time-item">
            <span>${s(n.parking?.label||"Maniobra")}</span>
            <strong data-timer-display="elapsed:parking">${D(j(n.parking))}</strong>
          </div>
          <div class="summary-time-item">
            <span>Cuenta atrás restante</span>
            <strong data-timer-display="remaining:countdown">${D(E(n.countdown))}</strong>
          </div>
        </div>
        ${i.length?`
          <div class="saved-times-list mt-12">
            ${i.map(o=>`
              <div class="saved-time-row">
                <strong>${s(o.label||"Maniobra")}</strong>
                <span class="mono-time">${D(o.elapsedMs)}</span>
              </div>
            `).join("")}
          </div>
        `:""}
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Faltas calificadas (${e.faults.length})</h2>
          ${e.faults.length?`<button type="button" class="btn btn-danger-outline btn-sm no-print" data-action="clear-current">${c.trash} Vaciar faltas</button>`:""}
        </div>
        ${e.faults.length?`
          <div class="marked-faults-list">
            ${e.faults.map((o,r)=>Ta(o,r)).join("")}
          </div>
        `:'<p class="text-muted no-margin">No se han registrado faltas en esta prueba.</p>'}
      </section>

      ${e.generalNotes?`
        <section class="panel">
          <h2 class="panel-title">Observaciones generales</h2>
          <p class="notes-paragraph">${s(e.generalNotes)}</p>
        </section>
      `:""}
    </main>
  `}function Ta(e,a){const n=e.snapshot||V.get(e.faultId)||e,i=n.tipo||e.tipo||"L";return`
    <article class="marked-fault-item">
      <div class="marked-fault-body">
        <div class="marked-fault-head">
          <span class="marked-index">${a+1}.</span>
          ${be(i)}
          <h3>${s(n.falta||"Falta registrada")}</h3>
        </div>
        <p class="marked-fault-meta">${s(n.bloque||"General")} · ${s(ne(i))}</p>
        ${n.obs?`<p class="marked-fault-obs">${s(n.obs)}</p>`:""}
        ${e.note?`<p class="marked-fault-note"><strong>Nota:</strong> ${s(e.note)}</p>`:""}
      </div>
      <button type="button" class="btn btn-ghost btn-sm text-danger no-print" data-action="remove-fault" data-index="${a}" aria-label="Quitar falta">Quitar</button>
    </article>
  `}function Re(){const e=S(t.historyQuery).trim(),a=t.historyFilter,n=t.history.filter(i=>{const o=_(i.faults||[]);return a==="APTO"&&o.noApto||a==="NO_APTO"&&!o.noApto||a==="DRAFT"&&i.status==="finalized"?!1:e?S(`${i.studentName} ${i.zone} ${i.teacher} ${i.vehicle} ${i.date}`).includes(e):!0});return n.length?`<div class="record-list">${n.map(ge).join("")}</div>`:F(t.history.length?"Ninguna prueba coincide con el filtro":"No hay pruebas guardadas",t.history.length?"Cambia el filtro o el texto de búsqueda.":"Las pruebas que inicies quedarán registradas aquí.")}function Ca(){const e=[["ALL","Todas"],["APTO","Aptas"],["NO_APTO","No aptas"],["DRAFT","En curso"]];return`
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Historial de evaluaciones</h2>
            <p class="panel-sub">${t.history.length} prueba${t.history.length===1?"":"s"} almacenada${t.history.length===1?"":"s"} en el navegador</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-action="new-quick-simulation">${c.plus} Prueba libre</button>
        </div>

        <div class="search-box">
          <span class="search-icon">${c.search}</span>
          <input type="search" data-search="history" value="${s(t.historyQuery)}" placeholder="Buscar por alumno, recorrido, vehículo..." autocomplete="off" />
        </div>

        <div class="segmented-row mt-8">
          ${e.map(([a,n])=>`
            <button type="button" class="seg-btn ${t.historyFilter===a?"is-active":""}" data-action="history-filter" data-filter="${a}">${n}</button>
          `).join("")}
        </div>

        <div id="history-results-container" class="mt-12">
          ${Re()}
        </div>
      </section>
    </main>
  `}function ge(e){const a=_(e.faults||[]),n=e.studentId?t.students.find(o=>o.id===e.studentId):null,i=t.current?.id===e.id;return`
    <article class="record-row ${i?"is-current-row":""}">
      <div class="record-main">
        <div class="record-title-line">
          <h3>${s(e.studentName||n?.name||"Prueba libre sin alumno")}</h3>
          ${re(a,!0)}
          ${i?'<span class="meta-pill is-blue">Abierta</span>':""}
        </div>
        <p class="record-meta">
          ${H(e.date)}
          ${e.zone?` · ${s(e.zone)}`:""}
          · <strong>${a.L}L · ${a.D}D · ${a.E}E</strong>
          · ${e.status==="finalized"?"Finalizada":"Borrador"}
        </p>
      </div>
      <div class="record-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-action="load-simulation" data-id="${s(e.id)}">Abrir</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="duplicate" data-id="${s(e.id)}">Duplicar</button>
        <button type="button" class="btn btn-ghost btn-sm text-danger" data-action="delete" data-id="${s(e.id)}" aria-label="Borrar prueba">${c.trash}</button>
      </div>
    </article>
  `}function Oa(){const e="wakeLock"in navigator;return`
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Copias de seguridad (JSON)</h2>
            <p class="panel-sub">Todos los alumnos y exámenes se guardan localmente en IndexedDB de este navegador. Exporta una copia periódicamente para no perder datos si borras el historial de Safari o Chrome.</p>
          </div>
        </div>
        <div class="btn-row wrap">
          <button type="button" class="btn btn-primary" data-action="export-all">${c.download} Exportar copia completa</button>
          <button type="button" class="btn btn-secondary" data-action="export-json" ${t.current?"":"disabled"}>${c.download} Exportar prueba activa</button>
          <label class="btn btn-secondary file-upload-btn" for="import-json-file">
            ${c.upload} Importar copia JSON
          </label>
          <input id="import-json-file" type="file" accept="application/json,.json" data-import="json" class="sr-only-input" />
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Preferencias en el vehículo</h2>
        <div class="setting-item">
          <div>
            <strong>Mantener pantalla encendida en examen</strong>
            <p class="text-muted text-sm no-margin">
              ${e?"Impide el bloqueo automático de pantalla mientras tengas una prueba abierta.":"Tu navegador actual no soporta la API Screen Wake Lock. Ajusta el bloqueo automático en Ajustes del teléfono."}
            </p>
          </div>
          <label class="switch-inline">
            <input type="checkbox" data-toggle="wake-lock" ${t.wakeLockEnabled?"checked":""} ${e?"":"disabled"} />
            <span>${t.wakeLockEnabled?"Activado":"Desactivado"}</span>
          </label>
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Criterios de calificación (Permiso B)</h2>
        <ul class="rules-list">
          <li><strong>NO APTO directo:</strong> 1 falta eliminatoria (<strong>E</strong>), 2 faltas deficientes (<strong>D</strong>), 1 deficiente + 5 leves (<strong>1D + 5L</strong>) o 10 faltas leves (<strong>10L</strong>).</li>
          <li><strong>Catálogo cargado:</strong> ${W.length} criterios oficiales distribuidos por bloques de maniobra y circulación.</li>
          <li><strong>Instalación móvil:</strong> En iOS (Safari → Compartir → Añadir a pantalla de inicio) o Android (Chrome → Instalar aplicación) sobre conexión HTTPS o red local.</li>
        </ul>
      </section>
    </main>
  `}function F(e,a){return`
    <div class="empty-box">
      <strong>${s(e)}</strong>
      <p>${s(a)}</p>
    </div>
  `}function Fe(){return t.toast?`<div class="toast-pill" role="status" aria-live="polite">${s(t.toast)}</div>`:""}function u(){const e={home:Le,"student-new":ja,students:qa,"student-detail":xa,sim:Ea,faults:Ia,summary:Pa,history:Ca,settings:Oa};U.innerHTML=`
    ${La()}
    ${za()}
    <div class="alerts-container">${wa()}</div>
    ${(e[t.screen]||Le)()}
    ${$a()}
    <div id="toast-root">${Fe()}</div>
  `,P(),L()}async function q(){t.students=(await na()).map(ha).filter(Boolean),t.history=(await aa()).map(p).filter(Boolean)}async function m(){if(t.current){if(p(t.current),t.current.updatedAt=g(),t.current.studentId){const e=t.students.find(a=>a.id===t.current.studentId);e&&(t.current.studentName=e.name)}await J(t.current),await R("currentSimulationId",t.current.id),await q()}}let ze;function Be(e=300){window.clearTimeout(ze),ze=window.setTimeout(()=>{m().catch(a=>$(a,"save"))},e)}let $e;function Ra(e,a=300){window.clearTimeout($e),$e=window.setTimeout(async()=>{try{e.updatedAt=g(),await Y(e),await q(),t.current?.studentId===e.id&&(t.current.studentName=e.name,await m())}catch(n){$(n,"save")}},a)}async function he(){if(!t.current)return!0;if(me(t.current.timers)){if(!window.confirm("La prueba actual tiene un cronómetro en marcha. ¿Pausarlo y cambiar de prueba?"))return!1;Z(t.current.timers)}return await m(),!0}async function _e(e,{immediate:a=!1}={}){const n=e.dataset.field;if(!(!n||!t.current)){if(t.current[n]=e.value,n==="studentName"){const i=document.querySelector("#sim-student-heading");i&&(i.textContent=t.current.studentName||"Examen libre sin alumno");const o=document.querySelector(".topbar-titles p");o&&t.screen==="sim"&&(o.textContent=t.current.studentName||"Examen libre")}if(a){if(n==="studentName"&&!t.current.studentId){const i=t.students.find(o=>S(o.name)===S(e.value.trim()));i&&(t.current.studentId=i.id,t.current.studentName=i.name)}await m()}else Be()}}function Fa(e){const a=e.dataset.studentDraft;a&&(t.studentDraft[a]=e.value)}async function He(e,{immediate:a=!1}={}){const n=e.dataset.id,i=e.dataset.studentField,o=t.students.find(r=>r.id===n);if(!(!o||!i)){if(o[i]=e.value,i==="name"){const r=document.querySelector("#student-detail-heading");r&&(r.textContent=o.name||"Ficha de alumno");const l=document.querySelector(".topbar-titles h1");l&&t.screen==="student-detail"&&(l.textContent=o.name||"Ficha de alumno")}a?(o.updatedAt=g(),await Y(o),await q(),t.current?.studentId===o.id&&(t.current.studentName=o.name,await m())):Ra(o)}}function Ue(e,{immediate:a=!1}={}){if(!t.current)return;p(t.current);const n=e.dataset.timerInput;n==="parkingLabel"&&(t.current.timers.parking.label=e.value),n==="countdownMinutes"&&Qe(e.value,{renderAfter:a}),a?m().catch(i=>$(i,"save")):Be()}async function Se({startExam:e=!1}={}){const a=String(t.studentDraft.name||"").trim();if(!a){I("Nombre obligatorio","Introduce el nombre y apellidos del alumno para guardar su expediente.",{code:"STUDENT_NAME_REQUIRED"});return}const n=t.students.find(o=>S(o.name)===S(a));if(n&&!window.confirm(`Ya existe un alumno llamado «${n.name}». ¿Quieres crear otra ficha distinta igualmente?`))return;const i=Ie({name:a,phone:String(t.studentDraft.phone||"").trim(),email:String(t.studentDraft.email||"").trim(),notes:String(t.studentDraft.notes||"").trim()});await Y(i),t.studentDraft=Me(),await q(),t.selectedStudentId=i.id,A("Ficha de alumno guardada"),e?await Ve(i.id):x("student-detail")}async function Ba(e){const a=t.students.find(o=>o.id===e);if(!a)return;const n=pe(e),i=n.length?`¿Eliminar la ficha de «${a.name}»? Sus ${n.length} prueba(s) se conservarán en el historial general como pruebas libres.`:`¿Eliminar la ficha de «${a.name}»?`;if(window.confirm(i)){for(const o of n)o.studentId=null,o.studentName||(o.studentName=a.name),await J(o);t.current?.studentId===e&&(t.current.studentId=null,t.current.studentName||(t.current.studentName=a.name),await m()),await ta(e),t.selectedStudentId===e&&(t.selectedStudentId=null),await q(),A("Ficha de alumno eliminada"),x("students")}}async function Ve(e){if(!await he())return;const n=t.students.find(i=>i.id===e)||await De(e);if(!n){I("Alumno no encontrado","No se ha encontrado la ficha del alumno seleccionado.",{code:"STUDENT_NOT_FOUND"});return}t.current=p(ke(n)),t.selectedStudentId=n.id,await m(),x("sim")}async function _a(){if(t.current&&t.current.status!=="finalized"&&(t.current.faults?.length||t.current.studentName||me(t.current.timers))){if(!window.confirm("¿Iniciar una prueba nueva? La prueba actual quedará guardada en el historial."))return;Z(t.current.timers),await m()}t.current=p(ke()),await m(),x("sim")}async function Ha(e){const a=t.students.find(n=>n.id===e)||await De(e);if(!a){I("Alumno no encontrado","El expediente solicitado ya no existe.",{code:"STUDENT_NOT_FOUND"});return}t.selectedStudentId=a.id,x("student-detail")}async function de(e,{note:a="",goSummary:n=!1}={}){if(!t.current)return;const i=V.get(Number(e));if(!i){I("Criterio no encontrado","La falta seleccionada no figura en el catálogo.",{code:"FAULT_CATALOG_NOT_FOUND"});return}t.current.status==="finalized"&&(t.current.status="draft"),t.current.faults.push({uid:w("fault"),faultId:i.id,tipo:i.tipo,note:a,snapshot:{...i},createdAt:g()}),t.openFault=null,await m(),A(`+1 ${ne(i.tipo)}: ${i.falta.slice(0,42)}${i.falta.length>42?"…":""}`),n?x("summary"):u()}function Ge(e,a){if(!t.current?.timers?.[e])return null;const n=t.current.timers[e];return a&&!n.running&&(t.current.status==="finalized"&&(t.current.status="draft"),n.running=!0,n.startedAt=oe()),!a&&n.running&&(n.elapsedMs=j(n),n.running=!1,n.startedAt=null),n}async function Ua(e){t.current&&(p(t.current),Ge(e,!0),await m(),L(),t.screen==="sim"?(P(),B(e)):u())}async function Va(e){t.current&&(p(t.current),Ge(e,!1),await m(),L(),t.screen==="sim"?(P(),B(e)):u())}async function Ga(e){if(!t.current)return;p(t.current);const a=t.current.timers[e];a&&(a.elapsedMs=0,a.running=!1,a.startedAt=null,await m(),L(),P(),B(e))}async function Qa(){if(!t.current)return;p(t.current);const e=t.current.timers.parking,a=j(e);if(a<=0){I("Cronómetro en cero","Inicia el cronómetro de maniobra antes de guardar una marca.",{code:"NO_TIME_TO_SAVE"});return}e.records.unshift({id:w("time"),label:String(e.label||"Maniobra").trim()||"Maniobra",elapsedMs:a,note:"",createdAt:g()}),e.elapsedMs=0,e.running=!1,e.startedAt=null,await m(),L(),A("Tiempo de maniobra registrado"),u()}async function Wa(e){t.current&&(p(t.current),t.current.timers.parking.records=t.current.timers.parking.records.filter(a=>a.id!==e),await m(),u())}function Qe(e,{renderAfter:a=!1}={}){if(!t.current)return;p(t.current);const n=la(e),i=t.current.timers.countdown;i.durationMs=n*60*1e3,i.remainingMs=i.durationMs,i.running=!1,i.startedAt=null,i.endedAt=null,L(),a&&u()}async function Ja(){if(!t.current)return;p(t.current),t.current.status==="finalized"&&(t.current.status="draft");const e=t.current.timers.countdown;E(e)<=0&&(e.remainingMs=e.durationMs),e.running=!0,e.startedAt=oe(),e.endedAt=null,await m(),L();const a=document.querySelector(".timer-box-wide");a&&a.classList.remove("is-expired"),P(),B("countdown")}async function Ya(){if(!t.current)return;p(t.current);const e=t.current.timers.countdown;e.remainingMs=E(e),e.running=!1,e.startedAt=null,await m(),L(),P(),B("countdown")}async function Za(){if(!t.current)return;p(t.current);const e=t.current.timers.countdown;e.remainingMs=e.durationMs,e.running=!1,e.startedAt=null,e.endedAt=null,await m(),L();const a=document.querySelector(".timer-box-wide");a&&a.classList.remove("is-expired"),P(),B("countdown")}function P(){if(!t.current)return;p(t.current);const e=t.current.timers;document.querySelectorAll("[data-timer-display]").forEach(n=>{const[i,o,r]=n.dataset.timerDisplay.split(":"),l=e[o];if(!l)return;const d=i==="remaining"?E(l):j(l);n.innerHTML=D(d,{showTenths:r!=="compact"})});const a=e.countdown;if(a?.running&&E(a)<=0){a.running=!1,a.remainingMs=0,a.startedAt=null,a.endedAt=g(),L(),m().catch(i=>$(i,"save")),ya(),A("Tiempo de cuenta atrás cumplido");const n=document.querySelector(".timer-box-wide");n&&n.classList.add("is-expired"),B("countdown")}}async function Ka(e){if(t.current?.id!==e&&!await he())return;const a=await te(e);if(!a){I("Prueba no encontrada","El examen seleccionado ya no se encuentra en la base de datos.",{code:"SIMULATION_NOT_FOUND"});return}t.current=p(a),t.selectedStudentId=a.studentId||null,await R("currentSimulationId",a.id),x(a.status==="finalized"?"summary":"sim")}async function Xa(e){if(!await he())return;const n=await te(e);if(!n){I("No se pudo duplicar","El examen original no existe o no se pudo leer.",{code:"DUPLICATE_NOT_FOUND"});return}const i=ie(n.timers,{makeId:w,nowIso:g});Z(i);const o=p({...n,id:w("sim"),date:Q(),timers:i,faults:(n.faults||[]).map(r=>({...r,uid:w("fault")})),status:"draft",createdAt:g(),updatedAt:g()});await J(o),t.current=o,t.selectedStudentId=o.studentId||null,await q(),await R("currentSimulationId",o.id),A("Prueba duplicada"),x("sim")}function je(e,a){const n=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(n),o=document.createElement("a");o.href=i,o.download=a,document.body.append(o),o.click(),o.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),1e3)}async function We(){await q();const e=new Map(t.students.map(n=>[S(n.name),n]));let a=!1;for(const n of t.history){if(n.studentId||!String(n.studentName||"").trim())continue;const i=S(n.studentName.trim());let o=e.get(i);o||(o=Ie({name:n.studentName.trim(),createdAt:n.createdAt||g(),updatedAt:g()}),await Y(o),e.set(i,o)),n.studentId=o.id,await J(n),a=!0}a&&await q()}async function et(e){const a=e.files?.[0];if(a)try{ua(a);const n=await a.text(),i=JSON.parse(n),{simulations:o,students:r,invalidIndexes:l}=ma(i);let d=0;for(const h of r){const b=pa(h,{makeId:w,nowIso:g});b&&(await Y(b),d+=1)}for(const h of o){const b=p(ba(h,{makeId:w,nowIso:g,catalogById:V}));await J(b)}if(await We(),await q(),t.current){const h=await te(t.current.id);h&&(t.current=p(h))}else t.history.length&&(t.current=p(t.history[0]),await R("currentSimulationId",t.current.id));const f=l.length?` (${l.length} omitidas)`:"";A(`Importadas ${o.length} pruebas y ${d} fichas${f}`),u()}catch(n){$(n,"import")}finally{e.value=""}}async function at(e){const a=e.dataset.action;if(a){if(a==="clear-alert"){we();return}if(we(),a==="go-back"){t.screen==="student-detail"||t.screen==="student-new"?x("students"):x("home");return}if(a==="screen"){x(e.dataset.screen);return}if(a==="filter"){t.filter=e.dataset.filter,u();return}if(a==="clear-fault-query"){t.query="",u(),document.querySelector("#fault-search-input")?.focus();return}if(a==="reset-fault-filters"){t.query="",t.filter="ALL",u();return}if(a==="history-filter"){t.historyFilter=e.dataset.filter,u();return}if(a==="create-student")return Se({startExam:!1});if(a==="create-student-and-exam")return Se({startExam:!0});if(a==="delete-student")return Ba(e.dataset.id);if(a==="view-student")return Ha(e.dataset.id);if(a==="new-exam-student")return Ve(e.dataset.id);if(a==="new-quick-simulation")return _a();if(a==="unlink-student"){if(!t.current)return;t.current.studentId=null,await m(),u();return}if(a==="open-fault"){t.openFault=Number(e.dataset.id),u();return}if(a==="quick-add-fault")return de(e.dataset.id,{goSummary:!1});if(a==="close-sheet"){t.openFault=null,u();return}if(a==="add-fault"){const n=document.querySelector("#fault-note")?.value?.trim()||"";return de(e.dataset.id,{note:n,goSummary:!0})}if(a==="add-fault-continue"){const n=document.querySelector("#fault-note")?.value?.trim()||"";return de(e.dataset.id,{note:n,goSummary:!1})}if(a==="remove-fault"){const n=Number(e.dataset.index);if(!t.current||!Number.isInteger(n)||n<0||n>=t.current.faults.length){I("No se pudo quitar la falta","La falta seleccionada ya no existe en esta prueba.",{code:"FAULT_NOT_FOUND"});return}t.current.faults.splice(n,1),await m(),u();return}if(a==="timer-start")return Ua(e.dataset.timer);if(a==="timer-pause")return Va(e.dataset.timer);if(a==="timer-reset")return Ga(e.dataset.timer);if(a==="timer-save-record")return Qa();if(a==="remove-time-record")return Wa(e.dataset.id);if(a==="set-countdown"){Qe(e.dataset.minutes),await m(),u();return}if(a==="countdown-start")return Ja();if(a==="countdown-pause")return Ya();if(a==="countdown-reset")return Za();if(a==="load-simulation")return Ka(e.dataset.id);if(a==="duplicate")return Xa(e.dataset.id);if(a==="delete"){if(!window.confirm("¿Borrar definitivamente esta prueba del historial?"))return;const i=e.dataset.id;await ea(i),t.current?.id===i&&(t.current=null,await R("currentSimulationId",null),L()),await q(),A("Prueba eliminada"),u();return}if(a==="pdf"){try{const n=da(t.current);if(n.length&&!window.confirm(`${n.join(" ")} ¿Generar el informe PDF igualmente?`))return;t.pdfBusy=!0,u(),await m();const{downloadSimulationPdf:i}=await Ze(async()=>{const{downloadSimulationPdf:o}=await import("./pdf-DKt0M1NA.js").then(r=>r.p);return{downloadSimulationPdf:o}},[],import.meta.url);i(t.current,V),A("Informe PDF descargado")}catch(n){$(n,"pdf")}finally{t.pdfBusy=!1,u()}return}if(a==="print"){window.print();return}if(a==="export-json"){try{if(!t.current)throw T("No hay prueba activa para exportar.",{title:"Sin prueba activa",code:"NO_CURRENT_SIMULATION"});await m(),je(t.current,`Simulacion_${t.current.date||Q()}.json`),A("Prueba exportada")}catch(n){$(n,"export")}return}if(a==="export-all"){try{t.current&&await m(),await q(),je({exportedAt:g(),version:"0.6.0",students:t.students,simulations:t.history},`Copia_PermisoB_${Q()}.json`),A("Copia completa descargada")}catch(n){$(n,"export")}return}if(a==="finalize"){if(!t.current)return;Z(t.current.timers),t.current.status="finalized",await m(),L(),A("Prueba finalizada y tiempos detenidos"),u();return}if(a==="reopen"){if(!t.current)return;t.current.status="draft",await m(),A("Prueba reabierta para edición"),u();return}if(a==="clear-current"){if(!t.current?.faults?.length||!window.confirm("¿Eliminar todas las faltas anotadas en la prueba actual?"))return;t.current.faults=[],await m(),u();return}a==="dismiss-install"&&(t.installedHintDismissed=!0,await R("installHintDismissed",!0),u())}}U.addEventListener("input",e=>{const a=e.target;if(a.dataset.field&&_e(a),a.dataset.studentDraft&&Fa(a),a.dataset.studentField&&He(a),a.dataset.timerInput&&Ue(a),a.dataset.search==="faults"){t.query=a.value;const n=document.querySelector("#fault-blocks-container");n&&(n.innerHTML=Oe())}else if(a.dataset.search==="students"){t.studentQuery=a.value;const n=document.querySelector("#student-results-container");n&&(n.innerHTML=Ce())}else if(a.dataset.search==="history"){t.historyQuery=a.value;const n=document.querySelector("#history-results-container");n&&(n.innerHTML=Re())}});U.addEventListener("change",async e=>{const a=e.target;try{a.dataset.field&&await _e(a,{immediate:!0}),a.dataset.studentField&&await He(a,{immediate:!0}),a.dataset.timerInput&&Ue(a,{immediate:!0}),a.dataset.import==="json"&&await et(a),a.dataset.toggle==="wake-lock"&&(t.wakeLockEnabled=!!a.checked,await R("wakeLockEnabled",t.wakeLockEnabled),await Pe(),A(t.wakeLockEnabled?"Pantalla activa habilitada":"Pantalla activa desactivada"),t.screen==="settings"&&u())}catch(n){$(n,"general")}});U.addEventListener("toggle",e=>{const a=e.target;if(!(a instanceof HTMLDetailsElement)||!a.classList.contains("fault-group")||t.query.trim()||t.filter!=="ALL")return;const n=a.dataset.block;n&&(a.open?t.openBlocks.add(n):t.openBlocks.delete(n))},!0);U.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const n=a.tagName;n==="INPUT"||n==="TEXTAREA"||n==="SELECT"||n==="LABEL"||(e.preventDefault(),at(a).catch(i=>$(i,"general")))});window.addEventListener("keydown",e=>{e.key==="Escape"&&t.openFault&&(t.openFault=null,u())});document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&P(),L()});async function tt(){if("serviceWorker"in navigator)try{(await navigator.serviceWorker.register("./sw.js")).update().catch(()=>{})}catch(e){console.warn("Service worker no registrado",e)}}async function nt(){const e=ca(W);e.length&&I("Revisa el catálogo de faltas",`Se han detectado ${e.length} problemas en el catálogo.`,{code:"CATALOG_WARNINGS"}),await qe(),t.installedHintDismissed=!!await le("installHintDismissed"),t.wakeLockEnabled=!!await le("wakeLockEnabled",!1),await We(),await q();const a=await le("currentSimulationId");if(a){const n=await te(a);t.current=n?p(n):null}t.screen="home",u(),tt()}window.addEventListener("error",e=>{$(e.error||e.message,"general")});window.addEventListener("unhandledrejection",e=>{$(e.reason,"general")});nt().catch(e=>{const a=xe(e,"init");U.innerHTML=`
    <main class="workspace startup-error">
      <div class="alert-banner alert-error" role="alert">
        <div class="alert-body">
          <strong>${s(a.title||"No se pudo iniciar la aplicación")}</strong>
          <p>${s(a.message)}</p>
          <span class="alert-code">Ref: ${s(a.code||"INIT_ERROR")}</span>
        </div>
      </div>
    </main>
  `});export{Ze as _,ne as a,_ as e,H as f,Q as l};
