# Open SDG - Data starter

This is a starter repository to help in implementing the [Open SDG](https://github.com/open-sdg/open-sdg) platform. [See here for documentation](https://open-sdg.readthedocs.io).


# Instrucciones para el formateo de las páginas de los indicadores.

Para crear los indicadores de Canarias con 4 dígitos se creará el .md del indicador de forma normal y luego simplemente se utilizará el parámetro `target_id` para expresar quien sería el punto del que cuelga este. El formato de `target_id` debe ser el mismo que el de `indicator_number`.

Código de un indicador `1-1-1-1.md` de ejemplo:

````yml
---
data_non_statistical: true

goal_meta_link: https://unstats.un.org/sdgs/metadata/files/Metadata-01-01-01a.pdf

goal_meta_link_text: United Nations Sustainable Development Goals Metadata (pdf 894kB)

graph_title: INDICADOR DE PRUEBA

graph_type: line

indicator_number: 1.1.1.1

indicator_name: INDICADOR DE PRUEBA

indicator_sort_order: 01-01-01-01

published: true

reporting_status: notstarted

sdg_goal: '1'

target_name: global_targets.1-2-title

target_id: '1.1.1' # Al apuntar a 1.1.1 se crea la jerarquía.

un_custodian_agency: World Bank

un_designated_tier: '1'
---
````