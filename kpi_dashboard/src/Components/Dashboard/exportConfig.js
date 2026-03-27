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
