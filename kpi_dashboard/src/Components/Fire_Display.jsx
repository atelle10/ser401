import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CallVolumeLinearChart from "./Dashboard/KPIs/CallVolumeLinearChart";
import HeatMapDayHour from "./Dashboard/KPIs/HeatMapDayHour";
import IncidentsByPostalCode from './Dashboard/KPIs/IncidentsByPostalCode'
import IncidentTypeBreakdown from './Dashboard/KPIs/IncidentTypeBreakdown'
import { createSwapy } from "swapy";
import { fetchKPIData, fetchKPISummary, fetchIncidentHeatmap, fetchPostalBreakdown, fetchTypeBreakdown, fetchUnitOrigin } from "../services/incidentDataService";

const Fire_Display = () => {
    const components = [ 
        <CallVolumeLinearChart />, 
        <HeatMapDayHour />, 
        <IncidentsByPostalCode />,
        <IncidentTypeBreakdown />
    ]
    return (
        <div className="p-8 text-center text-gray-300">
            Fire module coming soon...
        </div>
    )
}

export default Fire_Display