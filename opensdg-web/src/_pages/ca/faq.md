---
title: Preguntes freqüents (PMF)
permalink: /ca/faq/
layout: page
language: ca
---

## Què significa l’informe de disponibilitat de les dades general?
<p class="justified-text">
    Hem utilitzat quatre tipus diferents d’estats per a un indicador, que a més segueixen una estructura de colors predeterminada:
</p>

* <p class="justified-text"><span class="faq-box status complete">Disponible</span>: com a mínim, les dades principals per a aquest indicador estan disponibles a la web, però pot ser que les dades encara no estiguin completament desagregades o desglossades.</p>
* <p class="justified-text"><span class="faq-box status inprogress">En curs</span>: hem trobat una font de dades adequada per a aquest indicador o un proxy rellevant. Estem comprovant la qualitat de les dades i preparant-les per a la publicació.</p>
* <p class="justified-text"><span class="faq-box status notstarted">S’estan explorant les fonts de dades</span>: encara estem buscant una font de dades adequada per a aquest indicador.</p>
* <p class="justified-text"><span class="faq-box status notapplicable">No procedeix</span>: certs indicadors de rellevància internacional no poden calcular-se de manera significativa per a Canàries o només es poden respondre en un context global.</p>

<p class="justified-text">Quan hi hagi informació addicional sobre l’estat de la recopilació i presentació d’informes de dades d’indicadors, es mostrarà a la part superior de la pàgina corresponent a l’indicador.</p>

## Amb quina freqüència s’afegiran dades noves a aquesta web?
<p class="justified-text">L’actualització de les sèries disponibles es farà trimestralment, en funció de l’actualització de cadascuna de les fonts de dades de partida de cada indicador.</p>

## Què s’està fent per completar els indicadors?
<p class="justified-text">Les sèries estadístiques mostrades estan harmonitzades i són comparables entre les diferents autonomies en ser fruit del treball conjunt dels diferents Òrgans Centrals d’Estadística de les Comunitats Autònomes (OCECA). Al mateix temps, en línia amb la política de dades obertes de l’ISTAC, les sèries poden descarregar-se en formats oberts i reutilitzar-se segons la llicència de l’Institut.</p>


## Com n’és d’accessible la web?
<p class="justified-text">El nostre objectiu és fer aquesta web tant "accessible" i "usable" com sigui possible. Estem treballant per aconseguir un nivell AA d’accessibilitat tal com s’esmenta a les <a href="https://administracionelectronica.gob.es/pae_Home/pae_Estrategias/pae_Accesibilidad/pae_normativa/pae_eInclusion_Normas_Accesibilidad.html?idioma=ca#.YJwxIKEp7IU">Guies d’accessibilitat per a contingut (WCAG 2.1)</a></p>

## Quins navegadors puc fer servir per veure aquesta web?
<p class="justified-text">La nostra web funciona amb la majoria de les versions més recents dels navegadors més utilitzats. Existeixen certes incidències conegudes en utilitzar versions antigues de navegadors, com, per exemple, l’IE8. Estem treballant per solucionar aquestes incidències tan aviat com sigui possible.</p>

## Poden altres organismes copiar aquest lloc web?

Sí. Aquest lloc web està desenvolupat mitjançant software i serveis 100 % lliures, de manera que qualsevol organisme podrà reutilitzar el nostre codi de franc. El codi d’aquest projecte està disponible al seu [repositori github](https://github.com/eDatos/opensdg). 

El projecte es basa en el [projecte base d’OpenSDG](https://github.com/open-sdg/open-sdg). Sobre aquesta base s’ha dut a terme el conjunt de millores següent: 

* Adaptació als acords presos pels Òrgans Centrals d’Estadística de les Comunitats Autònomes (OCECA). 
  * Modificació de la descripció del projecte a la pàgina d’inici.
  * Addició de la pàgina Informació relativa al projecte.
  * Adaptació de les fitxes de metadades a les fitxes metodològiques consensuades.
  * Addició de les sèries acordades per a cadascun dels indicadors.
    * Com a conseqüència, s’han filtrat les sèries perquè tinguin en compte únicament els indicadors a l’informe presentat en el menú Disponibilitat de dades.
  * Possibilitat de visualitzar totes les sèries d’un indicador de manera conjunta (per poder fer comparacions) però també un gràfic independent per a cadascuna. 
	* Definició de dimensions de desagregació per facilitar la visualització, comprensió i comparació de sèries temporals.
  * Addició d’una dimensió territorial per incloure dades de diferents territoris.
    * Addició de la configuració per a ús de codis NUTS per identificar el territori.
  * Addició de la configuració per diferenciar cada sèrie que compon un indicador mitjançant la nomenclatura SERIE-N, on N és una lletra que identifica la sèrie en qüestió. Aquesta nomenclatura s’utilitza tant a la llegenda de l’indicador com a les fitxes de metadades.
* Integració amb els estils corporatius del projecte eDatos. 
* Modificacions estètiques diverses, entre les quals: 
  * Modificació dels estils de les gràfiques i llegendes corresponents per evitar que els títols es tallin quan són molt llargs. 
  * Modificació dels colors de les etiquetes d’estat dels indicadors per aconseguir un millor contrast. 
  * Modificació del menú principal per obtenir un aspecte més compacte. 
* A la pàgina d’inici, s’ha afegit un botó per descarregar la metodologia. 
* A les pàgines de detall d’un indicador, s’han afegit botons per navegar a l’indicador previ o l’indicador següent d’una manera més senzilla i intuïtiva. 
* Millores relacionades amb la gestió d’indicadors sense dades publicades: 
  * A les cerques no es retornen resultats d’indicadors que no continguin dades. 
  * No es pot navegar a indicadors que no tinguin dades. 
* A les pàgines de detall d’un indicador, s’han implementat filtres dinàmics en funció de la unitat de mesura seleccionada. És a dir, no hi ha l’opció de seleccionar sèries que no continguin dades per a la unitat de mesura seleccionada.
* Adaptació del contingut de les PMF. 
* Millora de la traducció a espanyol. 
* Actualització del llistat d’indicadors amb l’última versió publicada per les Nacions Unides (Global indicator framework adopted by the General Assembly (A/RES/71/313), annual refinements contained in E/CN.3/2018/2 (Annex II), E/CN.3/2019/2 (Annex II), and 2020 Comprehensive Review changes (Annex II) and annual refinements (Annex III) contained in E/CN.3/2020/2).
* Actualització de l’accessibilitat a les Guies d’accessibilitat per a contingut (WCAG 2.1)
