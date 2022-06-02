import React from "react";
import { ResponsiveLine } from "@nivo/line";

const graphStyle = {
    border: "ridge",
    width: "inherited",
    height: "70%",
    marginBottom: 5,
}

const Graph = (props) => {

    return (
        <div style={graphStyle}>
            <ResponsiveLine
                data={props.graphData}
                margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                colors={{ scheme: 'category10' }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[]}
            />
        </div>
    )
}

export default Graph;