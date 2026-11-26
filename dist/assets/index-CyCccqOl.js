(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Ze="modulepreload",Ke=function(e,a){return new URL(e,a).href},fe={},ea=function(a,t,n){let i=Promise.resolve();if(t&&t.length>0){let d=function(u){return Promise.all(u.map(b=>Promise.resolve(b).then(E=>({status:"fulfilled",value:E}),E=>({status:"rejected",reason:E}))))};const l=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),m=c?.nonce||c?.getAttribute("nonce");i=d(t.map(u=>{if(u=Ke(u,n),u in fe)return;fe[u]=!0;const b=u.endsWith(".css"),E=b?'[rel="stylesheet"]':"";if(n)for(let O=l.length-1;O>=0;O--){const h=l[O];if(h.href===u&&(!b||h.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${E}`))return;const w=document.createElement("link");if(w.rel=b?"stylesheet":Ze,b||(w.as="script"),w.crossOrigin="",w.href=u,m&&w.setAttribute("nonce",m),document.head.appendChild(w),b)return new Promise((O,h)=>{w.addEventListener("load",O),w.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return i.then(l=>{for(const c of l||[])c.status==="rejected"&&r(c.reason);return a().catch(r)})},ze=JSON.parse('[{"id":1,"bloque":"1. Comprobaciones previas","tipo":"L","nivel":"Leve","falta":"No comprobar correctamente el estado general del vehículo","obs":"Mandos, neumáticos, luces, niveles, claxon, batería, capó, chaleco, preseñalización y documentación. Se califica con una sola falta leve.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":2,"bloque":"2. Instalación","tipo":"L","nivel":"Leve","falta":"No adoptar la postura correcta","obs":"Asiento y posición de conducción antes de iniciar la prueba.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":3,"bloque":"2. Instalación","tipo":"L","nivel":"Leve","falta":"No regular correctamente los espejos retrovisores","obs":"Debe hacerse antes de iniciar la marcha.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":4,"bloque":"2. Instalación","tipo":"L","nivel":"Leve","falta":"No utilizar el cinturón de seguridad","obs":"Una vez calificado, se indica que lo coloque.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":5,"bloque":"2. Instalación","tipo":"L","nivel":"Leve","falta":"No ajustarse correctamente el cinturón de seguridad","obs":"Cinturón mal colocado o sin ajustar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":6,"bloque":"3. Incorporación","tipo":"D","nivel":"Deficiente","falta":"Realizar la incorporación obstaculizando a los demás usuarios","obs":"La falta sube de nivel cuando obliga a otros a modificar su marcha.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":7,"bloque":"3. Incorporación","tipo":"D","nivel":"Deficiente","falta":"Recorrer marcha atrás más de 15 m o invadir un cruce para incorporarse, obstaculizando","obs":"Si además se obstaculiza, pasa a deficiente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":8,"bloque":"3. Incorporación","tipo":"D","nivel":"Deficiente","falta":"Utilizar inadecuadamente el carril de aceleración, obstaculizando","obs":"No ajustarse a la velocidad o entrada al carril.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":9,"bloque":"3. Incorporación","tipo":"D","nivel":"Deficiente","falta":"Incorporarse invadiendo sin necesidad el arcén, sentido contrario o carriles contiguos","obs":"Por mala trayectoria o mala elección del espacio.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":10,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"No observar el tráfico delante, detrás y/o lateralmente","obs":"Mirar antes de iniciar la marcha.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":11,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Omitir la señal reglamentaria","obs":"No usar intermitente cuando procede.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":12,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Señalizar al contrario","obs":"Indicar el lado incorrecto.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":13,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Señalizar sin suficiente antelación","obs":"Intermitente tardío.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":14,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"No extinguir la señal una vez finalizada la maniobra","obs":"Dejar el intermitente puesto más de lo necesario.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":15,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Realizar la incorporación de forma no gradual","obs":"Entrada brusca o poco progresiva.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":16,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Demorar la incorporación evidenciando inseguridad","obs":"Cuando las condiciones de distancia y velocidad son idóneas.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":17,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Realizar más movimientos de los necesarios","obs":"Según el espacio disponible.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":18,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Incorporarse con velocidad inadecuada","obs":"Por exceso o defecto, según la situación.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":19,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Forzar o golpear fuertemente el bordillo sin llegar a subirlo","obs":"Si se sube al bordillo puede ser más grave según circunstancias.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":20,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Recorrer marcha atrás más de 15 m o invadir un cruce para incorporarse","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":21,"bloque":"3. Incorporación","tipo":"L","nivel":"Leve","falta":"Utilización inadecuada de los carriles de aceleración","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":22,"bloque":"4. Progresión normal","tipo":"E","nivel":"Eliminatoria","falta":"Reducir peligrosamente la separación lateral con peatones o ciclistas","obs":"Se valora según separación, velocidad y actitud del peatón/ciclista.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":23,"bloque":"4. Progresión normal","tipo":"E","nivel":"Eliminatoria","falta":"Circular a velocidad inadecuada por estado de la vía o meteorología causando riesgo o peligro","obs":"Lluvia intensa, niebla densa, hielo, humo, viento fuerte, etc.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":24,"bloque":"4. Progresión normal","tipo":"E","nivel":"Eliminatoria","falta":"No adaptarse al ritmo del tráfico o de la vía tras ser invitado a ello","obs":"Cuando se circula de forma continuada muy por debajo del ritmo posible.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":25,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"No circular por el carril derecho cuando sea reglamentario, obstaculizando","obs":"En vías con varios carriles o situaciones en que debe circularse por la derecha.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":26,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Circular por carril no autorizado para el vehículo, obstaculizando","obs":"En vías fuera de poblado con tres o más carriles, si procede.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":27,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Mantenerse circulando notablemente próximo a otros vehículos","obs":"Distancia frontal claramente insuficiente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":28,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Reducir notablemente la separación lateral con peatones, ciclistas o animales","obs":"Sin llegar a peligro directo.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":29,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Reducir notablemente la separación lateral con otros vehículos u obstáculos","obs":"Separación lateral insuficiente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":30,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Circular a velocidad anormalmente reducida sin causa justificada, obstaculizando","obs":"No basta con ir lento: debe obstaculizar.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":31,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Salirse de la calzada donde no exista arcén, sin pérdida de dominio","obs":"Por circular demasiado próximo al borde.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":32,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"No detenerse en túnel o paso inferior lo más lejos posible del vehículo precedente","obs":"Cuando sea necesario detenerse por la circulación.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":33,"bloque":"4. Progresión normal","tipo":"D","nivel":"Deficiente","falta":"Exceder la velocidad máxima en más de 20 km/h y hasta 30 km/h","obs":"Criterio general de velocidad máxima.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":34,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"No circular por el carril derecho cuando sea reglamentario","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":35,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"Mantenerse junto al eje de la calzada en vía de un carril por sentido","obs":"Cuando debe circularse más centrado en el carril propio/derecha.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":36,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"No circular lo más cerca posible del borde derecho en curvas o rasantes de reducida visibilidad","obs":"En vías de un carril por sentido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":37,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"Circular por el arcén parcial o totalmente","obs":"Salvo supuestos permitidos.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":38,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"Circular a velocidad anormalmente reducida sin causa justificada","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":39,"bloque":"4. Progresión normal","tipo":"L","nivel":"Leve","falta":"Exceder la velocidad máxima en más de 10 km/h y hasta 20 km/h","obs":"Criterio general de velocidad máxima.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":40,"bloque":"5. Desplazamientos laterales","tipo":"E","nivel":"Eliminatoria","falta":"Obligar a modificar bruscamente trayectoria o velocidad en paso estrecho sin prioridad","obs":"Cuando corresponde prioridad a otro vehículo.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":41,"bloque":"5. Desplazamientos laterales","tipo":"D","nivel":"Deficiente","falta":"Reducir considerablemente la velocidad sin observar, valorar o advertir","obs":"Frenada o reducción que afecta al tráfico.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":42,"bloque":"5. Desplazamientos laterales","tipo":"D","nivel":"Deficiente","falta":"Realizar el desplazamiento obstaculizando a vehículos por detrás o en sentido contrario","obs":"Cambio de carril, salida o entrada sin margen suficiente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":43,"bloque":"5. Desplazamientos laterales","tipo":"D","nivel":"Deficiente","falta":"No guardar separación frontolateral adecuada con vehículos u obstáculos","obs":"Durante el desplazamiento lateral.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":44,"bloque":"5. Desplazamientos laterales","tipo":"D","nivel":"Deficiente","falta":"No penetrar lo antes posible en carril de deceleración, obstaculizando","obs":"Entrada tardía al carril de salida.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":45,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"No observar el tráfico delante, detrás y/o lateralmente","obs":"Antes de desplazar el vehículo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":46,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"Omitir señal reglamentaria","obs":"No indicar el desplazamiento.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":47,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"Señalizar al contrario","obs":"Intermitente erróneo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":48,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"Señalizar sin suficiente antelación","obs":"Indicación tardía.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":49,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"Señalizar con excesiva antelación","obs":"Indicación que puede confundir.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":50,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"No extinguir la señalización tras la maniobra","obs":"Intermitente mantenido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":51,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"Realizar el desplazamiento de forma brusca","obs":"Sin peligro ni obstaculización notable.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":52,"bloque":"5. Desplazamientos laterales","tipo":"L","nivel":"Leve","falta":"No penetrar lo antes posible en carril de deceleración","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":53,"bloque":"6. Adelantamientos","tipo":"E","nivel":"Eliminatoria","falta":"Adelantar en intersecciones o proximidades sin visibilidad lateral suficiente","obs":"Especialmente a vehículos de más de dos ruedas.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":54,"bloque":"6. Adelantamientos","tipo":"E","nivel":"Eliminatoria","falta":"Adelantar obstaculizando a los que circulan en sentido contrario","obs":"Riesgo directo en sentido contrario.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":55,"bloque":"6. Adelantamientos","tipo":"E","nivel":"Eliminatoria","falta":"No disminuir la velocidad cuando exista peligro durante el adelantamiento","obs":"Para evitar riesgo a cualquier usuario.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":56,"bloque":"6. Adelantamientos","tipo":"E","nivel":"Eliminatoria","falta":"Adelantar sin dejar separación lateral reglamentaria con riesgo","obs":"Especial atención a ciclistas, peatones y vehículos vulnerables.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":57,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Iniciar el adelantamiento demasiado próximo al vehículo precedente","obs":"No mantener separación frontal reglamentaria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":58,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Iniciar el adelantamiento demasiado lejos y prolongar innecesariamente, obstaculizando","obs":"Maniobra demasiado larga.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":59,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Adelantar con lentitud o sin suficiente diferencia de velocidad, obstaculizando","obs":"No completar con fluidez cuando es posible.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":60,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"No intentar el adelantamiento tras ser invitado, evidenciando inseguridad","obs":"Cuando las circunstancias son idóneas.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":61,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Adelantar obstaculizando a los vehículos del carril contiguo","obs":"Mala valoración del carril al que se entra.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":62,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Adelantar en pasos de peatones, pasos a nivel, vías ciclistas o túneles cuando esté prohibido","obs":"Según lugar y riesgo, puede ser eliminatoria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":63,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Iniciar el adelantamiento cuando el precedente ya indicó desplazarse al mismo lado, obstaculizando","obs":"No respetar la intención del vehículo precedente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":64,"bloque":"6. Adelantamientos","tipo":"D","nivel":"Deficiente","falta":"Demorar excesivamente la vuelta al carril derecho, obstaculizando","obs":"No regresar tras terminar el adelantamiento.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":65,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"Iniciar el adelantamiento demasiado lejos prolongando innecesariamente la maniobra","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":66,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"Adelantar con lentitud o sin suficiente diferencia de velocidad","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":67,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"No observar tráfico lateral y posterior al adelantar","obs":"Mirar espejos y ángulo muerto.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":68,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"Omitir, señalizar mal o tarde el desplazamiento del adelantamiento","obs":"Intermitentes en salida o retorno.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":69,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"No extinguir la señalización tras el adelantamiento","obs":"Intermitente mantenido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":70,"bloque":"6. Adelantamientos","tipo":"L","nivel":"Leve","falta":"Demorar la vuelta al carril derecho","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":71,"bloque":"7. Intersecciones y glorietas","tipo":"E","nivel":"Eliminatoria","falta":"Circular por sentido contrario en intersección o glorieta","obs":"Dejar a la derecha mediana, refugio, isleta o centro de glorieta.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":72,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"Franquear la intersección a velocidad inadecuada","obs":"Cuando afecta a la seguridad o fluidez.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":73,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"No llevar posición adecuada para o durante el franqueo, obstaculizando","obs":"Mala colocación en carril o trayectoria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":74,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"Aproximarse o franquear a velocidad excesivamente reducida sin causa, obstaculizando","obs":"Exceso de indecisión.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":75,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"Detenerse sin necesidad, obstaculizando","obs":"Parada innecesaria que afecta al tráfico.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":76,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"Detenerse rebasada la posición de entrada obstaculizando la circulación transversal","obs":"Parada dentro de la intersección.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":77,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"No detenerse, obstaculizando a vehículo con prioridad","obs":"Sin llegar a producir peligro eliminatorio.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":78,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"No detenerse, obstaculizando a ciclistas con prioridad","obs":"En carril bici o paso ciclista.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":79,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"No detenerse, obstaculizando a peatones o animales con prioridad","obs":"Cruces de arcén, zona peatonal, cañada, giros a otra vía.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":80,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"Al reanudar la marcha, obstaculizar al usuario con prioridad","obs":"Salida precipitada tras parada.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":81,"bloque":"7. Intersecciones y glorietas","tipo":"D","nivel":"Deficiente","falta":"No reanudar la marcha en el momento oportuno, obstaculizando","obs":"Demora excesiva.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":82,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"No mantener la señalización durante el giro o maniobra","obs":"Intermitente que se apaga o no se mantiene.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":83,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"No extinguir la señalización al finalizar","obs":"Intermitente mantenido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":84,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"No llevar la posición adecuada para o durante el franqueo","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":85,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"Aproximarse o franquear a velocidad excesivamente reducida sin causa","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":86,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"Aproximarse a velocidad inadecuada","obs":"Defecto de anticipación.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":87,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"Detenerse súbitamente ante semáforo, stop, ceda, etc.","obs":"Por no anticipar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":88,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"Detenerse antes de alcanzar la zona de máxima visibilidad posible","obs":"Cuando no permite valorar correctamente.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":89,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"Detenerse sin necesidad","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":90,"bloque":"7. Intersecciones y glorietas","tipo":"L","nivel":"Leve","falta":"No reanudar la marcha en el momento oportuno","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":91,"bloque":"8. Cambio de sentido","tipo":"E","nivel":"Eliminatoria","falta":"Realizar hacia atrás tres o más movimientos de los necesarios","obs":"Según espacio disponible.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":92,"bloque":"8. Cambio de sentido","tipo":"D","nivel":"Deficiente","falta":"Realizar la maniobra en lugar prohibido por norma, obstaculizando","obs":"Lugar no permitido y afecta al tráfico.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":93,"bloque":"8. Cambio de sentido","tipo":"D","nivel":"Deficiente","falta":"Realizar la maniobra obstaculizando la circulación","obs":"Aunque el lugar pudiera ser válido.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":94,"bloque":"8. Cambio de sentido","tipo":"D","nivel":"Deficiente","falta":"Realizar hacia atrás dos movimientos más de los necesarios","obs":"Según espacio disponible.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":95,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"No observar el tráfico delante, detrás y/o lateralmente","obs":"Antes y durante la maniobra.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":96,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"Omitir, señalizar al contrario, tarde o con excesiva antelación","obs":"Uso incorrecto de intermitentes.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":97,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"No extinguir la señalización al terminar","obs":"Intermitente mantenido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":98,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"Realizar la maniobra en lugar prohibido por norma","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":99,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"Realizar hacia atrás un movimiento más de los necesarios","obs":"Según espacio disponible.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":100,"bloque":"8. Cambio de sentido","tipo":"L","nivel":"Leve","falta":"Forzar o golpear fuertemente el bordillo sin llegar a subirlo","obs":"En cambio de sentido.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":101,"bloque":"9. Paradas y estacionamientos","tipo":"E","nivel":"Eliminatoria","falta":"Dejar el vehículo estacionado sobresaliendo más de la mitad respecto a la alineación","obs":"Respecto a otros vehículos o marcas de estacionamiento.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":102,"bloque":"9. Paradas y estacionamientos","tipo":"E","nivel":"Eliminatoria","falta":"En batería, sobresalir más de un metro invadiendo zona de circulación","obs":"Especialmente en estacionamiento en batería.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":103,"bloque":"9. Paradas y estacionamientos","tipo":"D","nivel":"Deficiente","falta":"Realizar parada o estacionamiento en lugar prohibido, obstaculizando","obs":"Lugar incorrecto y afectación a otros.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":104,"bloque":"9. Paradas y estacionamientos","tipo":"D","nivel":"Deficiente","falta":"Obstaculizar durante la ejecución de parada o estacionamiento","obs":"Maniobra que dificulta la circulación.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":105,"bloque":"9. Paradas y estacionamientos","tipo":"D","nivel":"Deficiente","falta":"Dejar el vehículo sobresaliendo menos de la mitad de la alineación","obs":"Deficiente si la colocación afecta.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":106,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"No observar tráfico delante, detrás y/o lateralmente","obs":"Antes de iniciar o finalizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":107,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"Omitir, señalizar al contrario, tarde o demasiado pronto","obs":"Intermitente de parada/estacionamiento.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":108,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"Realizar la maniobra en lugar prohibido por norma","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":109,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"Seleccionar un espacio claramente inferior a la longitud del vehículo","obs":"Cuando se entra totalmente con la parte posterior.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":110,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"Superar el tiempo máximo de 2 minutos en estacionamiento","obs":"Criterio de duración de la maniobra.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":111,"bloque":"9. Paradas y estacionamientos","tipo":"L","nivel":"Leve","falta":"No accionar el freno de estacionamiento al finalizar","obs":"Si procede por seguridad.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":112,"bloque":"11. Señales: agentes y paneles","tipo":"E","nivel":"Eliminatoria","falta":"No respetar señal de agente de circulación","obs":"También señales de policía militar, protección civil u obras.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":113,"bloque":"11. Señales: agentes y paneles","tipo":"D","nivel":"Deficiente","falta":"Detenerse o demorar reanudación cuando el agente permite el paso","obs":"Si afecta al tráfico.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":114,"bloque":"11. Señales: agentes y paneles","tipo":"D","nivel":"Deficiente","falta":"Incumplir señales de reglamentación en panel variable","obs":"Aplicando criterio de señal vertical.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":115,"bloque":"11. Semáforos","tipo":"E","nivel":"Eliminatoria","falta":"No respetar semáforo en rojo","obs":"Aunque no se invada completamente si se pierde la visión de la luz o se penetra en la intersección.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":116,"bloque":"11. Semáforos","tipo":"E","nivel":"Eliminatoria","falta":"No respetar luz roja intermitente o dos rojas alternas","obs":"No detenerse ante ellas.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":117,"bloque":"11. Semáforos","tipo":"E","nivel":"Eliminatoria","falta":"No respetar semáforo con franja blanca horizontal","obs":"Señal de detención para vehículos afectados.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":118,"bloque":"11. Semáforos","tipo":"E","nivel":"Eliminatoria","falta":"Ocupar o no abandonar carril con aspa roja","obs":"Carril cerrado.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":119,"bloque":"11. Semáforos","tipo":"D","nivel":"Deficiente","falta":"Detenerse o no reanudar ante franja blanca vertical u oblicua, obstaculizando","obs":"Cuando las circunstancias permiten continuar.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":120,"bloque":"11. Semáforos","tipo":"D","nivel":"Deficiente","falta":"Rebasar dispositivo delimitador móvil en movimiento sin causar peligro","obs":"Con peligro sería eliminatoria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":121,"bloque":"11. Semáforos","tipo":"D","nivel":"Deficiente","falta":"No ceder al seguir flecha verde de semáforo circular","obs":"Vehículos del carril al que se incorpora o peatones.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":122,"bloque":"11. Semáforos","tipo":"D","nivel":"Deficiente","falta":"Detenerse sin necesidad o no reanudar en verde/amarillo intermitente, obstaculizando","obs":"Cuando puede continuar.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":123,"bloque":"11. Semáforos","tipo":"D","nivel":"Deficiente","falta":"No seguir dirección de flecha verde sobre fondo negro, obstaculizando","obs":"Especialmente si se incumple selección de carril.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":124,"bloque":"11. Semáforos","tipo":"L","nivel":"Leve","falta":"Rebasar semáforo amarillo fijo pudiendo detenerse con seguridad","obs":"No confundir con amarillo intermitente.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":125,"bloque":"11. Semáforos","tipo":"L","nivel":"Leve","falta":"Rebasar franja blanca vertical u oblicua intermitente pudiendo detenerse con seguridad","obs":"Cuando proceda detenerse.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":126,"bloque":"11. Semáforos","tipo":"L","nivel":"Leve","falta":"Detenerse sin necesidad o no reanudar en verde/amarillo intermitente","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":127,"bloque":"11. Señales verticales","tipo":"E","nivel":"Eliminatoria","falta":"Incumplir CEDA EL PASO, STOP o prioridad en sentido contrario","obs":"Si implica el incumplimiento principal de prioridad.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":128,"bloque":"11. Señales verticales","tipo":"E","nivel":"Eliminatoria","falta":"Incumplir circulación prohibida o entrada prohibida","obs":"Entrada en vía no permitida.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":129,"bloque":"11. Señales verticales","tipo":"E","nivel":"Eliminatoria","falta":"Incumplir restricción de paso u otras prohibiciones/restricciones","obs":"Cuando tiene consideración grave según criterio DGT.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":130,"bloque":"11. Señales verticales","tipo":"E","nivel":"Eliminatoria","falta":"Exceder la velocidad máxima en más de 30 km/h","obs":"Velocidad máxima señalizada.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":131,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"No hacer uso de la preferencia ante señal de prioridad, obstaculizando","obs":"Por ejemplo no avanzar cuando se tiene prioridad y se dificulta la circulación.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":132,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"Exceder la velocidad máxima en más de 20 km/h y hasta 30 km/h","obs":"Velocidad máxima señalizada.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":133,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"No moderar la velocidad ante luz amarilla intermitente","obs":"O dos luces amarillas alternas.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":134,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"Incumplir señales de obligación","obs":"Tras ser requerido, no cumplir pudiendo hacerlo puede ser eliminatoria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":135,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"No respetar vía reservada a ciclos, VMP o carril reservado","obs":"Según señalización de la vía.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":136,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"Incumplir velocidad mínima","obs":"Si afecta a la circulación.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":137,"bloque":"11. Señales verticales","tipo":"D","nivel":"Deficiente","falta":"Obstaculizar peatones en calle residencial, zona 30 o zona de coexistencia","obs":"Donde la señal está instalada.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":138,"bloque":"11. Señales verticales","tipo":"L","nivel":"Leve","falta":"Exceder la velocidad máxima en más de 10 km/h y hasta 20 km/h","obs":"Velocidad máxima señalizada.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":139,"bloque":"11. Señales verticales","tipo":"L","nivel":"Leve","falta":"Incumplir advertencias acústicas prohibidas","obs":"Uso indebido del claxon.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":140,"bloque":"11. Marcas viales","tipo":"E","nivel":"Eliminatoria","falta":"Circular parcial o totalmente por la izquierda de línea continua que separa sentidos opuestos","obs":"Invadir sentido contrario.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":141,"bloque":"11. Marcas viales","tipo":"E","nivel":"Eliminatoria","falta":"Atravesar línea continua que separa sentidos opuestos","obs":"Cruzar la marca vial prohibida.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":142,"bloque":"11. Marcas viales","tipo":"E","nivel":"Eliminatoria","falta":"No dejar pasar a peatones o ciclistas que ya cruzan en pasos señalizados","obs":"Paso de peatones, carril bici o paso ciclista.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":143,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"Atravesar o circular sobre línea continua que separa carriles del mismo sentido","obs":"Sin llegar a eliminatoria por sentido contrario.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":144,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"Circular sobre líneas discontinuas obstaculizando","obs":"Uso indebido de marcas discontinuas.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":145,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"Obstaculizar a peatones o ciclistas que esperan o cruzan en pasos señalizados","obs":"Si no llega a eliminatoria.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":146,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"No seguir dirección indicada por una señal de orientación","obs":"Por no observar adecuadamente.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":147,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"No seguir flecha de selección de carriles","obs":"La DGT lo recoge en marcas/inscripciones.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":148,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"Entrar en cebreado que separa carriles","obs":"Según el cebreado y la situación.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":149,"bloque":"11. Marcas viales","tipo":"D","nivel":"Deficiente","falta":"No respetar cuadrícula amarilla cuando previsiblemente se queda inmovilizado obstaculizando","obs":"Bloquear intersección o zona marcada.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":150,"bloque":"11. Marcas viales","tipo":"L","nivel":"Leve","falta":"Circular sobre líneas discontinuas","obs":"Sin obstaculizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":151,"bloque":"11. Marcas viales","tipo":"L","nivel":"Leve","falta":"Detenerse sin justificación sobre paso para peatones o ciclistas","obs":"Sin obstaculización grave.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":152,"bloque":"11. Marcas viales","tipo":"L","nivel":"Leve","falta":"Rebasar línea transversal de detención continua o discontinua","obs":"En stop, ceda, semáforo, etc.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":153,"bloque":"11. Marcas viales","tipo":"L","nivel":"Leve","falta":"Exceder señal de velocidad en más de 10 km/h y hasta 20 km/h","obs":"Cuando se valora por marca/señal.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":154,"bloque":"11. Marcas viales","tipo":"L","nivel":"Leve","falta":"No respetar cuadrícula amarilla sin obstaculizar","obs":"Entrar pudiendo quedar inmovilizado.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":155,"bloque":"12. Luces","tipo":"E","nivel":"Eliminatoria","falta":"Circular sin alumbrado en condiciones de notable falta de visibilidad","obs":"Conducción negligente por no llevar luces.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":156,"bloque":"12. Luces","tipo":"E","nivel":"Eliminatoria","falta":"Usar alumbrado produciendo deslumbramiento y causando peligro","obs":"Especialmente carretera/larga.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":157,"bloque":"12. Luces","tipo":"E","nivel":"Eliminatoria","falta":"No utilizar antiniebla trasera obligatoria causando peligro","obs":"Falta o disminución de visibilidad.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":158,"bloque":"12. Luces","tipo":"E","nivel":"Eliminatoria","falta":"No activar luces tras ser indicado después de falta leve","obs":"Por desconocimiento del mando.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":159,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"No utilizar alumbrado cuando es obligatorio","obs":"El examinador puede indicar que lo encienda; si no sabe, puede ser E.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":160,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"No activar manualmente luces automáticas cuando no se activan y son imprescindibles","obs":"Con falta de visibilidad.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":161,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"No utilizar luz de cruce cuando es obligatoria","obs":"Supuestos reglamentarios.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":162,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"Utilizar luz de carretera cuando está prohibido o deslumbrando sin peligro","obs":"Sin llegar a riesgo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":163,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"No utilizar antiniebla cuando corresponde","obs":"Según condiciones.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":164,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"Usar antiniebla trasera cuando no corresponde","obs":"Sin condiciones reglamentarias.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":165,"bloque":"12. Luces","tipo":"L","nivel":"Leve","falta":"No utilizar luces de emergencia cuando son obligatorias","obs":"O utilizarlas cuando no procede.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":166,"bloque":"13. Manejo de mandos","tipo":"E","nivel":"Eliminatoria","falta":"Confusión de pedal con peligro","obs":"Si concurren circunstancias de peligro.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":167,"bloque":"13. Manejo de mandos","tipo":"E","nivel":"Eliminatoria","falta":"Dejar caer el vehículo más de 50 cm en sentido contrario al pretendido con riesgo","obs":"En pendientes o salidas.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":168,"bloque":"13. Manejo de mandos","tipo":"D","nivel":"Deficiente","falta":"No desactivar el freno de estacionamiento afectando ostensiblemente a la marcha","obs":"Ruedas frenadas, calados sucesivos o dificultad clara.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":169,"bloque":"13. Manejo de mandos","tipo":"D","nivel":"Deficiente","falta":"Soltar momentáneamente las dos manos del volante sin pérdida de dominio","obs":"Sin llegar a perder el control.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":170,"bloque":"13. Manejo de mandos","tipo":"D","nivel":"Deficiente","falta":"Dejar caer el vehículo más de 50 cm en sentido contrario al pretendido","obs":"Según velocidad o espacio.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":171,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No conseguir el encendido del motor","obs":"Tras margen suficiente, se indica cómo hacerlo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":172,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Accionar la puesta en marcha con una velocidad seleccionada provocando salto","obs":"Mala preparación del arranque.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":173,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Insistir en la puesta en marcha con el motor ya funcionando","obs":"Mal uso del contacto/arranque.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":174,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No apagar el motor cuando sea reglamentario","obs":"Al finalizar o en supuestos necesarios.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":175,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Desembragar sin justificación","obs":"Uso incorrecto del embrague.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":176,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Frenar de forma brusca por no anticipar","obs":"En permiso B se valora generalmente como leve salvo peligro.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":177,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No usar acelerador con progresividad, suavidad y decisión","obs":"Aceleraciones pobres o bruscas.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":178,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No usar relación de marcha adecuada según velocidad, tráfico o vía","obs":"Marcha demasiado larga/corta.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":179,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Poner punto muerto antes de detenerse sin aprovechar retención del motor","obs":"Mala técnica de conducción.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":180,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No usar marcha adecuada en descensos prolongados para que el motor actúe como freno","obs":"En turismos se valora como leve según criterio.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":181,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Calado del motor por no seleccionar relación adecuada","obs":"Una falta leve por cada calado.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":182,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No desactivar freno de estacionamiento aunque no afecte a la marcha","obs":"Se indica que lo desactive.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":183,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Calados por no desactivar freno de estacionamiento","obs":"Se anotan y se indica si se repiten.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":184,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Sujeción con una sola mano sin justificación","obs":"Mano fuera del volante sin necesidad.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":185,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Ligeras desviaciones de trayectoria","obs":"Con ambas manos o al cambiar de marcha.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":186,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Giro brusco del volante por no anticipar la trayectoria","obs":"Manejo brusco.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":187,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Mantener las manos cruzadas durante un giro o coger el volante por el interior","obs":"Estando el vehículo en movimiento.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":188,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No realizar conducción eficiente durante la prueba","obs":"Se anota una sola vez al finalizar.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":189,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Usar embrague antes que freno o simultáneamente sin necesidad","obs":"Operación combinada incorrecta.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":190,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Calado del motor","obs":"Una falta leve por cada calado.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":191,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Aceleraciones en vacío","obs":"Según revoluciones.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":192,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Arranque brusco o a saltos","obs":"En permiso B, generalmente leve salvo riesgo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":193,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Realizar cambios con brusquedad","obs":"En permiso B, generalmente leve salvo riesgo.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":194,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Rascar o tener dificultad al introducir marcha por mal uso del embrague","obs":"Error de coordinación.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":195,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Reducir a marcha inferior y no soltar embrague","obs":"Mala operación embrague/cambio.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":196,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Desembragar en curva o cambio de dirección","obs":"Según velocidad y trazado puede subir.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":197,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Frenar en curva sin necesidad","obs":"Según velocidad y trazado puede subir.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":198,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"Mantener acelerador accionado al cambiar de marcha","obs":"Mala coordinación.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":199,"bloque":"13. Manejo de mandos","tipo":"L","nivel":"Leve","falta":"No revolucionar suficiente al cambiar a marchas largas, produciendo traqueteo","obs":"Mala relación marcha/velocidad.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":200,"bloque":"14. Otros mandos","tipo":"E","nivel":"Eliminatoria","falta":"Desconocer mando imprescindible por visibilidad o seguridad tras indicación","obs":"Luces, limpia, desempañado, dispositivos de seguridad.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":201,"bloque":"14. Otros mandos","tipo":"D","nivel":"Deficiente","falta":"No desactivar freno eléctrico afectando ostensiblemente a la marcha","obs":"Si el vehículo lo equipa.","ejemplo":"Anotar si obstaculiza o dificulta notablemente la circulación."},{"id":202,"bloque":"14. Otros mandos","tipo":"L","nivel":"Leve","falta":"No utilizar limpiaparabrisas cuando sea necesario","obs":"Si el sistema automático no actúa, debe activarlo manualmente.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":203,"bloque":"14. Otros mandos","tipo":"L","nivel":"Leve","falta":"Usar señales acústicas de forma antirreglamentaria","obs":"Claxon sin causa reglamentaria.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":204,"bloque":"14. Otros mandos","tipo":"L","nivel":"Leve","falta":"Iniciar la marcha con una puerta abierta o mal cerrada","obs":"Tras advertencia en el cuadro/instrumentos.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":205,"bloque":"14. Otros mandos","tipo":"L","nivel":"Leve","falta":"No usar sistemas de desempañado o protección frente al deslumbramiento cuando es necesario","obs":"Parasol, luneta, ventilación, desempañado.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":206,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Golpear a personas, animales, vehículos o elementos","obs":"Accidente imputable al aspirante.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":207,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Crear riesgo cierto y relevante que obliga a otros a modificar bruscamente trayectoria o velocidad","obs":"Maniobra o actuación evasiva de otro usuario.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":208,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Invadir sentido contrario en lugar o circunstancias de reducida visibilidad","obs":"Giro o circulación con falta de visibilidad.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":209,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Perder el dominio del vehículo","obs":"No controlar la trayectoria en relación con la velocidad.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":210,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Intervención del profesor o sistema AEB por causa imputable al aspirante","obs":"Acción directa sobre mandos o frenado de emergencia.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":211,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"Subir al bordillo con alguna rueda","obs":"Excepto supuestos de bordillo rebajado/poca altura en maniobras; en turismo con rueda posterior puede ser leve.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."},{"id":212,"bloque":"15. Durante la prueba","tipo":"L","nivel":"Leve","falta":"Subir al bordillo con la rueda posterior de un turismo","obs":"Criterio específico de la DGT.","ejemplo":"Anotar como error menor si no hay peligro ni obstaculización notable."},{"id":213,"bloque":"15. Durante la prueba","tipo":"E","nivel":"Eliminatoria","falta":"No seguir reiteradamente las indicaciones del examinador","obs":"Se entiende reiterado cuando, advertido cada vez, sucede al menos tres veces.","ejemplo":"Anotar si genera peligro, incumplimiento grave/muy grave o intervención."}]'),aa="simulador_permiso_b_db",ta=5;let W;function q(e="id"){return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`}function De(){return W||(W=new Promise((e,a)=>{if(!("indexedDB"in window)){a(new Error("IndexedDB no está disponible en este navegador."));return}const t=indexedDB.open(aa,ta);t.onupgradeneeded=()=>{const n=t.result;if(n.objectStoreNames.contains("simulations")){const i=t.transaction.objectStore("simulations");i.indexNames.contains("studentId")||i.createIndex("studentId","studentId")}else{const i=n.createObjectStore("simulations",{keyPath:"id"});i.createIndex("updatedAt","updatedAt"),i.createIndex("studentId","studentId")}if(!n.objectStoreNames.contains("students")){const i=n.createObjectStore("students",{keyPath:"id"});i.createIndex("name","name"),i.createIndex("updatedAt","updatedAt")}n.objectStoreNames.contains("settings")||n.createObjectStore("settings",{keyPath:"key"})},t.onsuccess=()=>e(t.result),t.onerror=()=>a(t.error),t.onblocked=()=>a(new Error("La base de datos está bloqueada por otra pestaña abierta."))}),W)}function N(e,a="readonly"){return De().then(t=>t.transaction(e,a).objectStore(e))}function x(e){return new Promise((a,t)=>{e.onsuccess=()=>a(e.result),e.onerror=()=>t(e.error)})}async function ee(e){const a=await N("simulations","readwrite");return await x(a.put(e)),e}async function me(e){const a=await N("simulations");return x(a.get(e))}async function je(e){const a=await N("simulations","readwrite");return x(a.delete(e))}async function oa(){const e=await N("simulations");return(await x(e.getAll())).sort((t,n)=>String(n.updatedAt||"").localeCompare(String(t.updatedAt||"")))}async function V(e){const a=await N("students","readwrite");return await x(a.put(e)),e}async function $e(e){const a=await N("students");return x(a.get(e))}async function na(e){const a=await N("students","readwrite");return x(a.delete(e))}async function ia(){const e=await N("students");return(await x(e.getAll())).sort((t,n)=>String(t.name||"").localeCompare(String(n.name||""),"es"))}async function H(e,a){const t=await N("settings","readwrite");return x(t.put({key:e,value:a}))}async function ra(e,a=null){const t=await N("settings"),n=await x(t.get(e));return n?n.value:a}function sa(e=[]){return e.reduce((a,t)=>{const n=t.tipo||t.snapshot?.tipo;return n==="L"&&(a.L+=1),n==="D"&&(a.D+=1),n==="E"&&(a.E+=1),a.total+=1,a},{L:0,D:0,E:0,total:0})}function U(e=[]){const a=sa(e),t=a.E>=1||a.D>=2||a.D>=1&&a.L>=5||a.L>=10,n=[];return a.E>=1&&n.push("1 falta eliminatoria"),a.D>=2&&n.push("2 faltas deficientes"),a.D>=1&&a.L>=5&&n.push("1 deficiente + 5 leves"),a.L>=10&&n.push("10 faltas leves"),{...a,result:t?"NO APTO":"APTO",noApto:t,reasons:n}}function ae(e){return e==="L"?"Leve":e==="D"?"Deficiente":e==="E"?"Eliminatoria":"Sin clasificar"}const le="Revisa que Safari/Chrome permita guardar datos de sitios web y que el dispositivo tenga espacio disponible.";class la extends Error{constructor(a,t={}){super(a),this.name="UserVisibleError",this.code=t.code||"USER_VISIBLE_ERROR",this.title=t.title||"No se pudo completar la acción",this.cause=t.cause}}function R(e,a={}){return new la(e,a)}function qe(e,a="general"){return e?.name==="UserVisibleError"?{title:e.title,message:e.message,code:e.code}:e?.name==="QuotaExceededError"?{title:"No queda espacio para guardar",message:`El navegador no ha podido guardar los datos porque el almacenamiento parece estar lleno. ${le}`,code:"STORAGE_FULL"}:e?.name==="InvalidStateError"||e?.name==="NotFoundError"?{title:"No se pudo acceder al historial",message:`No se ha podido abrir la base de datos local del navegador. Cierra y vuelve a abrir la app. ${le}`,code:"DATABASE_UNAVAILABLE"}:e?.name==="SecurityError"?{title:"El navegador ha bloqueado el almacenamiento",message:"La app no puede guardar datos en este contexto. Prueba a abrirla desde una URL HTTPS o desde Safari/Chrome normal, no desde navegación privada.",code:"STORAGE_BLOCKED"}:e instanceof SyntaxError||a==="import"?{title:"No se pudo leer la copia",message:"El archivo seleccionado no parece ser una copia JSON válida del simulador. Elige una copia exportada desde esta app.",code:"BAD_IMPORT_FILE"}:a==="pdf"?{title:"No se pudo generar el PDF",message:"No se ha podido crear el informe. Guarda la simulación y vuelve a intentarlo. Si el problema continúa, prueba desde Safari o Chrome actualizado.",code:"PDF_ERROR"}:a==="save"?{title:"No se pudieron guardar los cambios",message:`La simulación sigue abierta, pero los últimos cambios podrían no haberse guardado. ${le}`,code:"SAVE_ERROR"}:a==="export"?{title:"No se pudo descargar la copia",message:"El navegador no ha permitido descargar el archivo. Prueba de nuevo o usa el botón de compartir/descargar del navegador.",code:"EXPORT_ERROR"}:{title:"Ha ocurrido un problema",message:"La acción no se ha completado. Puedes seguir usando la app; si vuelve a ocurrir, cierra y abre de nuevo antes de desplegar.",code:"UNKNOWN_ERROR"}}const Ne=new Set(["L","D","E"]),ca=8*1024*1024,ve=1500*1e3;function B(e=new Date){const a=e.getFullYear(),t=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${a}-${t}-${n}`}function da(e){if(!e)return null;const a=String(e).trim(),t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(a);if(t){const i=Number(t[1]),r=Number(t[2])-1,l=Number(t[3]),c=new Date(i,r,l);return c.getFullYear()===i&&c.getMonth()===r&&c.getDate()===l?c:null}const n=new Date(a);return Number.isNaN(n.getTime())?null:n}function G(e,a="Sin fecha"){if(!e)return a;const t=da(e);if(!t)return String(e);try{return new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}).format(t)}catch{return String(e)}}function ua(e){const a=Number(e);return!Number.isFinite(a)||a<1?1:a>180?180:Math.round(a)}function ma(e){const a=[];if(!Array.isArray(e))return["El catálogo de faltas no es una lista."];const t=new Set;return e.forEach((n,i)=>{Number.isInteger(n.id)||a.push(`Falta ${i+1}: id inválido.`),t.has(n.id)&&a.push(`Falta ${i+1}: id duplicado ${n.id}.`),t.add(n.id),Ne.has(n.tipo)||a.push(`Falta ${n.id}: tipo inválido.`),String(n.falta||"").trim()||a.push(`Falta ${n.id}: falta sin texto.`),String(n.bloque||"").trim()||a.push(`Falta ${n.id}: bloque vacío.`)}),a}function pa(e){if(!e||typeof e!="object")throw R("No hay una simulación activa para generar el PDF.",{title:"No hay simulación activa",code:"NO_ACTIVE_SIMULATION"});const a=[];return String(e.studentName||"").trim()||a.push("No has indicado el nombre del alumno/a."),e.date||a.push("No has indicado la fecha de la simulación."),a}function ba(e){if(!e)throw R("No se ha seleccionado ningún archivo.",{title:"Archivo no seleccionado",code:"NO_FILE_SELECTED"});if(e.size>ca)throw R("El archivo es demasiado grande. Exporta una copia más pequeña o importa menos simulaciones.",{title:"Archivo demasiado grande",code:"IMPORT_TOO_LARGE"});const a=String(e.name||"").toLowerCase();if(a&&!a.endsWith(".json"))throw R("El archivo debe ser una copia .json exportada desde el simulador.",{title:"Tipo de archivo no válido",code:"IMPORT_NOT_JSON"})}function fa(e){const a=Array.isArray(e)?e:e?.simulations,t=!Array.isArray(e)&&Array.isArray(e?.students)?e.students:[];if(!Array.isArray(a)&&!t.length)throw R("La copia no tiene el formato esperado. Debe contener simulaciones o alumnos.",{title:"Copia no compatible",code:"IMPORT_BAD_SHAPE"});const n=Array.isArray(a)?a:[];if(!n.length&&!t.length)throw R("La copia está vacía y no contiene datos para importar.",{title:"Copia vacía",code:"IMPORT_EMPTY"});const i=[],r=[];if(n.forEach((l,c)=>{l&&typeof l=="object"&&!Array.isArray(l)?i.push(l):r.push(c+1)}),!i.length&&!t.length)throw R("No se ha encontrado ninguna simulación válida dentro del archivo.",{title:"Copia no válida",code:"IMPORT_NO_VALID_ROWS"});return{simulations:i,students:t,invalidIndexes:r}}function xe(e,{makeId:a,nowIso:t,catalogById:n=null}){if(!Array.isArray(e))return[];const i=t();return e.filter(r=>r&&typeof r=="object"&&!Array.isArray(r)).map(r=>{const l=Number(r.faultId??r.id),c=Number.isInteger(l)?l:null,m=c!==null&&n?n.get(c):null,d=r.tipo||r.snapshot?.tipo||m?.tipo||"L",u=Ne.has(d)?d:"L",b=r.snapshot&&typeof r.snapshot=="object"?r.snapshot:m||r;return{uid:String(r.uid||"").trim()||a("fault"),faultId:c,tipo:u,note:String(r.note||"").slice(0,1e3),snapshot:{id:c??b.id??0,bloque:String(b.bloque||"General").slice(0,160),tipo:u,nivel:String(b.nivel||"").slice(0,40),falta:String(b.falta||"Falta registrada").slice(0,400),obs:String(b.obs||"").slice(0,600)},createdAt:String(r.createdAt||i).slice(0,40)}})}function pe(e,{makeId:a,nowIso:t}){const n=e&&typeof e=="object"?e:{},i=n.exam&&typeof n.exam=="object"?n.exam:{},r=n.parking&&typeof n.parking=="object"?n.parking:{},l=n.countdown&&typeof n.countdown=="object"?n.countdown:{},c=(h,se=0)=>{const T=Number(h);return Number.isFinite(T)&&T>=0?Math.floor(T):se},m=(h,se)=>{if(!h)return null;const T=Number(se);return Number.isFinite(T)&&T>0?T:null},d=c(l.durationMs,ve)||ve,u=l.remainingMs!==void 0?c(l.remainingMs,d):d,b=!!i.running,E=!!r.running,w=!!l.running,O=Array.isArray(r.records)?r.records.filter(h=>h&&typeof h=="object").map(h=>({id:String(h.id||"").trim()||a("time"),label:String(h.label||"Maniobra").slice(0,80),elapsedMs:c(h.elapsedMs,0),note:String(h.note||"").slice(0,240),createdAt:String(h.createdAt||h.date||t()).slice(0,40)})):[];return{exam:{label:String(i.label||"Examen completo").slice(0,80),elapsedMs:c(i.elapsedMs,0),running:b&&m(b,i.startedAt)!==null,startedAt:m(b,i.startedAt)},parking:{label:String(r.label||"Maniobra").slice(0,80),elapsedMs:c(r.elapsedMs,0),running:E&&m(E,r.startedAt)!==null,startedAt:m(E,r.startedAt),records:O},countdown:{label:String(l.label||"Examen temporizado").slice(0,80),durationMs:d,remainingMs:Math.min(d*2,u),running:w&&m(w,l.startedAt)!==null,startedAt:m(w,l.startedAt),endedAt:l.endedAt?String(l.endedAt).slice(0,40):null}}}function te(e,a=Date.now()){if(!e||typeof e!="object")return!1;let t=!1;for(const i of["exam","parking"]){const r=e[i];if(r?.running){const l=Number(r.elapsedMs||0),c=r.startedAt?Math.max(0,a-Number(r.startedAt)):0;r.elapsedMs=Math.max(0,l+c),r.running=!1,r.startedAt=null,t=!0}}const n=e.countdown;if(n?.running){const i=Number(n.remainingMs??n.durationMs??0),r=n.startedAt?Math.max(0,a-Number(n.startedAt)):0;n.remainingMs=Math.max(0,i-r),n.running=!1,n.startedAt=null,t=!0}return t}function oe(e){return!e||typeof e!="object"?!1:!!(e.exam?.running||e.parking?.running||e.countdown?.running)}function va(e,{makeId:a,nowIso:t}){if(!e||typeof e!="object")return null;const n=t(),i=String(e.name||e.studentName||"").trim().slice(0,120);return i?{id:String(e.id||"").trim()||a("stu"),name:i,phone:String(e.phone||"").trim().slice(0,60),email:String(e.email||"").trim().slice(0,120),notes:String(e.notes||"").slice(0,4e3),createdAt:String(e.createdAt||n).slice(0,40),updatedAt:String(e.updatedAt||n).slice(0,40)}:null}function ga(e,{makeId:a,nowIso:t,catalogById:n=null}){const i=t(),r=String(e.id||"").trim()||a("sim"),l=e.status==="finalized"?"finalized":"draft",c=pe(e.timers,{makeId:a,nowIso:t});return l==="finalized"&&te(c),{id:r,studentId:e.studentId?String(e.studentId).trim():null,studentName:String(e.studentName||"").trim().slice(0,120),date:String(e.date||"").trim().slice(0,20),zone:String(e.zone||"").trim().slice(0,160),teacher:String(e.teacher||"").trim().slice(0,120),vehicle:String(e.vehicle||"").trim().slice(0,120),generalNotes:String(e.generalNotes||"").slice(0,4e3),faults:xe(e.faults,{makeId:a,nowIso:t,catalogById:n}),timers:c,status:l,createdAt:String(e.createdAt||i).slice(0,40),updatedAt:i}}const P=document.querySelector("#app"),ha=25,Ie={"1. Comprobaciones previas":{code:"01",short:"Comprobac."},"2. Instalación":{code:"02",short:"Instalación"},"3. Incorporación":{code:"03",short:"Incorporac."},"4. Progresión normal":{code:"04",short:"Progresión"},"5. Desplazamientos laterales":{code:"05",short:"Desplazam."},"6. Adelantamientos":{code:"06",short:"Adelantam."},"7. Intersecciones y glorietas":{code:"07",short:"Intersecc."},"8. Cambio de sentido":{code:"08",short:"C. sentido"},"9. Paradas y estacionamientos":{code:"09",short:"Estacionam."},"11. Señales: agentes y paneles":{code:"11A",short:"Agentes"},"11. Semáforos":{code:"11B",short:"Semáforos"},"11. Señales verticales":{code:"11C",short:"Verticales"},"11. Marcas viales":{code:"11D",short:"Marcas vial."},"12. Luces":{code:"12",short:"Luces"},"13. Manejo de mandos":{code:"13",short:"Mandos"},"14. Otros mandos":{code:"14",short:"Otros mand."},"15. Durante la prueba":{code:"15",short:"Desarrollo"}},ge=new Map,be=ze.map(e=>{const a=Ie[e.bloque]||{code:String(e.bloque||"").split(".")[0].padStart(2,"0"),short:String(e.bloque||"").replace(/^\d+\.\s*/,"").slice(0,12)},t=(ge.get(e.bloque)||0)+1;return ge.set(e.bloque,t),{...e,blockCode:a.code,blockShort:a.short,code:`${a.code}.${String(t).padStart(2,"0")}`}}),j=new Map(be.map(e=>[e.id,e])),J=[];{const e=new Set;for(const a of be)e.has(a.bloque)||(e.add(a.bloque),J.push({bloque:a.bloque,code:a.blockCode,short:a.blockShort}))}const Me=typeof navigator<"u"&&typeof navigator.canShare=="function",o={screen:"students",current:null,currentPersisted:!1,history:[],students:[],selectedStudentId:null,showNewStudentForm:!1,showBackupsBar:!1,showStudentEdit:!1,showHeaderMeta:!1,showTimersDrawer:!1,showBlockGrid:!0,selectedBlock:"ALL",query:"",filter:"ALL",studentQuery:"",openBlocks:new Set([J[0]?.bloque,J[2]?.bloque].filter(Boolean)),openFault:null,toast:"",userAlert:null,busyExamId:null,wakeLockEnabled:!1,wakeLockSentinel:null,studentDraft:Ce()},A=()=>new Date().toISOString(),ne=()=>Date.now();let _=null;function Ce(){return{name:"",phone:"",email:"",notes:""}}function Aa(){return pe({},{makeId:q,nowIso:A})}function ke(e={}){const a=A();return{id:q("stu"),name:"",phone:"",email:"",notes:"",createdAt:a,updatedAt:a,...e}}function ya(e=null){const a=A();return{id:q("sim"),studentId:e?.id||null,studentName:e?.name||"",date:B(),zone:"",teacher:"",vehicle:"",generalNotes:"",faults:[],timers:Aa(),status:"draft",createdAt:a,updatedAt:a}}function g(e){return e?(e.studentId=e.studentId||null,e.studentName=String(e.studentName||""),e.date=e.date||B(),e.zone=String(e.zone||""),e.teacher=String(e.teacher||""),e.vehicle=String(e.vehicle||""),e.generalNotes=String(e.generalNotes||""),e.faults=xe(e.faults,{makeId:q,nowIso:A,catalogById:j}),e.timers=pe(e.timers,{makeId:q,nowIso:A}),e.status=e.status==="finalized"?"finalized":"draft",e):null}function Sa(e){if(!e)return null;const a=A();return{id:e.id||q("stu"),name:String(e.name||e.studentName||"").slice(0,120),phone:String(e.phone||"").slice(0,60),email:String(e.email||"").slice(0,120),notes:String(e.notes||"").slice(0,4e3),createdAt:e.createdAt||a,updatedAt:e.updatedAt||a}}function s(e){return String(e??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[a])}function C(e){return String(e??"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}function y(e){const a=Number(e?.elapsedMs||0);return!e?.running||!e.startedAt?a:Math.max(0,a+(ne()-Number(e.startedAt)))}function I(e){const a=Number(e?.remainingMs??e?.durationMs??0);return!e?.running||!e.startedAt?Math.max(0,a):Math.max(0,a-(ne()-Number(e.startedAt)))}function $(e,{showTenths:a=!0}={}){const t=Math.max(0,Math.floor(Number(e||0))),n=Math.floor(t%1e3/100),i=Math.floor(t/1e3),r=i%60,l=Math.floor(i/60),c=l%60,m=Math.floor(l/60),d=String(r).padStart(2,"0"),u=String(c).padStart(2,"0"),b=m>0?`${String(m).padStart(2,"0")}:${u}:${d}`:`${u}:${d}`;return a?`${s(b)}<span class="t-tenths">.${n}</span>`:s(b)}function Oe(e){const a=Math.max(0,Math.floor(Number(e||0))),t=Math.floor(a/1e3),n=t%60,i=Math.floor(t/60),r=i%60,l=Math.floor(i/60),c=String(n).padStart(2,"0"),m=String(r).padStart(2,"0");return l>0?`${l}:${m}:${c}`:`${m}:${c}`}function he(e){return Math.max(1,Math.round(Number(e?.durationMs||ha*60*1e3)/6e4))}function La(e){if(!e)return!0;const a=!e.faults||e.faults.length===0,t=!e.zone?.trim()&&!e.teacher?.trim()&&!e.vehicle?.trim()&&!e.generalNotes?.trim(),n=y(e.timers?.exam)===0&&y(e.timers?.parking)===0&&!e.timers?.parking?.records?.length&&!oe(e.timers);return a&&t&&n}function Ea(){try{navigator.vibrate&&navigator.vibrate([220,100,220,100,320])}catch{}try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;const a=new e,t=(n,i,r)=>{const l=a.createOscillator(),c=a.createGain();l.type="square",l.frequency.value=i,c.gain.setValueAtTime(.001,a.currentTime+n),c.gain.exponentialRampToValueAtTime(.12,a.currentTime+n+.015),c.gain.exponentialRampToValueAtTime(.001,a.currentTime+n+r),l.connect(c),c.connect(a.destination),l.start(a.currentTime+n),l.stop(a.currentTime+n+r+.02)};t(0,880,.16),t(.22,880,.16),t(.44,1046,.25),window.setTimeout(()=>a.close().catch(()=>{}),1e3)}catch{}}async function Te(){if(!("wakeLock"in navigator))return;const e=o.wakeLockEnabled&&o.screen==="sheet"&&!!o.current&&document.visibilityState==="visible";try{if(e&&!o.wakeLockSentinel){const a=await navigator.wakeLock.request("screen");o.wakeLockSentinel=a,a.addEventListener("release",()=>{o.wakeLockSentinel===a&&(o.wakeLockSentinel=null)})}else!e&&o.wakeLockSentinel&&(await o.wakeLockSentinel.release(),o.wakeLockSentinel=null)}catch{}}function L(){const e=!!o.current&&oe(o.current.timers)&&document.visibilityState==="visible";e&&!_?_=window.setInterval(M,80):!e&&_&&(window.clearInterval(_),_=null),Te()}function Re(){return o.students.find(e=>e.id===o.selectedStudentId)||null}function Q(e){return o.history.filter(a=>a.studentId===e)}function Pe(){return U(o.current?.faults||[])}function wa(){const e=new Map;for(const a of o.current?.faults||[])a.faultId!=null&&e.set(a.faultId,(e.get(a.faultId)||0)+1);return e}function za(){const e=new Map;for(const a of o.current?.faults||[]){const n=(a.faultId!=null?j.get(a.faultId):null)?.bloque||a.snapshot?.bloque;n&&e.set(n,(e.get(n)||0)+1)}return e}function S(e){o.screen=e,o.openFault=null,p(),window.scrollTo(0,0)}function v(e){o.toast=e;const a=document.querySelector("#status-toast");a?a.innerHTML=o.toast?`<div class="dgt-toast" role="status">${s(o.toast)}</div>`:"":p(),e&&(window.clearTimeout(v.timer),v.timer=window.setTimeout(()=>{o.toast="";const t=document.querySelector("#status-toast");t&&(t.innerHTML="")},2300))}function k(e,a,{type:t="error",code:n=""}={}){o.userAlert={title:e,message:a,type:t,code:n},p()}function Ae(){o.userAlert&&(o.userAlert=null,p())}function D(e,a="general"){console.error(e);const t=qe(e,a);k(t.title,t.message,{type:"error",code:t.code})}function Da(){if(!o.userAlert)return"";const e=o.userAlert;return`
    <div class="dgt-alert" role="alert" aria-live="assertive">
      <div class="dgt-alert-text">
        <strong>${s(e.title)}:</strong> ${s(e.message)}
        ${e.code?`<span class="dgt-code">[${s(e.code)}]</span>`:""}
      </div>
      <button type="button" class="t-btn" data-action="clear-alert">Cerrar</button>
    </div>
  `}function ie(e){const a=["L","D","E"].includes(e)?e:"L";return`<span class="sev-box sev-${a}" title="Falta ${s(ae(a))}">${a}</span>`}function ja(){if(o.screen==="sheet"&&o.current){g(o.current);const e=o.current,a=Pe(),t=e.timers.exam,n=e.timers.parking.running||e.timers.countdown.running;return`
      <header class="dgt-chrome no-print">
        <div class="dgt-Masthead">
          <button type="button" class="dgt-back-btn" data-action="leave-exam" title="Volver a la ficha del alumno">
            ‹ Alumno
          </button>
          <div class="dgt-context-title">
            <span class="dgt-context-sub">EVALUANDO A</span>
            <strong>${s(e.studentName||"Alumno")}</strong>
          </div>
          <button type="button" class="dgt-save-btn" data-action="save-and-finish">
            Guardar examen
          </button>
        </div>

        <div class="dgt-instrument-bar" id="instrument-bar">
          <div class="inst-counts">
            <div class="inst-cell inst-L" title="Faltas leves (máx. 9)">
              <span class="inst-k">L</span>
              <strong class="inst-v" id="tally-L">${a.L}</strong>
            </div>
            <div class="inst-cell inst-D" title="Faltas deficientes (máx. 1)">
              <span class="inst-k">D</span>
              <strong class="inst-v" id="tally-D">${a.D}</strong>
            </div>
            <div class="inst-cell inst-E" title="Faltas eliminatorias (0)">
              <span class="inst-k">E</span>
              <strong class="inst-v" id="tally-E">${a.E}</strong>
            </div>
            <span class="inst-verdict ${a.noApto?"is-noapto":"is-apto"}" id="tally-verdict">
              ${a.result}
            </span>
          </div>

          <div class="inst-clock-group">
            <span class="inst-time ${t.running?"is-running":""}" data-timer-display="elapsed:exam:compact">${$(y(t),{showTenths:!1})}</span>
            <button type="button" class="inst-btn ${t.running?"is-stop":"is-start"}" id="top-exam-timer-btn" data-action="${t.running?"timer-pause":"timer-start"}" data-timer="exam">
              ${t.running?"Parar":"Iniciar"}
            </button>
            <button type="button" class="inst-btn inst-btn-sub ${o.showTimersDrawer||n?"is-active":""}" data-action="toggle-timers">
              Relojes ${o.showTimersDrawer?"▴":"▾"}
            </button>
          </div>
        </div>
      </header>
    `}if(o.screen==="student-detail"){const e=Re();return`
      <header class="dgt-chrome no-print">
        <div class="dgt-Masthead">
          <button type="button" class="dgt-back-btn" data-action="go-students">
            ‹ Alumnos
          </button>
          <div class="dgt-context-title">
            <span class="dgt-context-sub">EXPEDIENTE DE ALUMNO</span>
            <strong id="header-student-name">${s(e?.name||"Ficha de alumno")}</strong>
          </div>
          ${e?`
            <button type="button" class="dgt-save-btn" data-action="new-exam-student" data-id="${s(e.id)}">
              + Nuevo examen
            </button>
          `:""}
        </div>
      </header>
    `}if(o.screen==="acta"){const e=o.current?.studentId||o.selectedStudentId;return`
      <header class="dgt-chrome no-print">
        <div class="dgt-Masthead">
          <button type="button" class="dgt-back-btn" data-action="${e?"back-to-student":"go-students"}">
            ‹ ${e?"Exámenes del alumno":"Alumnos"}
          </button>
          <div class="dgt-context-title">
            <span class="dgt-context-sub">ACTA DE EVALUACIÓN</span>
            <strong>${s(o.current?.studentName||"Informe")}</strong>
          </div>
          <button type="button" class="dgt-new-btn" data-action="pdf-exam" data-id="${s(o.current?.id||"")}">
            Descargar PDF
          </button>
        </div>
      </header>
    `}return`
    <header class="dgt-chrome no-print">
      <div class="dgt-Masthead">
        <div class="dgt-brand">
          <span class="dgt-plate">B</span>
          <div class="dgt-context-title">
            <span class="dgt-context-sub">PERMISO DE CONDUCCIÓN B</span>
            <strong>REGISTRO DE ALUMNOS</strong>
          </div>
        </div>
        <div class="dgt-head-actions">
          <button type="button" class="dgt-head-link ${o.showBackupsBar?"is-active":""}" data-action="toggle-backups">
            Copias ${o.showBackupsBar?"▴":"▾"}
          </button>
          <button type="button" class="dgt-save-btn" data-action="toggle-new-student">
            ${o.showNewStudentForm?"Cerrar alta":"+ Nuevo alumno"}
          </button>
        </div>
      </div>
    </header>
  `}function Fe(){const e=C(o.studentQuery).trim(),a=o.students.filter(t=>e?C(`${t.name} ${t.phone} ${t.email} ${t.notes}`).includes(e):!0);return a.length?`
    <div class="student-directory">
      <div class="dir-thead">
        <span>ALUMNO / EXPEDIENTE</span>
        <span>EXÁMENES</span>
        <span>ÚLTIMO EXAMEN</span>
        <span>CALIFICACIÓN</span>
        <span></span>
      </div>
      ${a.map(t=>{const n=Q(t.id),i=n[0],r=i?U(i.faults||[]):null,l=n.find(c=>c.status!=="finalized");return`
          <div class="dir-row" data-action="view-student" data-id="${s(t.id)}" role="button" tabindex="0">
            <div class="dir-main">
              <strong>
                ${s(t.name)}
                ${l?'<em class="open-flag">[EXAMEN EN CURSO]</em>':""}
              </strong>
              <small>${s([t.phone,t.email,t.notes?t.notes.slice(0,55):""].filter(Boolean).join(" · ")||"Sin datos de contacto")}</small>
            </div>
            <div class="dir-stat mono">
              <strong>${n.length}</strong> <span class="dir-mobile-label">exám.</span>
            </div>
            <div class="dir-date mono">
              ${i?G(i.date):'<span class="text-muted">—</span>'}
            </div>
            <div class="dir-verdict">
              ${r?`<span class="verdict-tag ${r.noApto?"is-noapto":"is-apto"}">${r.result}</span>`:'<span class="text-muted">Sin evaluar</span>'}
            </div>
            <div class="dir-chevron" aria-hidden="true">Ver exámenes ›</div>
          </div>
        `}).join("")}
    </div>
  `:o.students.length?`<div class="empty-row">Ningún alumno coincide con «${s(o.studentQuery)}».</div>`:`
        <div class="empty-stage">
          <strong>No hay alumnos registrados todavía</strong>
          <p>Pulsa «+ Nuevo alumno» para crear el primer alumno y comenzar a registrar sus exámenes prácticos.</p>
          <button type="button" class="t-btn t-btn-primary" data-action="open-new-student">+ Crear primer alumno</button>
        </div>
      `}function ye(){const e=o.studentDraft,a=o.history.find(t=>t.status!=="finalized"&&t.studentId);return`
    <main class="dgt-sheet">
      ${o.showBackupsBar?`
        <section class="form-section backups-drawer">
          <div class="section-bar">
            <span>COPIAS DE SEGURIDAD (ALMACENAMIENTO LOCAL DEL DISPOSITIVO)</span>
            <button type="button" class="bar-toggle-btn" data-action="toggle-backups">Cerrar</button>
          </div>
          <div class="backup-bar">
            <span class="backup-note">
              ${o.students.length} alumno(s) y ${o.history.length} examen(es) guardados en este navegador. Exporta una copia JSON periódica de respaldo.
            </span>
            <div class="backup-buttons">
              <button type="button" class="t-btn t-btn-primary" data-action="export-all">Exportar todo (.json)</button>
              <label class="t-btn file-upload-btn" for="import-json-file">Importar copia (.json)</label>
              <input id="import-json-file" type="file" accept="application/json,.json" data-import="json" class="sr-only-input" />
            </div>
          </div>
        </section>
      `:""}

      ${a?`
        <div class="resume-banner">
          <div>
            <strong>Examen en curso sin cerrar:</strong> ${s(a.studentName||"Alumno")} (${G(a.date)})
          </div>
          <button type="button" class="t-btn t-btn-primary" data-action="edit-simulation" data-id="${s(a.id)}">Continuar evaluación ›</button>
        </div>
      `:""}

      ${o.showNewStudentForm?`
        <section class="form-section new-student-box">
          <div class="section-bar">ALTA DE NUEVO ALUMNO</div>
          <div class="meta-grid">
            <div class="meta-cell">
              <label class="cell-label" for="new-student-name">APELLIDOS Y NOMBRE *</label>
              <input id="new-student-name" type="text" class="bare-input" data-student-draft="name" value="${s(e.name)}" placeholder="Ej.: García López, María" autocomplete="off" />
            </div>
            <div class="meta-cell">
              <label class="cell-label">TELÉFONO</label>
              <input type="tel" class="bare-input" data-student-draft="phone" value="${s(e.phone)}" placeholder="600 000 000" inputmode="tel" autocomplete="off" />
            </div>
            <div class="meta-cell">
              <label class="cell-label">CORREO ELECTRÓNICO</label>
              <input type="email" class="bare-input" data-student-draft="email" value="${s(e.email)}" placeholder="Opcional" inputmode="email" autocomplete="off" />
            </div>
            <div class="meta-cell meta-cell-full">
              <label class="cell-label">OBSERVACIONES DEL ALUMNO</label>
              <textarea class="bare-textarea" rows="2" data-student-draft="notes" placeholder="Horario, tipo de cambio, anotaciones...">${s(e.notes)}</textarea>
            </div>
          </div>
          <div class="form-action-bar">
            <button type="button" class="t-btn" data-action="toggle-new-student">Cancelar</button>
            <button type="button" class="t-btn" data-action="create-student">Guardar alumno</button>
            <button type="button" class="t-btn t-btn-go" data-action="create-student-and-exam">Guardar y empezar examen</button>
          </div>
        </section>
      `:""}

      <section class="form-section">
        <div class="section-bar">
          <span>SELECCIONA UN ALUMNO (${o.students.length})</span>
        </div>
        ${o.students.length>0?`
          <div class="filter-toolbar">
            <div class="filter-search filter-search-full">
              <input type="search" data-search="students" value="${s(o.studentQuery)}" placeholder="Buscar alumno por nombre o teléfono..." autocomplete="off" />
              ${o.studentQuery?'<button type="button" class="clear-x" data-action="clear-student-query" aria-label="Limpiar">×</button>':""}
            </div>
          </div>
        `:""}

        <div id="student-results-container">
          ${Fe()}
        </div>
      </section>
    </main>
  `}function $a(){const e=Re();if(!e)return`
      <main class="dgt-sheet">
        <div class="empty-stage">
          <strong>Alumno no seleccionado</strong>
          <button type="button" class="t-btn t-btn-primary" data-action="go-students">Ir a la lista de alumnos</button>
        </div>
      </main>
    `;const a=Q(e.id),t=a.filter(i=>i.status==="finalized").length,n=a.filter(i=>!U(i.faults||[]).noApto).length;return`
    <main class="dgt-sheet">
      <section class="form-section">
        <div class="student-summary-strip">
          <div class="student-summary-info">
            <div class="student-summary-top">
              <h2>${s(e.name)}</h2>
              <button type="button" class="t-tag-btn" data-action="toggle-student-edit">
                ${o.showStudentEdit?"Ocultar ficha ▴":"Editar datos ▾"}
              </button>
            </div>
            <p class="student-summary-meta">
              ${s([e.phone,e.email].filter(Boolean).join(" · ")||"Sin teléfono / email")}
              · <strong>${a.length}</strong> ${a.length===1?"examen":"exámenes"}
              ${a.length>0?`(${n} apto${n===1?"":"s"} / ${a.length-n} no apto${a.length-n===1?"":"s"})`:""}
            </p>
            ${e.notes&&!o.showStudentEdit?`<p class="student-notes-preview">${s(e.notes)}</p>`:""}
          </div>
          <div class="student-summary-cta">
            <button type="button" class="t-btn t-btn-go t-btn-lg" data-action="new-exam-student" data-id="${s(e.id)}">
              + Nuevo examen
            </button>
          </div>
        </div>

        ${o.showStudentEdit?`
          <div class="student-edit-drawer">
            <div class="meta-grid">
              <div class="meta-cell">
                <label class="cell-label">APELLIDOS Y NOMBRE</label>
                <input type="text" class="bare-input" data-student-field="name" data-id="${s(e.id)}" value="${s(e.name)}" autocomplete="off" />
              </div>
              <div class="meta-cell">
                <label class="cell-label">TELÉFONO</label>
                <input type="tel" class="bare-input" data-student-field="phone" data-id="${s(e.id)}" value="${s(e.phone)}" inputmode="tel" autocomplete="off" />
              </div>
              <div class="meta-cell">
                <label class="cell-label">CORREO ELECTRÓNICO</label>
                <input type="email" class="bare-input" data-student-field="email" data-id="${s(e.id)}" value="${s(e.email)}" inputmode="email" autocomplete="off" />
              </div>
              <div class="meta-cell meta-cell-full">
                <label class="cell-label">NOTAS DEL ALUMNO</label>
                <textarea class="bare-textarea" rows="2" data-student-field="notes" data-id="${s(e.id)}" placeholder="Observaciones del alumno...">${s(e.notes)}</textarea>
              </div>
            </div>
            <div class="form-action-bar form-action-between">
              <button type="button" class="t-btn t-btn-danger-text" data-action="delete-student" data-id="${s(e.id)}">Eliminar alumno y su ficha</button>
              <button type="button" class="t-btn" data-action="toggle-student-edit">Listo</button>
            </div>
          </div>
        `:""}
      </section>

      <section class="form-section">
        <div class="section-bar">
          <span>EXÁMENES REALIZADOS POR EL ALUMNO (${a.length}${t<a.length?` · ${a.length-t} en curso`:""})</span>
          ${a.length>0?`<button type="button" class="bar-toggle-btn" data-action="export-student-json" data-id="${s(e.id)}">Exportar alumno (.json)</button>`:""}
        </div>

        ${a.length?`
          <div class="exams-list">
            ${a.map((i,r)=>qa(i,a.length-r)).join("")}
          </div>
        `:`
          <div class="empty-stage">
            <strong>Este alumno aún no tiene exámenes registrados</strong>
            <p>Pulsa «+ Nuevo examen» para abrir la hoja de calificación, evaluar su circulación y guardarla aquí.</p>
            <button type="button" class="t-btn t-btn-go" data-action="new-exam-student" data-id="${s(e.id)}">+ Iniciar primer examen</button>
          </div>
        `}
      </section>
    </main>
  `}function qa(e,a){const t=U(e.faults||[]),n=y(e.timers?.exam),i=e.status!=="finalized",r=o.busyExamId===e.id;return`
    <article class="exam-record ${i?"is-draft":""}">
      <div class="exam-record-top">
        <div class="exam-record-title">
          <span class="exam-num mono">#${String(a).padStart(2,"0")}</span>
          <strong class="mono">${G(e.date)}</strong>
          ${e.zone?`<span class="exam-zone">· ${s(e.zone)}</span>`:""}
          ${i?'<span class="draft-badge">EN CURSO</span>':""}
        </div>
        <span class="verdict-tag ${t.noApto?"is-noapto":"is-apto"}">${t.result}</span>
      </div>

      <div class="exam-record-metrics">
        <span class="metric-chip metric-L"><b>${t.L}</b> Leves</span>
        <span class="metric-chip metric-D"><b>${t.D}</b> Defic.</span>
        <span class="metric-chip metric-E"><b>${t.E}</b> Elimin.</span>
        ${n>0?`<span class="metric-chip mono">Tiempo: ${s(Oe(n))}</span>`:""}
        ${e.vehicle?`<span class="metric-chip">Vehículo: ${s(e.vehicle)}</span>`:""}
      </div>

      ${t.reasons.length?`<p class="exam-record-reason">Causa No Apto: ${s(t.reasons.join(" · "))}</p>`:""}
      ${e.generalNotes?`<p class="exam-record-notes">${s(e.generalNotes)}</p>`:""}

      <div class="exam-record-actions">
        <div class="export-group">
          <button type="button" class="t-btn t-btn-primary" data-action="pdf-exam" data-id="${s(e.id)}" ${r?"disabled":""}>
            ${r?"Generando...":"Descargar PDF"}
          </button>
          ${Me?`
            <button type="button" class="t-btn" data-action="share-pdf-exam" data-id="${s(e.id)}" ${r?"disabled":""}>
              Compartir PDF
            </button>
          `:""}
          <button type="button" class="t-btn" data-action="open-acta" data-id="${s(e.id)}">Ver acta / Imprimir</button>
          <button type="button" class="t-btn" data-action="csv-exam" data-id="${s(e.id)}">CSV</button>
        </div>

        <div class="manage-group">
          <button type="button" class="t-btn ${i?"t-btn-go":""}" data-action="edit-simulation" data-id="${s(e.id)}">
            ${i?"Continuar evaluación":"Editar"}
          </button>
          <button type="button" class="t-btn t-btn-danger-text" data-action="delete" data-id="${s(e.id)}">Borrar</button>
        </div>
      </div>
    </article>
  `}function Na(){if(!o.showTimersDrawer)return"";const{exam:e,parking:a,countdown:t}=o.current.timers,n=I(t)<=0&&!t.running;return`
    <section class="form-section timers-drawer no-print">
      <div class="section-bar">
        <span>CONTROL DE TIEMPOS DE PRUEBA</span>
        ${"wakeLock"in navigator?`
          <label class="inline-check">
            <input type="checkbox" data-toggle="wake-lock" ${o.wakeLockEnabled?"checked":""} />
            <span>No apagar pantalla</span>
          </label>
        `:""}
      </div>

      <div class="timers-table">
        <div class="timer-cell">
          <div class="timer-cell-head">
            <span class="cell-label">1. CIRCULACIÓN GENERAL</span>
            <span class="cell-state" data-timer-status="exam">${e.running?"EN MARCHA":y(e)>0?"PAUSADO":"PARADO"}</span>
          </div>
          <div class="timer-cell-body">
            <div class="lcd-box" data-timer-display="elapsed:exam">${$(y(e))}</div>
            <div class="timer-btn-strip" data-timer-buttons="exam">${X("exam")}</div>
          </div>
        </div>

        <div class="timer-cell">
          <div class="timer-cell-head">
            <input type="text" class="cell-label-input" data-timer-input="parkingLabel" value="${s(a.label||"Maniobra")}" aria-label="Etiqueta maniobra" />
            <span class="cell-state" data-timer-status="parking">${a.running?"EN MARCHA":y(a)>0?"PAUSADO":"PARADO"}</span>
          </div>
          <div class="timer-cell-body">
            <div class="lcd-box" data-timer-display="elapsed:parking">${$(y(a))}</div>
            <div class="timer-btn-strip" data-timer-buttons="parking">${X("parking")}</div>
          </div>
          ${a.records.length?`
            <div class="lap-table">
              ${a.records.map(r=>`
                <div class="lap-row">
                  <span>${s(r.label||"Maniobra")}</span>
                  <strong class="mono">${$(r.elapsedMs)}</strong>
                  <button type="button" class="t-link-danger" data-action="remove-time-record" data-id="${s(r.id)}">×</button>
                </div>
              `).join("")}
            </div>
          `:""}
        </div>

        <div class="timer-cell timer-cell-full ${n?"is-expired":""}">
          <div class="timer-cell-head">
            <span class="cell-label">3. CUENTA ATRÁS (DURACIÓN REGLAMENTARIA 25 MIN)</span>
            <span class="cell-state" data-timer-status="countdown">${t.running?"ACTIVO":n?"TIEMPO AGOTADO":"PREPARADO"}</span>
          </div>
          <div class="timer-cell-body countdown-row">
            <div class="lcd-box" data-timer-display="remaining:countdown">${$(I(t))}</div>
            <div class="preset-strip">
              ${[20,25,30,45].map(r=>`
                <button type="button" class="t-btn ${he(t)===r?"is-selected":""}" data-action="set-countdown" data-minutes="${r}">${r}m</button>
              `).join("")}
              <label class="min-box">
                <input type="number" min="1" max="180" step="1" data-timer-input="countdownMinutes" value="${he(t)}" aria-label="Minutos" />
                <span>min</span>
              </label>
            </div>
            <div class="timer-btn-strip" data-timer-buttons="countdown">${X("countdown")}</div>
          </div>
        </div>
      </div>
    </section>
  `}function X(e){const a=o.current.timers[e];if(e==="exam"){const t=y(a);return a.running?`
        <button type="button" class="t-btn t-btn-warn" data-action="timer-pause" data-timer="exam">Parar</button>
        <button type="button" class="t-btn" data-action="timer-reset" data-timer="exam">Cero</button>`:`
      <button type="button" class="t-btn t-btn-go" data-action="timer-start" data-timer="exam">${t>0?"Seguir":"Iniciar"}</button>
      ${t>0?'<button type="button" class="t-btn" data-action="timer-reset" data-timer="exam">Cero</button>':""}`}if(e==="parking"){const t=y(a);return a.running?`
        <button type="button" class="t-btn t-btn-primary" data-action="timer-save-record">Anotar</button>
        <button type="button" class="t-btn t-btn-warn" data-action="timer-pause" data-timer="parking">Parar</button>
        <button type="button" class="t-btn" data-action="timer-reset" data-timer="parking">Cero</button>`:`
      ${t>0?'<button type="button" class="t-btn t-btn-primary" data-action="timer-save-record">Anotar</button>':""}
      <button type="button" class="t-btn t-btn-go" data-action="timer-start" data-timer="parking">${t>0?"Seguir":"Iniciar"}</button>
      ${t>0?'<button type="button" class="t-btn" data-action="timer-reset" data-timer="parking">Cero</button>':""}`}if(e==="countdown"){const t=I(a),n=t<=0&&!a.running;return a.running?`
        <button type="button" class="t-btn t-btn-warn" data-action="countdown-pause">Parar</button>
        <button type="button" class="t-btn" data-action="countdown-reset">Reiniciar</button>`:n?'<button type="button" class="t-btn t-btn-primary" data-action="countdown-reset">Restablecer</button>':`
      <button type="button" class="t-btn t-btn-go" data-action="countdown-start">${t<a.durationMs?"Seguir":"Iniciar"}</button>
      ${t<a.durationMs?'<button type="button" class="t-btn" data-action="countdown-reset">Reiniciar</button>':""}`}return""}function F(e){if(!o.current)return;const a=o.current.timers[e],t=document.querySelector(`[data-timer-buttons="${e}"]`);t&&(t.innerHTML=X(e));const n=document.querySelector(`[data-timer-status="${e}"]`);if(n)if(e==="countdown"){const i=I(a)<=0&&!a.running;n.textContent=a.running?"ACTIVO":i?"TIEMPO AGOTADO":"PREPARADO"}else n.textContent=a.running?"EN MARCHA":y(a)>0?"PAUSADO":"PARADO";if(e==="exam"){const i=document.querySelector("#top-exam-timer-btn");i&&(i.textContent=a.running?"Parar":"Iniciar",i.dataset.action=a.running?"timer-pause":"timer-start",i.className=`inst-btn ${a.running?"is-stop":"is-start"}`)}}function xa(){const e=o.current;return`
    <section class="form-section">
      <div class="exam-meta-strip">
        <div class="exam-zone-cell">
          <label class="cell-label" for="sheet-zone-input">ZONA / RECORRIDO</label>
          <input id="sheet-zone-input" type="text" class="bare-input" data-field="zone" value="${s(e.zone)}" placeholder="Ej.: Zona 2 / Centro exámenes" autocomplete="off" />
        </div>
        <div class="date-cell">
          <label class="cell-label" for="sheet-date-input">FECHA</label>
          <input id="sheet-date-input" type="date" class="bare-input" data-field="date" value="${s(e.date)}" />
        </div>
        <button type="button" class="expand-meta-btn ${o.showHeaderMeta?"is-open":""}" data-action="toggle-header-meta">
          Notas / Vehículo ${o.showHeaderMeta?"▴":"▾"}
        </button>
      </div>

      ${o.showHeaderMeta?`
        <div class="meta-grid meta-grid-2">
          <div class="meta-cell">
            <label class="cell-label">MATRÍCULA / VEHÍCULO</label>
            <input type="text" class="bare-input" data-field="vehicle" value="${s(e.vehicle)}" placeholder="Ej.: 1234-MNP" autocomplete="off" />
          </div>
          <div class="meta-cell">
            <label class="cell-label">PROFESOR / EVALUADOR</label>
            <input type="text" class="bare-input" data-field="teacher" value="${s(e.teacher)}" placeholder="Nombre evaluador" autocomplete="off" />
          </div>
          <div class="meta-cell meta-cell-full">
            <label class="cell-label">OBSERVACIONES GENERALES DEL EXAMEN</label>
            <textarea class="bare-textarea" rows="2" data-field="generalNotes" placeholder="Valoración general de la prueba...">${s(e.generalNotes)}</textarea>
          </div>
        </div>
      `:""}
    </section>
  `}function Be(){const e=o.current?.faults||[];return e.length?`
    <details class="form-section marked-strip">
      <summary class="section-bar clickable-bar">
        <span>FALTAS ANOTADAS EN ESTE EXAMEN (${e.length})</span>
        <span class="bar-hint">Revisar / quitar ▾</span>
      </summary>
      <div class="marked-table">
        ${e.map((a,t)=>{const n=a.faultId!=null?j.get(a.faultId):null,i=n||a.snapshot||a,r=i.tipo||a.tipo||"L",l=n?.code||"—";return`
            <div class="marked-row">
              <span class="marked-code mono">${s(l)}</span>
              ${ie(r)}
              <div class="marked-desc">
                <span>${s(i.falta||"Falta")}</span>
                ${a.note?`<small class="marked-note-inline">Nota: ${s(a.note)}</small>`:""}
              </div>
              <button type="button" class="t-btn t-btn-danger-text" data-action="remove-fault" data-index="${t}">Quitar</button>
            </div>
          `}).join("")}
        <div class="marked-footer">
          <button type="button" class="t-btn" data-action="clear-current">Vaciar faltas</button>
          <button type="button" class="t-btn t-btn-go" data-action="save-and-finish">Guardar examen</button>
        </div>
      </div>
    </details>
  `:""}function Y(){const e=za(),a=o.current?.faults?.length||0;return`
    <section class="form-section">
      <div class="section-bar">
        <span>BLOQUES DE CALIFICACIÓN (1 – 15)</span>
        <button type="button" class="bar-toggle-btn" data-action="toggle-block-grid">
          ${o.showBlockGrid?"Ocultar bloques ▴":"Mostrar bloques ▾"}
        </button>
      </div>
      ${o.showBlockGrid?`
        <div class="block-matrix" role="navigation" aria-label="Bloques del examen">
          <button type="button" class="matrix-cell ${o.selectedBlock==="ALL"?"is-selected":""}" data-action="select-block" data-block="ALL">
            <span class="matrix-code">1-15</span>
            <span class="matrix-name">Todos</span>
            ${a>0?`<em class="matrix-hit">${a}</em>`:""}
          </button>
          ${J.map(t=>{const n=e.get(t.bloque)||0;return`
              <button type="button" class="matrix-cell ${o.selectedBlock===t.bloque?"is-selected":""} ${n>0?"has-hits":""}" data-action="select-block" data-block="${s(t.bloque)}">
                <span class="matrix-code">${s(t.code)}</span>
                <span class="matrix-name">${s(t.short)}</span>
                ${n>0?`<em class="matrix-hit">${n}</em>`:""}
              </button>
            `}).join("")}
        </div>
      `:""}
    </section>
  `}function Ia(){const e=[["ALL","Todas"],["L","L · Leve"],["D","D · Defic."],["E","E · Elimin."]];return`
    <div class="filter-toolbar">
      <div class="filter-search">
        <input
          type="search"
          id="catalog-search-input"
          data-search="faults"
          value="${s(o.query)}"
          placeholder="Buscar falta o código (ej. 07., retrovisor, intermitente...)"
          autocomplete="off"
        />
        ${o.query?'<button type="button" class="clear-x" data-action="clear-fault-query" aria-label="Limpiar">×</button>':""}
      </div>
      <div class="filter-sev-group" role="group" aria-label="Filtrar gravedad">
        ${e.map(([a,t])=>`
          <button type="button" class="sev-filter-btn ${o.filter===a?`is-active is-${a}`:""}" data-action="filter" data-filter="${a}">
            ${t}
          </button>
        `).join("")}
      </div>
    </div>
  `}function Ma(){const e=C(o.query).trim(),a=o.filter,t=o.selectedBlock,n=be.filter(r=>!e&&t!=="ALL"&&r.bloque!==t||a!=="ALL"&&r.tipo!==a?!1:e?C(`${r.code} ${r.falta} ${r.obs} ${r.bloque} ${r.nivel}`).includes(e):!0),i=new Map;for(const r of n)i.has(r.bloque)||i.set(r.bloque,[]),i.get(r.bloque).push(r);return i}function re(){const e=Ma(),a=wa(),t=!!o.query.trim()||o.filter!=="ALL"||o.selectedBlock!=="ALL";return e.size?[...e.entries()].map(([n,i])=>{const r=t||o.openBlocks.has(n),l=i.reduce((d,u)=>d+(a.get(u.id)||0),0),c=Ie[n],m=String(n).replace(/^\d+\.\s*/,"").toUpperCase();return`
      <details class="dgt-block" data-block="${s(n)}" ${r?"open":""}>
        <summary class="dgt-block-head">
          <span class="dgt-block-code mono">${s(c?.code||"")}</span>
          <span class="dgt-block-title">${s(m)}</span>
          <span class="dgt-block-right">
            ${l>0?`<strong class="block-marked-tag">${l} anot.</strong>`:""}
            <span class="block-total-count mono">[${i.length}]</span>
          </span>
        </summary>

        <div class="dgt-rows">
          ${i.map(d=>{const u=a.get(d.id)||0,b=u>0?(o.current?.faults||[]).filter(E=>E.faultId===d.id&&E.note).map(E=>E.note):[];return`
              <div class="dgt-fault-row ${u>0?`is-marked is-marked-${d.tipo}`:""}" data-fault-row="${d.id}">
                <button type="button" class="fault-cell-info" data-action="open-fault" data-id="${d.id}" title="Pulsar para añadir con observación">
                  <span class="fault-cell-code">
                    <span class="mono code-num">${s(d.code)}</span>
                    ${ie(d.tipo)}
                  </span>
                  <span class="fault-cell-desc">
                    <span class="fault-main-text">${s(d.falta)}</span>
                    ${d.obs?`<span class="fault-sub-text">${s(d.obs)}</span>`:""}
                    ${b.length?`<span class="fault-saved-note">Nota: ${s(b.join(" | "))}</span>`:""}
                  </span>
                </button>

                <div class="fault-cell-stepper">
                  ${u>0?`
                    <button type="button" class="step-btn step-minus" data-action="decrement-fault" data-id="${d.id}" aria-label="Restar falta ${s(d.code)}">−</button>
                    <span class="step-count mono">${u}</span>
                  `:""}
                  <button type="button" class="step-btn step-plus" data-action="quick-add-fault" data-id="${d.id}" aria-label="Anotar falta ${s(d.code)}">+</button>
                </div>
              </div>
            `}).join("")}
        </div>
      </details>
    `}).join(""):`
      <div class="empty-row">
        <span>No hay criterios que coincidan con el filtro.</span>
        <button type="button" class="t-btn" data-action="reset-fault-filters">Restablecer filtros</button>
      </div>
    `}function Ca(){return o.current?`
    <main class="dgt-sheet">
      ${Na()}
      ${xa()}
      <div id="marked-faults-slot">${Be()}</div>
      <div id="block-matrix-slot">${Y()}</div>
      <section class="form-section catalog-section">
        ${Ia()}
        <div id="catalog-table-container">
          ${re()}
        </div>
      </section>

      <div class="sheet-bottom-save no-print">
        <button type="button" class="t-btn" data-action="leave-exam">‹ Volver al alumno</button>
        <button type="button" class="t-btn t-btn-go t-btn-lg" data-action="save-and-finish">Guardar examen y ver historial del alumno</button>
      </div>

      ${ka()}
    </main>
  `:(S("students"),"")}function ka(){if(!o.openFault)return"";const e=j.get(o.openFault);if(!e)return"";const a=(o.current?.faults||[]).filter(t=>t.faultId===e.id).length;return`
    <div class="modal-backdrop" data-action="close-sheet"></div>
    <section class="dgt-modal" role="dialog" aria-modal="true" aria-labelledby="modal-fault-heading">
      <div class="dgt-modal-bar">
        <span>IMPUTACIÓN CON OBSERVACIÓN · CÓD. ${s(e.code)}</span>
        <button type="button" class="modal-close-x" data-action="close-sheet" aria-label="Cerrar">×</button>
      </div>
      <div class="dgt-modal-body">
        <div class="modal-fault-header">
          ${ie(e.tipo)}
          <div>
            <h2 id="modal-fault-heading">${s(e.falta)}</h2>
            <p class="modal-sub">${s(e.bloque)} · Gravedad ${s(ae(e.tipo))}${a>0?` · Anotada ${a} vez/veces`:""}</p>
          </div>
        </div>
        ${e.obs?`<p class="modal-criterion">${s(e.obs)}</p>`:""}

        <label class="cell-label mt-10" for="fault-note">OBSERVACIÓN ESPECÍFICA (PUNTO DEL RECORRIDO / DETALLE)</label>
        <textarea id="fault-note" class="bare-textarea framed-input" rows="3" placeholder="Ej.: Glorieta salida 2, no cede paso..."></textarea>

        <div class="modal-actions">
          <button type="button" class="t-btn" data-action="close-sheet">Cancelar</button>
          <button type="button" class="t-btn t-btn-primary" data-action="add-fault-continue" data-id="${e.id}">Imputar falta</button>
        </div>
      </div>
    </section>
  `}function Oa(){if(!o.current)return S("students"),"";g(o.current);const e=o.current,a=U(e.faults||[]),t=e.timers,n=t.parking?.records||[],i=o.busyExamId===e.id;return`
    <main class="dgt-sheet acta-sheet">
      <div class="acta-toolbar no-print">
        <button type="button" class="t-btn" data-action="edit-simulation" data-id="${s(e.id)}">Editar evaluación</button>
        <div class="acta-toolbar-right">
          <button type="button" class="t-btn t-btn-primary" data-action="pdf-exam" data-id="${s(e.id)}" ${i?"disabled":""}>
            ${i?"Generando...":"Descargar PDF"}
          </button>
          ${Me?`<button type="button" class="t-btn" data-action="share-pdf-exam" data-id="${s(e.id)}">Compartir PDF</button>`:""}
          <button type="button" class="t-btn" data-action="csv-exam" data-id="${s(e.id)}">Exportar CSV</button>
          <button type="button" class="t-btn" data-action="json-exam" data-id="${s(e.id)}">Exportar JSON</button>
          <button type="button" class="t-btn" data-action="print">Imprimir</button>
        </div>
      </div>

      <section class="official-form">
        <div class="official-title-band">
          <div>
            <strong>ACTA DE EVALUACIÓN · PRUEBA PRÁCTICA DE CIRCULACIÓN</strong>
            <span>PERMISO DE CONDUCCIÓN CLASE B</span>
          </div>
          <span class="official-state-tag">${e.status==="finalized"?"FINALIZADO":"EN CURSO"}</span>
        </div>

        <div class="official-grid">
          <div class="off-cell off-span-2">
            <span class="cell-label">ASPIRANTE</span>
            <strong>${s(e.studentName||"—")}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">FECHA</span>
            <strong class="mono">${G(e.date,"—")}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">ZONA / RECORRIDO</span>
            <strong>${s(e.zone||"—")}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">VEHÍCULO</span>
            <strong class="mono">${s(e.vehicle||"—")}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">EVALUADOR / PROFESOR</span>
            <strong>${s(e.teacher||"—")}</strong>
          </div>
        </div>

        <div class="official-score-band">
          <div class="off-score-cell">
            <span class="cell-label">FALTAS LEVES (L)</span>
            <strong class="mono">${a.L}</strong>
          </div>
          <div class="off-score-cell">
            <span class="cell-label">DEFICIENTES (D)</span>
            <strong class="mono">${a.D}</strong>
          </div>
          <div class="off-score-cell">
            <span class="cell-label">ELIMINATORIAS (E)</span>
            <strong class="mono">${a.E}</strong>
          </div>
          <div class="off-score-cell">
            <span class="cell-label">TOTAL FALTAS</span>
            <strong class="mono">${a.total}</strong>
          </div>
          <div class="off-score-cell off-verdict-cell ${a.noApto?"is-noapto":"is-apto"}">
            <span class="cell-label">CALIFICACIÓN</span>
            <strong>${a.result}</strong>
          </div>
        </div>

        ${a.reasons.length?`
          <div class="official-cause">
            <strong>MOTIVO DE NO APTO:</strong> ${s(a.reasons.join(" · "))}.
          </div>
        `:""}

        <div class="section-bar">TIEMPOS REGISTRADOS</div>
        <div class="official-times-grid">
          <div class="off-cell">
            <span class="cell-label">DURACIÓN CIRCULACIÓN</span>
            <strong class="mono">${$(y(t.exam))}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">${s((t.parking?.label||"MANIOBRA").toUpperCase())}</span>
            <strong class="mono">${$(y(t.parking))}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">CUENTA ATRÁS RESTANTE</span>
            <strong class="mono">${$(I(t.countdown))}</strong>
          </div>
        </div>
        ${n.length?`
          <div class="official-sublist">
            ${n.map(r=>`<div class="off-subrow"><span>${s(r.label||"Maniobra")}</span><strong class="mono">${$(r.elapsedMs)}</strong></div>`).join("")}
          </div>
        `:""}

        <div class="section-bar">DESGLOSE DE FALTAS CALIFICADAS (${e.faults.length})</div>
        ${e.faults.length?`
          <div class="official-faults-table">
            <div class="off-fault-thead">
              <span>Nº</span>
              <span>CÓD.</span>
              <span>TIPO</span>
              <span>DESCRIPCIÓN DEL CRITERIO / OBSERVACIONES</span>
            </div>
            ${e.faults.map((r,l)=>{const c=r.faultId!=null?j.get(r.faultId):null,m=c||r.snapshot||r,d=m.tipo||r.tipo||"L",u=c?.code||"—";return`
                <div class="off-fault-trow off-fault-trow-4">
                  <span class="mono text-muted">${l+1}</span>
                  <span class="mono">${s(u)}</span>
                  <span>${ie(d)}</span>
                  <div class="off-fault-desc">
                    <strong>${s(m.falta||"Falta")}</strong>
                    <span>${s(m.bloque||"")} (${s(ae(d))})</span>
                    ${r.note?`<div class="off-fault-note">Observación: ${s(r.note)}</div>`:""}
                  </div>
                </div>
              `}).join("")}
          </div>
        `:'<div class="empty-row">Sin faltas imputadas en la presente prueba.</div>'}

        <div class="section-bar">OBSERVACIONES GENERALES</div>
        <div class="official-notes-box">
          ${e.generalNotes?s(e.generalNotes):'<span class="text-muted">Sin observaciones adicionales.</span>'}
        </div>
      </section>
    </main>
  `}function Ta(){const e=Pe(),a=document.querySelector("#tally-L"),t=document.querySelector("#tally-D"),n=document.querySelector("#tally-E"),i=document.querySelector("#tally-verdict");a&&(a.textContent=String(e.L)),t&&(t.textContent=String(e.D)),n&&(n.textContent=String(e.E)),i&&(i.textContent=e.result,i.className=`inst-verdict ${e.noApto?"is-noapto":"is-apto"}`)}function Z(){Ta();const e=document.querySelector("#marked-faults-slot");e&&(e.innerHTML=Be());const a=document.querySelector("#block-matrix-slot");a&&(a.innerHTML=Y());const t=document.querySelector("#catalog-table-container");t&&(t.innerHTML=re())}function p(){const e={students:ye,"student-detail":$a,sheet:Ca,acta:Oa};P.innerHTML=`
    ${ja()}
    ${Da()}
    ${(e[o.screen]||ye)()}
    <div id="status-toast">${o.toast?`<div class="dgt-toast" role="status">${s(o.toast)}</div>`:""}</div>
  `,M(),L()}async function z(){o.students=(await ia()).map(Sa).filter(Boolean),o.history=(await oa()).map(g).filter(Boolean)}async function f(){if(o.current){if(g(o.current),o.current.updatedAt=A(),o.current.studentId){const e=o.students.find(a=>a.id===o.current.studentId);e&&(o.current.studentName=e.name)}await ee(o.current),o.currentPersisted=!0,await H("currentSimulationId",o.current.status==="finalized"?null:o.current.id),await z()}}let K;function Ue(e=280){window.clearTimeout(K),K=window.setTimeout(()=>{f().catch(a=>D(a,"save"))},e)}let Se;function Ra(e,a=280){window.clearTimeout(Se),Se=window.setTimeout(async()=>{try{e.updatedAt=A(),await V(e),await z(),o.current?.studentId===e.id&&(o.current.studentName=e.name,o.currentPersisted&&await f())}catch(t){D(t,"save")}},a)}async function _e(e,{immediate:a=!1}={}){const t=e.dataset.field;!t||!o.current||(o.current[t]=e.value,a?await f():Ue())}function Pa(e){const a=e.dataset.studentDraft;a&&(o.studentDraft[a]=e.value)}async function Ve(e,{immediate:a=!1}={}){const t=e.dataset.id,n=e.dataset.studentField,i=o.students.find(r=>r.id===t);if(!(!i||!n)){if(i[n]=e.value,n==="name"){const r=document.querySelector("#header-student-name");r&&(r.textContent=i.name||"Ficha de alumno")}if(a){i.updatedAt=A(),await V(i),await z();for(const r of Q(i.id))r.studentName!==i.name&&(r.studentName=i.name,await ee(r));await z()}else Ra(i)}}function He(e,{immediate:a=!1}={}){if(!o.current)return;g(o.current);const t=e.dataset.timerInput;t==="parkingLabel"&&(o.current.timers.parking.label=e.value),t==="countdownMinutes"&&Xe(e.value,{renderAfter:a}),a?f().catch(n=>D(n,"save")):Ue()}async function Le({startExam:e=!1}={}){const a=String(o.studentDraft.name||"").trim();if(!a){k("Campo obligatorio","Introduce apellidos y nombre del alumno.",{code:"STUDENT_NAME_REQUIRED"});return}const t=o.students.find(i=>C(i.name)===C(a));if(t&&!window.confirm(`Ya existe un alumno llamado «${t.name}». ¿Crear otra ficha igualmente?`))return;const n=ke({name:a,phone:String(o.studentDraft.phone||"").trim(),email:String(o.studentDraft.email||"").trim(),notes:String(o.studentDraft.notes||"").trim()});await V(n),o.studentDraft=Ce(),o.showNewStudentForm=!1,await z(),o.selectedStudentId=n.id,v("Alumno creado"),e?await Ge(n.id):(o.showStudentEdit=!1,S("student-detail"))}async function Fa(e){const a=o.students.find(i=>i.id===e);if(!a)return;const t=Q(e),n=t.length?`¿Eliminar al alumno «${a.name}» y sus ${t.length} examen(es) asociados? Esta acción no se puede deshacer.`:`¿Eliminar la ficha del alumno «${a.name}»?`;if(window.confirm(n)){for(const i of t)await je(i.id);o.current?.studentId===e&&(o.current=null,o.currentPersisted=!1,await H("currentSimulationId",null),L()),await na(e),o.selectedStudentId=null,o.showStudentEdit=!1,await z(),v("Alumno eliminado"),S("students")}}async function Ba(e){const a=o.students.find(t=>t.id===e)||await $e(e);if(!a){k("Alumno no encontrado","El expediente solicitado no existe.",{code:"STUDENT_NOT_FOUND"});return}o.selectedStudentId=a.id,o.showStudentEdit=!1,S("student-detail")}async function Ge(e){o.current&&o.currentPersisted&&oe(o.current.timers)&&(te(o.current.timers),await f());const a=o.students.find(t=>t.id===e)||await $e(e);if(!a){k("Alumno no encontrado","Selecciona un alumno válido antes de crear el examen.",{code:"STUDENT_NOT_FOUND"});return}o.selectedStudentId=a.id,o.current=g(ya(a)),o.currentPersisted=!1,o.query="",o.filter="ALL",o.selectedBlock="ALL",o.showHeaderMeta=!1,v(`Nuevo examen: ${a.name}`),S("sheet")}async function Ua(){if(!o.current)return;window.clearTimeout(K),te(o.current.timers),o.current.status="finalized",await f(),L();const e=o.current.studentId||o.selectedStudentId;v("Examen guardado en la ficha del alumno"),e?(o.selectedStudentId=e,S("student-detail")):S("students")}async function _a(){window.clearTimeout(K);const e=o.current?.studentId||o.selectedStudentId;o.current&&(La(o.current)&&!o.currentPersisted?(o.current=null,o.currentPersisted=!1):(oe(o.current.timers)&&te(o.current.timers),await f(),v(o.current.status==="finalized"?"Cambios guardados":"Guardado como examen en curso"))),L(),e?(o.selectedStudentId=e,S("student-detail")):S("students")}async function Va(e){const a=await me(e);if(!a){k("Examen no encontrado","El examen solicitado ya no existe.",{code:"SIMULATION_NOT_FOUND"});return}o.current=g(a),o.currentPersisted=!0,a.studentId&&(o.selectedStudentId=a.studentId),await H("currentSimulationId",a.status==="finalized"?null:a.id),S("sheet")}async function Ha(e){const a=await me(e);if(!a){k("Examen no encontrado","El examen solicitado ya no existe.",{code:"SIMULATION_NOT_FOUND"});return}o.current=g(a),o.currentPersisted=!0,a.studentId&&(o.selectedStudentId=a.studentId),S("acta")}async function Ee(e,{note:a=""}={}){const t=j.get(Number(e));if(!t||!o.current)return;o.current.faults.push({uid:q("fault"),faultId:t.id,tipo:t.tipo,note:a,snapshot:{...t},createdAt:A()});const n=!!o.openFault;o.openFault=null,await f(),v(`+${t.code} [${t.tipo}] anotada`),o.screen==="sheet"&&!n?Z():p()}async function Ga(e){const a=Number(e),t=o.current?.faults||[];for(let n=t.length-1;n>=0;n-=1)if(t[n].faultId===a){const i=t.splice(n,1)[0],r=j.get(a);await f(),v(`−${r?.code||""} [${i.tipo}] retirada`),o.screen==="sheet"?Z():p();return}}async function de(e){if(o.current&&o.current.id===e)return g(o.current);const a=o.history.find(t=>t.id===e)||await me(e);return a?g(a):null}function Qe(e,a){const t=URL.createObjectURL(e),n=document.createElement("a");n.href=t,n.download=a,document.body.append(n),n.click(),n.remove(),window.setTimeout(()=>URL.revokeObjectURL(t),1e3)}function ce(e,a){const t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"});Qe(t,a)}function ue(e,a="alumno"){return String(e||a).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/gi,"_").replace(/^_+|_+$/g,"").slice(0,40)||a}function Qa(e){const a=U(e.faults||[]),t=l=>`"${String(l??"").replace(/"/g,'""')}"`,n=[["Campo","Valor"].map(t).join(";"),["Alumno",e.studentName||""].map(t).join(";"),["Fecha",G(e.date,"")].map(t).join(";"),["Zona / Recorrido",e.zone||""].map(t).join(";"),["Vehículo",e.vehicle||""].map(t).join(";"),["Profesor",e.teacher||""].map(t).join(";"),["Calificación",a.result].map(t).join(";"),["Leves (L)",a.L].map(t).join(";"),["Deficientes (D)",a.D].map(t).join(";"),["Eliminatorias (E)",a.E].map(t).join(";"),["Duración circulación",Oe(y(e.timers?.exam))].map(t).join(";"),["Observaciones generales",e.generalNotes||""].map(t).join(";"),"",["Nº","Código","Tipo","Nivel","Bloque","Falta","Observación"].map(t).join(";")];(e.faults||[]).forEach((l,c)=>{const m=l.faultId!=null?j.get(l.faultId):null,d=m||l.snapshot||l,u=d.tipo||l.tipo||"L";n.push([c+1,m?.code||"",u,ae(u),d.bloque||"",d.falta||"",l.note||""].map(t).join(";"))});const i=new Blob([`\uFEFF${n.join(`\r
`)}`],{type:"text/csv;charset=utf-8"}),r=`Examen_${ue(e.studentName)}_${e.date||B()}.csv`;Qe(i,r)}async function we(e,{share:a=!1}={}){const t=await de(e);if(!t){k("Examen no disponible","No se ha encontrado el examen para exportar.",{code:"NO_ACTIVE_SIMULATION"});return}try{const n=pa(t);if(n.length&&!window.confirm(`${n.join(" ")} ¿Generar el PDF igualmente?`))return;o.busyExamId=t.id,p();const{downloadSimulationPdf:i,shareSimulationPdf:r}=await ea(async()=>{const{downloadSimulationPdf:l,shareSimulationPdf:c}=await import("./pdf-ButdBXhN.js").then(m=>m.p);return{downloadSimulationPdf:l,shareSimulationPdf:c}},[],import.meta.url);if(a){const l=await r(t,j);v(l==="shared"?"PDF compartido":"PDF descargado")}else i(t,j),v("PDF descargado")}catch(n){if(n?.name==="AbortError")return;D(n,"pdf")}finally{o.busyExamId=null,p()}}function We(e,a){if(!o.current?.timers?.[e])return null;const t=o.current.timers[e];return a&&!t.running&&(t.running=!0,t.startedAt=ne()),!a&&t.running&&(t.elapsedMs=y(t),t.running=!1,t.startedAt=null),t}async function Wa(e){g(o.current),We(e,!0),await f(),L(),M(),F(e)}async function Xa(e){g(o.current),We(e,!1),await f(),L(),M(),F(e)}async function Ja(e){g(o.current);const a=o.current.timers[e];a&&(a.elapsedMs=0,a.running=!1,a.startedAt=null,await f(),L(),M(),F(e))}async function Ya(){g(o.current);const e=o.current.timers.parking,a=y(e);a<=0||(e.records.unshift({id:q("time"),label:String(e.label||"Maniobra").trim()||"Maniobra",elapsedMs:a,note:"",createdAt:A()}),e.elapsedMs=0,e.running=!1,e.startedAt=null,await f(),L(),v("Marca de maniobra guardada"),p())}async function Za(e){g(o.current),o.current.timers.parking.records=o.current.timers.parking.records.filter(a=>a.id!==e),await f(),p()}function Xe(e,{renderAfter:a=!1}={}){g(o.current);const t=ua(e),n=o.current.timers.countdown;n.durationMs=t*60*1e3,n.remainingMs=n.durationMs,n.running=!1,n.startedAt=null,n.endedAt=null,L(),a&&p()}async function Ka(){g(o.current);const e=o.current.timers.countdown;I(e)<=0&&(e.remainingMs=e.durationMs),e.running=!0,e.startedAt=ne(),e.endedAt=null,await f(),L(),document.querySelector(".timer-cell-full")?.classList.remove("is-expired"),M(),F("countdown")}async function et(){g(o.current);const e=o.current.timers.countdown;e.remainingMs=I(e),e.running=!1,e.startedAt=null,await f(),L(),M(),F("countdown")}async function at(){g(o.current);const e=o.current.timers.countdown;e.remainingMs=e.durationMs,e.running=!1,e.startedAt=null,e.endedAt=null,await f(),L(),document.querySelector(".timer-cell-full")?.classList.remove("is-expired"),M(),F("countdown")}function M(){if(!o.current)return;const e=o.current.timers;document.querySelectorAll("[data-timer-display]").forEach(t=>{const[n,i,r]=t.dataset.timerDisplay.split(":"),l=e[i];if(!l)return;const c=n==="remaining"?I(l):y(l);t.innerHTML=$(c,{showTenths:r!=="compact"}),i==="exam"&&r==="compact"&&t.classList.toggle("is-running",!!l.running)});const a=e.countdown;a?.running&&I(a)<=0&&(a.running=!1,a.remainingMs=0,a.startedAt=null,a.endedAt=A(),L(),f().catch(t=>D(t,"save")),Ea(),v("FIN DE TIEMPO REGLAMENTARIO"),document.querySelector(".timer-cell-full")?.classList.add("is-expired"),F("countdown"))}async function Je(){await z();const e=new Map(o.students.map(t=>[C(t.name),t]));let a=!1;for(const t of o.history){if(t.studentId&&o.students.some(l=>l.id===t.studentId))continue;const n=String(t.studentName||"").trim()||"Alumno sin nombre",i=C(n);let r=e.get(i);r||(r=ke({name:n,createdAt:t.createdAt||A(),updatedAt:A()}),await V(r),e.set(i,r)),t.studentId=r.id,t.studentName=r.name,await ee(t),a=!0}a&&await z()}async function tt(e){const a=e.files?.[0];if(a)try{ba(a);const t=await a.text(),n=JSON.parse(t),{simulations:i,students:r,invalidIndexes:l}=fa(n);let c=0;for(const d of r){const u=va(d,{makeId:q,nowIso:A});u&&(await V(u),c+=1)}for(const d of i){const u=g(ga(d,{makeId:q,nowIso:A,catalogById:j}));await ee(u)}await Je(),await z(),o.showBackupsBar=!1;const m=l.length?` (${l.length} omitidas)`:"";v(`Importados ${c||o.students.length} alumnos y ${i.length} exámenes${m}`),p()}catch(t){D(t,"import")}finally{e.value=""}}async function Ye(e){const a=e.dataset.action;if(a){if(a==="clear-alert"){Ae();return}if(Ae(),a==="go-students"){S("students");return}if(a==="back-to-student"){o.selectedStudentId?S("student-detail"):S("students");return}if(a==="leave-exam")return _a();if(a==="save-and-finish")return Ua();if(a==="toggle-new-student"){o.showNewStudentForm=!o.showNewStudentForm,p(),o.showNewStudentForm&&document.querySelector("#new-student-name")?.focus();return}if(a==="open-new-student"){o.showNewStudentForm=!0,p(),document.querySelector("#new-student-name")?.focus();return}if(a==="toggle-backups"){o.showBackupsBar=!o.showBackupsBar,p();return}if(a==="toggle-student-edit"){o.showStudentEdit=!o.showStudentEdit,p();return}if(a==="clear-student-query"){o.studentQuery="",p();return}if(a==="create-student")return Le({startExam:!1});if(a==="create-student-and-exam")return Le({startExam:!0});if(a==="delete-student")return Fa(e.dataset.id);if(a==="view-student")return Ba(e.dataset.id);if(a==="new-exam-student")return Ge(e.dataset.id);if(a==="edit-simulation")return Va(e.dataset.id);if(a==="open-acta")return Ha(e.dataset.id);if(a==="pdf-exam")return we(e.dataset.id,{share:!1});if(a==="share-pdf-exam")return we(e.dataset.id,{share:!0});if(a==="csv-exam"){const t=await de(e.dataset.id);t&&(Qa(t),v("Archivo CSV descargado"));return}if(a==="json-exam"){const t=await de(e.dataset.id);t&&(ce(t,`Examen_${ue(t.studentName)}_${t.date||B()}.json`),v("Archivo JSON descargado"));return}if(a==="export-student-json"){const t=o.students.find(i=>i.id===e.dataset.id);if(!t)return;const n=Q(t.id);ce({exportedAt:A(),version:"0.6.0",students:[t],simulations:n},`Expediente_${ue(t.name)}_${B()}.json`),v("Expediente del alumno exportado");return}if(a==="export-all"){try{await z(),ce({exportedAt:A(),version:"0.6.0",students:o.students,simulations:o.history},`Respaldo_Alumnos_PermisoB_${B()}.json`),v("Copia completa descargada")}catch(t){D(t,"export")}return}if(a==="delete"){if(!window.confirm("¿Borrar definitivamente este examen de la ficha del alumno?"))return;const t=e.dataset.id;await je(t),o.current?.id===t&&(o.current=null,o.currentPersisted=!1,await H("currentSimulationId",null),L()),await z(),v("Examen borrado"),p();return}if(a==="print"){window.print();return}if(a==="toggle-header-meta"){o.showHeaderMeta=!o.showHeaderMeta,p();return}if(a==="toggle-timers"){o.showTimersDrawer=!o.showTimersDrawer,p();return}if(a==="toggle-block-grid"){o.showBlockGrid=!o.showBlockGrid;const t=document.querySelector("#block-matrix-slot");t&&(t.innerHTML=Y());return}if(a==="select-block"){const t=e.dataset.block;o.selectedBlock=o.selectedBlock===t&&t!=="ALL"?"ALL":t;const n=document.querySelector("#block-matrix-slot");n&&(n.innerHTML=Y());const i=document.querySelector("#catalog-table-container");i&&(i.innerHTML=re());return}if(a==="filter"){o.filter=e.dataset.filter,p();return}if(a==="clear-fault-query"){o.query="",p(),document.querySelector("#catalog-search-input")?.focus();return}if(a==="reset-fault-filters"){o.query="",o.filter="ALL",o.selectedBlock="ALL",p();return}if(a==="open-fault"){o.openFault=Number(e.dataset.id),p(),document.querySelector("#fault-note")?.focus();return}if(a==="close-sheet"){o.openFault=null,p();return}if(a==="quick-add-fault")return Ee(e.dataset.id);if(a==="decrement-fault")return Ga(e.dataset.id);if(a==="add-fault-continue"){const t=document.querySelector("#fault-note")?.value?.trim()||"";return Ee(e.dataset.id,{note:t})}if(a==="remove-fault"){const t=Number(e.dataset.index);if(!o.current||!Number.isInteger(t)||t<0||t>=o.current.faults.length)return;o.current.faults.splice(t,1),await f(),o.screen==="sheet"?Z():p();return}if(a==="clear-current"){if(!o.current?.faults?.length||!window.confirm("¿Anular todas las faltas anotadas en este examen?"))return;o.current.faults=[],await f(),Z();return}if(a==="timer-start")return Wa(e.dataset.timer);if(a==="timer-pause")return Xa(e.dataset.timer);if(a==="timer-reset")return Ja(e.dataset.timer);if(a==="timer-save-record")return Ya();if(a==="remove-time-record")return Za(e.dataset.id);if(a==="set-countdown"){Xe(e.dataset.minutes),await f(),p();return}if(a==="countdown-start")return Ka();if(a==="countdown-pause")return et();if(a==="countdown-reset")return at()}}P.addEventListener("input",e=>{const a=e.target;if(a.dataset.field&&_e(a),a.dataset.studentDraft&&Pa(a),a.dataset.studentField&&Ve(a),a.dataset.timerInput&&He(a),a.dataset.search==="faults"){o.query=a.value;const t=document.querySelector("#catalog-table-container");t&&(t.innerHTML=re())}else if(a.dataset.search==="students"){o.studentQuery=a.value;const t=document.querySelector("#student-results-container");t&&(t.innerHTML=Fe())}});P.addEventListener("change",async e=>{const a=e.target;try{a.dataset.field&&await _e(a,{immediate:!0}),a.dataset.studentField&&await Ve(a,{immediate:!0}),a.dataset.timerInput&&He(a,{immediate:!0}),a.dataset.import==="json"&&await tt(a),a.dataset.toggle==="wake-lock"&&(o.wakeLockEnabled=!!a.checked,await H("wakeLockEnabled",o.wakeLockEnabled),await Te(),v(o.wakeLockEnabled?"Pantalla activa fijada":"Bloqueo normal de pantalla"))}catch(t){D(t,"general")}});P.addEventListener("toggle",e=>{const a=e.target;if(!(a instanceof HTMLDetailsElement)||!a.classList.contains("dgt-block")||o.query.trim()||o.filter!=="ALL"||o.selectedBlock!=="ALL")return;const t=a.dataset.block;t&&(a.open?o.openBlocks.add(t):o.openBlocks.delete(t))},!0);P.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const t=a.tagName;t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||t==="LABEL"||(e.preventDefault(),Ye(a).catch(n=>D(n,"general")))});P.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){const a=e.target.closest(".dir-row[data-action]");a&&e.target===a&&(e.preventDefault(),Ye(a).catch(t=>D(t,"general")))}});window.addEventListener("keydown",e=>{e.key==="Escape"&&o.openFault&&(o.openFault=null,p())});document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&M(),L()});async function ot(){if("serviceWorker"in navigator)try{(await navigator.serviceWorker.register("./sw.js")).update().catch(()=>{})}catch(e){console.warn("Service worker no registrado",e)}}async function nt(){const e=ma(ze);e.length&&k("Catálogo con avisos",`Se detectaron ${e.length} avisos en el catálogo.`,{code:"CATALOG_WARNINGS"}),await De(),o.wakeLockEnabled=!!await ra("wakeLockEnabled",!1),await Je(),await z(),o.screen="students",p(),ot()}window.addEventListener("error",e=>{D(e.error||e.message,"general")});window.addEventListener("unhandledrejection",e=>{D(e.reason,"general")});nt().catch(e=>{const a=qe(e,"init");P.innerHTML=`
    <main class="dgt-sheet startup-error">
      <div class="dgt-alert" role="alert">
        <div class="dgt-alert-text">
          <strong>${s(a.title||"Error de inicio")}:</strong> ${s(a.message)}
          <span class="dgt-code">[${s(a.code||"INIT_ERROR")}]</span>
        </div>
      </div>
    </main>
  `});export{ea as _,ae as a,U as e,G as f,B as l};
