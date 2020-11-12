# import shutil
from sdg.open_sdg import open_sdg_build
from sdg.open_sdg import open_sdg_check

# Validate the indicators.
print("Validando datos...")
validation_successful = open_sdg_check(config='config_data.yml')

# If everything was valid, perform the build.
if not validation_successful:
    raise Exception('There were validation errors. See output above.')
else:
    print("Construyendo datos...")
    open_sdg_build(config='config_data.yml')