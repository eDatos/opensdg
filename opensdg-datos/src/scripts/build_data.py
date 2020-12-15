# import shutil
import os
import re
import fixes
from sdg import open_sdg
from sdg import IndicatorExportService


# Validate the indicators.
print("Validando datos...")
validation_successful = open_sdg.open_sdg_check(config='config_data.yml')

# If everything was valid, perform the build.
if not validation_successful:
    raise Exception('There were validation errors. See output above.')
else:
    print("Creando índice...")
    fixes.create_index_csv()
    print("Construyendo datos...")
    open_sdg.open_sdg_build(config='config_data.yml')