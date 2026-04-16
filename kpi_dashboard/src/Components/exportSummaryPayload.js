const HEATMAP_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TOP_N = 3

const isFiniteNumber = (value) => Number.isFinite(Number(value))

const toRoundedNumber = (value, digits = 1) => {
  if (!isFiniteNumber(value)) return null
  return Number(Number(value).toFixed(digits))
}

const toInteger = (value) => {
  if (!isFiniteNumber(value)) return null
  return Math.round(Number(value))
}

const buildOverview = (overviewData) => ({
  total_incidents: toInteger(overviewData?.total_incidents),
  avg_response_time_minutes: toRoundedNumber(overviewData?.avg_response_time_minutes),
  active_units: toInteger(overviewData?.active_units),
  peak_load_factor: toRoundedNumber(overviewData?.peak_load_factor, 2),
  peak_hour: toInteger(overviewData?.peak_hour),
})

const buildHeatmapHighlight = (heatmapData) => {
  if (!Array.isArray(heatmapData) || heatmapData.length === 0) return null

  const busiestCell = heatmapData.reduce((best, row) => {
    const count = toInteger(row?.count)
    if (count == null) return best
    if (!best || count > best.count) {
      return {
        day_index: toInteger(row?.day_index),
        hour: toInteger(row?.hour),
        count,
      }
    }
    return best
  }, null)

  if (!busiestCell) return null

  return {
    busiest_day: HEATMAP_DAYS[busiestCell.day_index] || null,
    busiest_hour: busiestCell.hour,
    max_incidents_per_cell: busiestCell.count,
  }
}

const buildPostalCodeHighlight = (postalData) => {
  if (!Array.isArray(postalData) || postalData.length === 0) return null

  const top_postal_codes = postalData
    .filter((row) => row?.zip && isFiniteNumber(row?.count))
    .slice()
    .sort((a, b) => Number(b.count) - Number(a.count))
    .slice(0, TOP_N)
    .map((row) => ({
      zip: String(row.zip),
      count: toInteger(row.count),
      avg_response_minutes: toRoundedNumber(row.avg_response_minutes),
    }))

  return top_postal_codes.length > 0 ? { top_postal_codes } : null
}

const buildTypeBreakdownHighlight = (typeBreakdownData) => {
  if (!Array.isArray(typeBreakdownData?.types) || typeBreakdownData.types.length === 0) {
    return null
  }

  const top_incident_types = typeBreakdownData.types
    .filter((row) => row?.type && isFiniteNumber(row?.count))
    .slice(0, TOP_N)
    .map((row) => ({
      type: String(row.type),
      count: toInteger(row.count),
    }))

  return top_incident_types.length > 0 ? { top_incident_types } : null
}

const buildTopUhuUnits = ({ incidentData, timePeriodHours }) => {
  if (!Array.isArray(incidentData) || incidentData.length === 0 || !isFiniteNumber(timePeriodHours) || timePeriodHours <= 0) {
    return []
  }

  const unitHours = incidentData.reduce((accumulator, incident) => {
    if (!incident?.unit_id || !incident?.dispatch_time || !incident?.clear_time) {
      return accumulator
    }

    const dispatch = new Date(incident.dispatch_time)
    const clear = new Date(incident.clear_time)
    if (Number.isNaN(dispatch.getTime()) || Number.isNaN(clear.getTime()) || clear <= dispatch) {
      return accumulator
    }

    const busyHours = (clear - dispatch) / (1000 * 60 * 60)
    if (!Number.isFinite(busyHours) || busyHours <= 0 || busyHours > 24) {
      return accumulator
    }

    accumulator[incident.unit_id] = (accumulator[incident.unit_id] || 0) + busyHours
    return accumulator
  }, {})

  return Object.entries(unitHours)
    .map(([unit_id, busyHours]) => ({
      unit_id,
      uhu: toRoundedNumber((busyHours / timePeriodHours) * 100),
    }))
    .filter((row) => row.uhu != null)
    .sort((a, b) => b.uhu - a.uhu)
    .slice(0, TOP_N)
}

const buildUnitHourUtilizationHighlight = ({ incidentData, unitOriginData, timePeriodHours }) => {
  const top_units = buildTopUhuUnits({ incidentData, timePeriodHours })
  const scottsdale_uhu = toRoundedNumber(unitOriginData?.scottsdale_uhu)
  const non_scottsdale_uhu = toRoundedNumber(unitOriginData?.non_scottsdale_uhu)

  if (top_units.length === 0 && scottsdale_uhu == null && non_scottsdale_uhu == null) {
    return null
  }

  return {
    top_units,
    scottsdale_uhu,
    non_scottsdale_uhu,
  }
}

const buildCallVolumeTrendHighlight = (callVolumeData) => {
  const trendData = Array.isArray(callVolumeData?.trend_data) ? callVolumeData.trend_data : []
  if (trendData.length === 0) return null

  const counts = trendData
    .map((row) => toInteger(row?.count))
    .filter((count) => count != null)
  if (counts.length === 0) return null

  const peakBucket = trendData.reduce((best, row) => {
    const count = toInteger(row?.count)
    if (count == null) return best
    if (!best || count > best.count) {
      return {
        label: row?.date || null,
        count,
      }
    }
    return best
  }, null)

  if (!peakBucket) return null

  const total = counts.reduce((sum, count) => sum + count, 0)

  return {
    peak_bucket_label: peakBucket.label,
    peak_bucket_count: peakBucket.count,
    average_bucket_count: toRoundedNumber(total / counts.length),
  }
}

const buildMutualAidHighlight = (mutualAidData) => {
  const scottsdale_units_outside = toInteger(mutualAidData?.scottsdale_units_outside)
  const other_units_in_scottsdale = toInteger(mutualAidData?.other_units_in_scottsdale)

  if (scottsdale_units_outside == null && other_units_in_scottsdale == null) {
    return null
  }

  return {
    scottsdale_units_outside,
    other_units_in_scottsdale,
  }
}

const buildResponseTimeBreakdownHighlight = (responseTimeData) => {
  const overall = responseTimeData?.overall
  if (!overall) return null

  const normalizeMetric = (metric) => {
    if (!metric) return null

    const avg = toRoundedNumber(metric.avg)
    const p90 = toRoundedNumber(metric.p90)
    if (avg == null && p90 == null) return null

    return { avg, p90 }
  }

  const normalizedOverall = {
    call_processing: normalizeMetric(overall.call_processing),
    turnout: normalizeMetric(overall.turnout),
    travel: normalizeMetric(overall.travel),
  }

  if (!normalizedOverall.call_processing && !normalizedOverall.turnout && !normalizedOverall.travel) {
    return null
  }

  return { overall: normalizedOverall }
}

export const buildExportSummaryPayload = ({
  settings,
  dateRange,
  overviewData,
  previewData,
  callVolumeData,
  mutualAidData,
  timePeriodHours,
}) => {
  const selectedCharts = Array.isArray(settings?.selectedCharts) ? settings.selectedCharts : []
  const selectedChartSet = new Set(selectedCharts)
  const highlights = {}

  if (selectedChartSet.has('heatmap')) {
    const highlight = buildHeatmapHighlight(previewData?.heatmapData)
    if (highlight) highlights.heatmap = highlight
  }

  if (selectedChartSet.has('postal_code')) {
    const highlight = buildPostalCodeHighlight(previewData?.postalData)
    if (highlight) highlights.postal_code = highlight
  }

  if (selectedChartSet.has('type_breakdown')) {
    const highlight = buildTypeBreakdownHighlight(previewData?.typeBreakdownData)
    if (highlight) highlights.type_breakdown = highlight
  }

  if (selectedChartSet.has('unit_hour_utilization')) {
    const highlight = buildUnitHourUtilizationHighlight({
      incidentData: previewData?.incidentData,
      unitOriginData: previewData?.unitOriginData,
      timePeriodHours,
    })
    if (highlight) highlights.unit_hour_utilization = highlight
  }

  if (selectedChartSet.has('call_volume_trend')) {
    const highlight = buildCallVolumeTrendHighlight(callVolumeData)
    if (highlight) highlights.call_volume_trend = highlight
  }

  if (selectedChartSet.has('mutual_aid')) {
    const highlight = buildMutualAidHighlight(mutualAidData)
    if (highlight) highlights.mutual_aid = highlight
  }

  if (selectedChartSet.has('response_time_breakdown')) {
    const highlight = buildResponseTimeBreakdownHighlight(previewData?.responseTimeData)
    if (highlight) highlights.response_time_breakdown = highlight
  }

  return {
    region: settings?.region || 'all',
    start_date: dateRange?.startDate || '',
    end_date: dateRange?.endDate || '',
    selected_charts: selectedCharts,
    overview: buildOverview(overviewData),
    highlights,
  }
}
