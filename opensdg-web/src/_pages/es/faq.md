---
title: Preguntas Frecuentes (FAQ)
permalink: /faq/
layout: page
---

## ¿Qué significa el informe de disponibilidad de los datos general?
<p class="justified-text">
    Hemos utilizado cuatro tipos diferentes de estados para un indicador los cuales siguen, además, una estructura de colores predeterminada:
</p>

* <p class="justified-text"><span class="faq-box status complete">Disponible</span> – como mínimo, los datos principales para este indicador, están disponibles en la web, pero los datos pueden no estar completamente desagregados/desglosados todavía.</p>
* <p class="justified-text"><span class="faq-box status inprogress">En progreso</span> – hemos encontrado una fuente de datos adecuada para este indicador o un proxy relevante. Nos encontramos asegurando la calidad de los datos y preparándolos para su publicación.</p>
* <p class="justified-text"><span class="faq-box status notstarted">Explorando fuentes de datos</span> – todavía estamos buscando una fuente de datos adecuada para este indicador.</p>
* <p class="justified-text"><span class="faq-box status notapplicable">No procede</span> - Ciertos indicadores de relevancia internacional no pueden calcularse de manera significativa para Canarias o solo pueden responderse en un contexto global.</p>

<p class="justified-text">Cuando exista información adicional sobre el estado de la recopilación y presentación de informes de datos de indicadores, se mostrará en la parte superior de la página correspondiente al indicador.</p>

## ¿Con qué frecuencia se añadirán datos nuevos a esta web?
<p class="justified-text">La actualización de las series disponibles se realizará de manera trimestral, en función de la actualización de cada una de las fuentes de datos de partida de cada indicador.</p>

## ¿Qué se está haciendo para completar los indicadores?
<p class="justified-text">Las series estadísticas mostradas están armonizadas y son comparables entre las distintas autonomías al ser fruto del trabajo conjunto de los diferentes Órganos Centrales de Estadística de las Comunidades Autónomas (OCECAS). A su vez, en línea con la política de datos abiertos del ISTAC, las series pueden descargase en formatos abiertos y reutilizarse según la licencia del Instituto.</p>


## ¿Cómo de accesible es esta web?
<p class="justified-text">Nuestro objetivo es hacer esta web lo más "accesible" y "usable" posible. Estamos trabajando para conseguir un nivel AA de accesibilidad referenciado en las <a href="https://administracionelectronica.gob.es/pae_Home/pae_Estrategias/pae_Accesibilidad/pae_normativa/pae_eInclusion_Normas_Accesibilidad.html#.X8Uki7MWWUk">Guías de accesibilidad para contenido (WCAG 2.1)</a></p>

## ¿Qué exploradores puedo utilizar para ver esta web?
<p class="justified-text">Nuestra web funciona con la mayoría de las últimas versiones de los exploradores más utilizados. Existen algunas incidencias conocidas al utilizar versiones antíguas de exploradores, como por ejemplo IE8. Estamos trabajando para solucionar estas incidencias lo antes posible.</p>

## ¿Pueden otros organismos copiar este sitio web?

Sí. Este sitio web está desarrollado utilizando software y servicios 100% libres por lo que, cualquier organismo podrá reutilizar nuestro código de forma gratuita. El código de este proyecto está disponible en su [repositorio github](https://github.com/eDatos/opensdg). 

El proyecto está basado en el [proyecto base de OpenSDG](https://github.com/open-sdg/open-sdg). Sobre esta base se ha llevado a cabo el siguiente conjunto de mejoras: 

* Adaptación a los acuerdos tomados por los Órganos Centrales de Estadística de las Comunidades Autónomas (OCECAS). 
  * Modificación de la descripción del proyecto en la página de inicio.
  * Añadida página de Información relativa al proyecto.
  * Adaptadas las fichas de metadatos a las fichas metodológicas consensuadas.
  * Añadidas las series acordadas para cada uno de los indicadores.
    * En consecuencia a esto, se han filtrado las series para tener en cuenta únicamente los indicadores en el informe presentado en el menú Disponibilidad de datos
  * Posibilidad de visualizar todas las series de un indicador de manera conjunta (para poder realizar comparaciones) pero también un gráfico independiente para cada una de ellas. 
	* Definidas dimensiones de desagregación para facilitar la visualización, comprensión y comparación de series temporales.
  * Añadida una dimensión territorial para incluir datos de diferentes territorios.
    * Añadida configuración para uso de códigos NUTS para identificar el territorio.
  * Añadida configuración para diferenciar cada serie que compone un indicador utilizando la nomenclatura SERIE-N, siendo N una letra que identifica la serie en cuestión. Esta nomenclatura se utiliza tanto en la leyenda del indicador como en las fichas de metadatos.
* Integración con los estilos corporativos del proyecto eDatos. 
* Modificaciones estéticas varias entre las que se encuentran: 
  * Modificación de los estilos de las gráficas y leyendas de estas para evitar que los títulos se corten cuando son muy largos. 
  * Modificación de los colores de las etiquetas de estado de los indicadores para conseguir un mejor contraste. 
  * Modificación del menú principal para conseguir un aspecto más compacto. 
* En la página de inicio, añadido un botón para descargar la metodología. 
* En las páginas de detalle de un indicador, añadidos botones para navegar al indicador previo o el indicador siguiente de una forma más sencilla e intuitiva. 
* Mejoras relacionadas con la gestión de indicadores sin datos publicados: 
  * En las búsquedas no se devuelven resultados de indicadores que no contengan datos. 
  * No se puede navegar a indicadores que no tengan datos. 
* En las páginas de detalle de un indicador, implementados filtros dinámicos en función de la unidad de medida seleccionada. Esto es, no se da la opción de seleccionar series que no contengan datos para la unidad de medida seleccionada.
* Adaptación del contenido del FAQ. 
* Mejora de la traducción al español. 
* Actualización del listado de indicadores con la última versión publicada por Naciones Unidas (Global indicator framework adopted by the General Assembly (A/RES/71/313), annual refinements contained in E/CN.3/2018/2 (Annex II), E/CN.3/2019/2 (Annex II), and 2020 Comprehensive Review changes (Annex II) and annual refinements (Annex III) contained in E/CN.3/2020/2).
* Actualizada la accesibilidad a las Guías de Accesibilidad para contenido (WCAG 2.1)
