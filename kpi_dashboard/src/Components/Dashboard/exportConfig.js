export const regionOptions = [
  { label: 'All', value: 'all' },
  { label: 'South Scottsdale', value: 'south' },
  { label: 'North Scottsdale', value: 'north' },
]

export const chartOptions = [
  { label: 'Heatmap', value: 'heatmap' },
  { label: 'Postal Code', value: 'postal_code' },
  { label: 'Type Breakdown', value: 'type_breakdown' },
  { label: 'Unit Hour Utilization', value: 'unit_hour_utilization' },
  { label: 'Call Volume Trend', value: 'call_volume_trend' },
  { label: 'Mutual Aid', value: 'mutual_aid' },
  { label: 'Response Time Breakdown', value: 'response_time_breakdown' },
]

const defaultRegionValue = regionOptions[0]?.value || 'all'
const validChartValues = new Set(chartOptions.map(({ value }) => value))
const validRegionValues = new Set(regionOptions.map(({ value }) => value))

export const getSelectedChartValues = ({
  heatmapVisible,
  postalCodeVisible,
  typeBreakdownVisible,
  unitHourUtilizationVisible,
  callVolumeVisible,
  mutualAidVisible,
  responseTimeVisible,
}) => {
  const selectedCharts = [
    heatmapVisible && 'heatmap',
    postalCodeVisible && 'postal_code',
    typeBreakdownVisible && 'type_breakdown',
    unitHourUtilizationVisible && 'unit_hour_utilization',
    callVolumeVisible && 'call_volume_trend',
    mutualAidVisible && 'mutual_aid',
    responseTimeVisible && 'response_time_breakdown',
  ].filter(Boolean)

  return selectedCharts
}

export const buildExportSettings = ({
  region,
  dateInputs,
  heatmapVisible,
  postalCodeVisible,
  typeBreakdownVisible,
  unitHourUtilizationVisible,
  callVolumeVisible,
  mutualAidVisible,
  responseTimeVisible,
}) => ({
  region,
  startDate: dateInputs.start,
  endDate: dateInputs.end,
  selectedCharts: getSelectedChartValues({
    heatmapVisible,
    postalCodeVisible,
    typeBreakdownVisible,
    unitHourUtilizationVisible,
    callVolumeVisible,
    mutualAidVisible,
    responseTimeVisible,
  }),
})

export const buildIsoRangeFromDateInputs = ({ start, end }) => {
  if (!start || !end) return { startDate: null, endDate: null }

  const startDate = new Date(`${start}T00:00:00.000Z`).toISOString()
  const endDate = new Date(`${end}T23:59:59.999Z`).toISOString()
  return { startDate, endDate }
}

export const buildExportPreviewSearch = ({
  region,
  startDate,
  endDate,
  selectedCharts = [],
}) => {
  const params = new URLSearchParams()
  const normalizedRegion = validRegionValues.has(region) ? region : defaultRegionValue
  const normalizedCharts = selectedCharts.filter((value) => validChartValues.has(value))

  params.set('region', normalizedRegion)

  if (startDate) params.set('startDate', startDate)
  if (endDate) params.set('endDate', endDate)
  if (normalizedCharts.length > 0) {
    params.set('charts', normalizedCharts.join(','))
  }

  return params.toString()
}

export const parseExportPreviewSearch = (search) => {
  const params = new URLSearchParams(search)
  const region = params.get('region')
  const chartsParam = params.get('charts') || ''

  return {
    region: validRegionValues.has(region) ? region : defaultRegionValue,
    startDate: params.get('startDate') || '',
    endDate: params.get('endDate') || '',
    selectedCharts: chartsParam
      .split(',')
      .map((value) => value.trim())
      .filter((value) => validChartValues.has(value)),
  }
}

export const getRegionLabel = (regionValue) =>
  regionOptions.find(({ value }) => value === regionValue)?.label || regionValue

export const getSelectedChartOptions = (selectedCharts = []) =>
  chartOptions.filter(({ value }) => selectedCharts.includes(value))
