import type {
    LineSeriesOption
} from "echarts/charts";
import { LineChart } from "echarts/charts";
import type { GridComponentOption } from "echarts/components";
import {
    GridComponent,
    TooltipComponent
} from "echarts/components";
import type { ComposeOption, ECharts, SetOptionOpts } from "echarts/core";
import { getInstanceByDom, init, use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { createElement } from "preact";
import { useEffect, useRef } from "preact/hooks";
import JSX = createElement.JSX;
import { JSXInternal } from "preact/src/jsx";
import CSSProperties = JSXInternal.CSSProperties;

// Register the required components
use([
    LineChart,
    GridComponent,
    TooltipComponent,
    SVGRenderer
]);

// Combine an Option type with only required components and charts via ComposeOption
export type EChartsOption = ComposeOption<
    | LineSeriesOption
    | GridComponentOption
    >;

export interface ReactEChartsProps {
    option: EChartsOption;
    style?: CSSProperties;
    settings?: SetOptionOpts;
    loading?: boolean;
    theme?: "light" | "dark";
}

export function ReactECharts({
    option,
    style,
    settings,
    loading,
    theme
}: ReactEChartsProps): JSX.Element {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize chart
        let chart: ECharts | undefined;
        if (chartRef.current !== null) {
            chart = init(chartRef.current, theme, { renderer: "svg" });
        }

        // Add chart resize listener
        // ResizeObserver is leading to a bit janky UX
        function resizeChart() {
            chart?.resize();
        }
        window.addEventListener("resize", resizeChart);

        // Return cleanup function
        return () => {
            chart?.dispose();
            window.removeEventListener("resize", resizeChart);
        };
    }, [theme]);

    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            chart?.setOption(option, settings);
        }
    }, [option, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            loading === true ? chart?.showLoading() : chart?.hideLoading();
        }
    }, [loading, theme]);

    return <div ref={chartRef} style={{ width: "100%", height: "100%", ...style }} />;
}