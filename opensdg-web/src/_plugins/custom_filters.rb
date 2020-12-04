module Jekyll::CustomFilters
    COMPLETE = 0
    COMPLETE_STRING = "complete"
    IN_PROGRESS = 1
    IN_PROGRESS_STRING = "inprogress"
    NOT_STARTED = 2
    NOT_STARTED_STRING = "notstarted"
    NOT_APPLICABLE = 3
    NOT_APPLICABLE_STRING = "notapplicable"

    
    ##
    # Corrige los datos de la estructura pasada utilizando los indicadores pasados
    # Params:
    # +data_to_fix+:: Estructura Hash que se va a corregir
    # +indicators+:: Indicadores que se va a utilizar para corregir la estructura Hash
    def fix_data(data_to_fix, indicators)
        data_to_fix['totals']['total'] = indicators.length()

        complete_indicators = indicators.select { |i| i['reporting_status'] == COMPLETE_STRING }.length()
        inprogress_indicators = indicators.select { |i| i['reporting_status'] == IN_PROGRESS_STRING }.length()
        notstarted_indicators = indicators.select { |i| i['reporting_status'] == NOT_STARTED_STRING }.length()
        notapplicable_indicators = indicators.select { |i| i['reporting_status'] == NOT_APPLICABLE_STRING }.length()

        data_to_fix['statuses'][COMPLETE]['count'] = complete_indicators
        data_to_fix['statuses'][COMPLETE]['percentage'] = ((complete_indicators.to_f / indicators.length().to_f) * 100.0).round(2)

        data_to_fix['statuses'][IN_PROGRESS]['count'] = inprogress_indicators
        data_to_fix['statuses'][IN_PROGRESS]['percentage'] = ((inprogress_indicators.to_f / indicators.length().to_f) * 100.0).round(2)

        data_to_fix['statuses'][NOT_STARTED]['count'] = notstarted_indicators
        data_to_fix['statuses'][NOT_STARTED]['percentage'] = ((notstarted_indicators.to_f / indicators.length().to_f) * 100.0).round(2)

        data_to_fix['statuses'][NOT_APPLICABLE]['count'] = notapplicable_indicators
        data_to_fix['statuses'][NOT_APPLICABLE]['percentage'] = ((notapplicable_indicators.to_f / indicators.length().to_f) * 100.0).round(2)
    end
    

    ##
    # Devuelve los indicadores asociados con un Objetivo concreto
    # Params:
    # +indicators+:: Indicadores que se van a filtrar
    # +goal+:: Objetivo del que se quieren recuperar sus indicadores
    def get_indicators_goal(indicators, goal)
        return indicators.select { |i| i['number'].match(/^#{goal}\..*/) }
    end


    ##
    # Corrige los datos de la estructura pasada utilizando los indicadores filtrados por objetivo
    # Params:
    # +data_to_fix+:: Estructura Hash que se va a corregir
    # +indicators+:: Indicadores que se van a filtrar
    # +goal+:: Objetivo del que se quieren recuperar sus indicadores
    def fix_objetive_data(data_to_fix, indicators, goal)
        fix_data(data_to_fix, get_indicators_goal(indicators, goal))
    end


    ##
    # Corrige los datos de la estructura Hash que representa los datos para la página del estado de los informes
    # Params:
    # +reporting_data+:: Estructura Hash que representa los datos para el informe que va a ser corregida.
    # +indicators+:: Todos los indicadores y subindicadores que hay definidos
    def fix_reporting_status(reporting_data, indicators)
        filtered_indicators = indicators.select { |i| not i['number'].match(/.*SERIE.*/) }
        fix_data(reporting_data['overall'], filtered_indicators)
        puts get_indicators_goal(filtered_indicators, 1).map { |i| i['number'] }
        
        for goal in 1..17 do # 17 Objetivos
            fix_objetive_data(reporting_data['goals'][goal - 1], filtered_indicators, goal)
        end
    end
end

Liquid::Template.register_filter(Jekyll::CustomFilters)