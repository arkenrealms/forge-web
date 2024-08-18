import React from 'react'
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   YAxis,
//   XAxis,
//   Tooltip,
//   Label,
//   // XAxis
// } from 'recharts'

const SimpleLineChart = ({ data, yLabel = undefined, xLabel = undefined }) => {
  //   const themeContext = useContext(ThemeContext);
  const lineColor = '#bb955e'
  const textColor = '#fff'
  const gridColor = '#333'
  const highest = Math.ceil(Math.max(...data.map((d) => d.AVG)))

  return <></>
  // return (
  //   <ResponsiveContainer width="100%" height="100%">
  //     <LineChart data={data}>
  //       {yLabel ? (
  //         <YAxis type="number" domain={[0, highest > 4 ? highest : 4]} interval={0}>
  //           <Label angle={270} position="left" style={{ textAnchor: 'middle' }}>
  //             {yLabel}
  //           </Label>
  //         </YAxis>
  //       ) : null}
  //       {xLabel ? (
  //         <XAxis dataKey="name" interval={0}>
  //           <Label offset={0} position="bottom" style={{ textAnchor: 'middle' }}>
  //             {xLabel}
  //           </Label>
  //         </XAxis>
  //       ) : null}
  //       <Tooltip />

  //       {/* <CartesianGrid strokeDasharray="3 3" stroke={gridColor} /> */}
  //       <Line
  //         //   type="monotone"
  //         dataKey="AVG"
  //         stroke={lineColor}
  //         strokeWidth={2}
  //         dot={false}
  //       />
  //       {/* <Line
  //         type="monotone"
  //         dataKey="LOW"
  //         stroke="#000000"
  //         strokeWidth={1}
  //         dot={false}
  //       />
  //       <Line
  //         type="monotone"
  //         dataKey="HIGH"
  //         stroke="#ffffff"
  //         strokeWidth={1}
  //         dot={false}
  //       /> */}
  //     </LineChart>
  //   </ResponsiveContainer>
  // )
}
export default SimpleLineChart
