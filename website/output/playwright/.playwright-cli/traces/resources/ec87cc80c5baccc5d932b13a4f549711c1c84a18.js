import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/ui/chart.tsx");const React = ((m, n) => n || !m?.__esModule ? {	...typeof m === "object" && !Array.isArray(m) || typeof m === "function" ? m : {},	default: m} : m)(__vite__cjsImport0_react, 1);const _jsxDEV = __vite__cjsImport3_react_jsxDevRuntime["jsxDEV"]; const _Fragment = __vite__cjsImport3_react_jsxDevRuntime["Fragment"];"use client";
import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=5eb7c77c";
import * as RechartsPrimitive from "/node_modules/.vite/deps/recharts.js?v=905cfd7a";
import { cn } from "/src/lib/utils.ts";
var _jsxFileName = "/Users/cosmin/Documents/SilviaMonorepo/website/src/components/ui/chart.tsx";
import __vite__cjsImport3_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=5eb7c77c";
var _s = $RefreshSig$(), _s2 = $RefreshSig$(), _s3 = $RefreshSig$(), _s4 = $RefreshSig$();
// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = {
	light: "",
	dark: ".dark"
};
const INITIAL_DIMENSION = {
	width: 320,
	height: 200
};
const ChartContext = React.createContext(null);
_c = ChartContext;
function useChart() {
	_s();
	const context = React.useContext(ChartContext);
	if (!context) {
		throw new Error("useChart must be used within a <ChartContainer />");
	}
	return context;
}
_s(useChart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function ChartContainer({ id, className, children, config, initialDimension = INITIAL_DIMENSION, ...props }) {
	_s2();
	const uniqueId = React.useId();
	const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
	return /* @__PURE__ */ _jsxDEV(ChartContext.Provider, {
		value: { config },
		children: /* @__PURE__ */ _jsxDEV("div", {
			"data-slot": "chart",
			"data-chart": chartId,
			className: cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden", className),
			...props,
			children: [/* @__PURE__ */ _jsxDEV(ChartStyle, {
				id: chartId,
				config
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 73,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV(RechartsPrimitive.ResponsiveContainer, {
				initialDimension,
				children
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 74,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 64,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 63,
		columnNumber: 5
	}, this);
}
_s2(ChartContainer, "j7NPILheLIfrWAvm8S/GM4Sml/8=");
_c2 = ChartContainer;
const ChartStyle = ({ id, config }) => {
	const colorConfig = Object.entries(config).filter(([, config]) => config.theme ?? config.color);
	if (!colorConfig.length) {
		return null;
	}
	return /* @__PURE__ */ _jsxDEV("style", { dangerouslySetInnerHTML: { __html: Object.entries(THEMES).map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
		const color = itemConfig.theme?.[theme] ?? itemConfig.color;
		return color ? `  --color-${key}: ${color};` : null;
	}).join("\n")}
}
`).join("\n") } }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 94,
		columnNumber: 5
	}, this);
};
_c3 = ChartStyle;
const ChartTooltip = RechartsPrimitive.Tooltip;
function ChartTooltipContent({ active, payload, className, indicator = "dot", hideLabel = false, hideIndicator = false, label, labelFormatter, labelClassName, formatter, color, nameKey, labelKey }) {
	_s3();
	const { config } = useChart();
	const tooltipLabel = React.useMemo(() => {
		if (hideLabel || !payload?.length) {
			return null;
		}
		const [item] = payload;
		const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
		const itemConfig = getPayloadConfigFromPayload(config, item, key);
		const value = !labelKey && typeof label === "string" ? config[label]?.label ?? label : itemConfig?.label;
		if (labelFormatter) {
			return /* @__PURE__ */ _jsxDEV("div", {
				className: cn("font-medium", labelClassName),
				children: labelFormatter(value, payload)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 164,
				columnNumber: 9
			}, this);
		}
		if (!value) {
			return null;
		}
		return /* @__PURE__ */ _jsxDEV("div", {
			className: cn("font-medium", labelClassName),
			children: value
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 174,
			columnNumber: 12
		}, this);
	}, [
		label,
		labelFormatter,
		payload,
		hideLabel,
		labelClassName,
		config,
		labelKey
	]);
	if (!active || !payload?.length) {
		return null;
	}
	const nestLabel = payload.length === 1 && indicator !== "dot";
	return /* @__PURE__ */ _jsxDEV("div", {
		className: cn("grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", className),
		children: [!nestLabel ? tooltipLabel : null, /* @__PURE__ */ _jsxDEV("div", {
			className: "grid gap-1.5",
			children: payload.filter((item) => item.type !== "none").map((item, index) => {
				const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
				const itemConfig = getPayloadConfigFromPayload(config, item, key);
				const indicatorColor = color ?? item.payload?.fill ?? item.color;
				return /* @__PURE__ */ _jsxDEV("div", {
					className: cn("flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground", indicator === "dot" && "items-center"),
					children: formatter && item?.value !== undefined && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ _jsxDEV(_Fragment, { children: [itemConfig?.icon ? /* @__PURE__ */ _jsxDEV(itemConfig.icon, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 220,
						columnNumber: 23
					}, this) : !hideIndicator && /* @__PURE__ */ _jsxDEV("div", {
						className: cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
							"h-2.5 w-2.5": indicator === "dot",
							"w-1": indicator === "line",
							"w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
							"my-0.5": nestLabel && indicator === "dashed"
						}),
						style: {
							"--color-bg": indicatorColor,
							"--color-border": indicatorColor
						}
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 223,
						columnNumber: 25
					}, this), /* @__PURE__ */ _jsxDEV("div", {
						className: cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center"),
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "grid gap-1.5",
							children: [nestLabel ? tooltipLabel : null, /* @__PURE__ */ _jsxDEV("span", {
								className: "text-muted-foreground",
								children: itemConfig?.label ?? item.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 251,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 249,
							columnNumber: 23
						}, this), item.value != null && /* @__PURE__ */ _jsxDEV("span", {
							className: "font-mono font-medium text-foreground tabular-nums",
							children: typeof item.value === "number" ? item.value.toLocaleString() : String(item.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 256,
							columnNumber: 25
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 243,
						columnNumber: 21
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 218,
						columnNumber: 19
					}, this)
				}, index, false, {
					fileName: _jsxFileName,
					lineNumber: 208,
					columnNumber: 15
				}, this);
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 199,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 192,
		columnNumber: 5
	}, this);
}
_s3(ChartTooltipContent, "VRZ01Ef9UbmX77lDHhgG7WNmicY=", false, function() {
	return [useChart];
});
_c4 = ChartTooltipContent;
const ChartLegend = RechartsPrimitive.Legend;
function ChartLegendContent({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }) {
	_s4();
	const { config } = useChart();
	if (!payload?.length) {
		return null;
	}
	return /* @__PURE__ */ _jsxDEV("div", {
		className: cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className),
		children: payload.filter((item) => item.type !== "none").map((item, index) => {
			const key = `${nameKey ?? item.dataKey ?? "value"}`;
			const itemConfig = getPayloadConfigFromPayload(config, item, key);
			return /* @__PURE__ */ _jsxDEV("div", {
				className: cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"),
				children: [itemConfig?.icon && !hideIcon ? /* @__PURE__ */ _jsxDEV(itemConfig.icon, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 313,
					columnNumber: 17
				}, this) : /* @__PURE__ */ _jsxDEV("div", {
					className: "h-2 w-2 shrink-0 rounded-[2px]",
					style: { backgroundColor: item.color }
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 315,
					columnNumber: 17
				}, this), itemConfig?.label]
			}, index, true, {
				fileName: _jsxFileName,
				lineNumber: 306,
				columnNumber: 13
			}, this);
		})
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 292,
		columnNumber: 5
	}, this);
}
_s4(ChartLegendContent, "qnidj+dVqj1Euuv2nRBc6D+LeAA=", false, function() {
	return [useChart];
});
_c5 = ChartLegendContent;
function getPayloadConfigFromPayload(config, payload, key) {
	if (typeof payload !== "object" || payload === null) {
		return undefined;
	}
	const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : undefined;
	let configLabelKey = key;
	if (key in payload && typeof payload[key] === "string") {
		configLabelKey = payload[key];
	} else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
		configLabelKey = payloadPayload[key];
	}
	return configLabelKey in config ? config[configLabelKey] : config[key];
}
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
var _c, _c2, _c3, _c4, _c5;
$RefreshReg$(_c, "ChartContext");
$RefreshReg$(_c2, "ChartContainer");
$RefreshReg$(_c3, "ChartStyle");
$RefreshReg$(_c4, "ChartTooltipContent");
$RefreshReg$(_c5, "ChartLegendContent");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/ui/chart.tsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/cosmin/Documents/SilviaMonorepo/website/src/components/ui/chart.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/cosmin/Documents/SilviaMonorepo/website/src/components/ui/chart.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "/Users/cosmin/Documents/SilviaMonorepo/website/src/components/ui/chart.tsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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QVksWUFDM0IsUUFBUSxZQUFZLE9BQ2hCLFFBQVEsVUFDUjtDQUVOLElBQUksaUJBQXlCO0NBRTdCLElBQ0UsT0FBTyxXQUNQLE9BQU8sUUFBUSxTQUFpQyxVQUNoRDtFQUNBLGlCQUFpQixRQUFRO0NBQzNCLE9BQU8sSUFDTCxrQkFDQSxPQUFPLGtCQUNQLE9BQU8sZUFBZSxTQUF3QyxVQUM5RDtFQUNBLGlCQUFpQixlQUNmO0NBRUo7Q0FFQSxPQUFPLGtCQUFrQixTQUFTLE9BQU8sa0JBQWtCLE9BQU87QUFDcEU7QUFFQSxTQUNFLGdCQUNBLGNBQ0EscUJBQ0EsYUFDQSxvQkFDQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJjaGFydC50c3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCI7XG5cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0ICogYXMgUmVjaGFydHNQcmltaXRpdmUgZnJvbSBcInJlY2hhcnRzXCI7XG5pbXBvcnQgdHlwZSB7IFRvb2x0aXBWYWx1ZVR5cGUgfSBmcm9tIFwicmVjaGFydHNcIjtcblxuaW1wb3J0IHsgY24gfSBmcm9tIFwiQC9saWIvdXRpbHNcIjtcblxuLy8gRm9ybWF0OiB7IFRIRU1FX05BTUU6IENTU19TRUxFQ1RPUiB9XG5jb25zdCBUSEVNRVMgPSB7IGxpZ2h0OiBcIlwiLCBkYXJrOiBcIi5kYXJrXCIgfSBhcyBjb25zdDtcblxuY29uc3QgSU5JVElBTF9ESU1FTlNJT04gPSB7IHdpZHRoOiAzMjAsIGhlaWdodDogMjAwIH0gYXMgY29uc3Q7XG50eXBlIFRvb2x0aXBOYW1lVHlwZSA9IG51bWJlciB8IHN0cmluZztcblxuZXhwb3J0IHR5cGUgQ2hhcnRDb25maWcgPSBSZWNvcmQ8XG4gIHN0cmluZyxcbiAge1xuICAgIGxhYmVsPzogUmVhY3QuUmVhY3ROb2RlO1xuICAgIGljb24/OiBSZWFjdC5Db21wb25lbnRUeXBlO1xuICB9ICYgKFxuICAgIHwgeyBjb2xvcj86IHN0cmluZzsgdGhlbWU/OiBuZXZlciB9XG4gICAgfCB7IGNvbG9yPzogbmV2ZXI7IHRoZW1lOiBSZWNvcmQ8a2V5b2YgdHlwZW9mIFRIRU1FUywgc3RyaW5nPiB9XG4gIClcbj47XG5cbnR5cGUgQ2hhcnRDb250ZXh0UHJvcHMgPSB7XG4gIGNvbmZpZzogQ2hhcnRDb25maWc7XG59O1xuXG5jb25zdCBDaGFydENvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0PENoYXJ0Q29udGV4dFByb3BzIHwgbnVsbD4obnVsbCk7XG5cbmZ1bmN0aW9uIHVzZUNoYXJ0KCkge1xuICBjb25zdCBjb250ZXh0ID0gUmVhY3QudXNlQ29udGV4dChDaGFydENvbnRleHQpO1xuXG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInVzZUNoYXJ0IG11c3QgYmUgdXNlZCB3aXRoaW4gYSA8Q2hhcnRDb250YWluZXIgLz5cIik7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZnVuY3Rpb24gQ2hhcnRDb250YWluZXIoe1xuICBpZCxcbiAgY2xhc3NOYW1lLFxuICBjaGlsZHJlbixcbiAgY29uZmlnLFxuICBpbml0aWFsRGltZW5zaW9uID0gSU5JVElBTF9ESU1FTlNJT04sXG4gIC4uLnByb3BzXG59OiBSZWFjdC5Db21wb25lbnRQcm9wczxcImRpdlwiPiAmIHtcbiAgY29uZmlnOiBDaGFydENvbmZpZztcbiAgY2hpbGRyZW46IFJlYWN0LkNvbXBvbmVudFByb3BzPFxuICAgIHR5cGVvZiBSZWNoYXJ0c1ByaW1pdGl2ZS5SZXNwb25zaXZlQ29udGFpbmVyXG4gID5bXCJjaGlsZHJlblwiXTtcbiAgaW5pdGlhbERpbWVuc2lvbj86IHtcbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIGhlaWdodDogbnVtYmVyO1xuICB9O1xufSkge1xuICBjb25zdCB1bmlxdWVJZCA9IFJlYWN0LnVzZUlkKCk7XG4gIGNvbnN0IGNoYXJ0SWQgPSBgY2hhcnQtJHtpZCA/PyB1bmlxdWVJZC5yZXBsYWNlKC86L2csIFwiXCIpfWA7XG5cbiAgcmV0dXJuIChcbiAgICA8Q2hhcnRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IGNvbmZpZyB9fT5cbiAgICAgIDxkaXZcbiAgICAgICAgZGF0YS1zbG90PVwiY2hhcnRcIlxuICAgICAgICBkYXRhLWNoYXJ0PXtjaGFydElkfVxuICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgIFwiZmxleCBhc3BlY3QtdmlkZW8ganVzdGlmeS1jZW50ZXIgdGV4dC14cyBbJl8ucmVjaGFydHMtY2FydGVzaWFuLWF4aXMtdGlja190ZXh0XTpmaWxsLW11dGVkLWZvcmVncm91bmQgWyZfLnJlY2hhcnRzLWNhcnRlc2lhbi1ncmlkX2xpbmVbc3Ryb2tlPScjY2NjJ11dOnN0cm9rZS1ib3JkZXIvNTAgWyZfLnJlY2hhcnRzLWN1cnZlLnJlY2hhcnRzLXRvb2x0aXAtY3Vyc29yXTpzdHJva2UtYm9yZGVyIFsmXy5yZWNoYXJ0cy1kb3Rbc3Ryb2tlPScjZmZmJ11dOnN0cm9rZS10cmFuc3BhcmVudCBbJl8ucmVjaGFydHMtbGF5ZXJdOm91dGxpbmUtaGlkZGVuIFsmXy5yZWNoYXJ0cy1wb2xhci1ncmlkX1tzdHJva2U9JyNjY2MnXV06c3Ryb2tlLWJvcmRlciBbJl8ucmVjaGFydHMtcmFkaWFsLWJhci1iYWNrZ3JvdW5kLXNlY3Rvcl06ZmlsbC1tdXRlZCBbJl8ucmVjaGFydHMtcmVjdGFuZ2xlLnJlY2hhcnRzLXRvb2x0aXAtY3Vyc29yXTpmaWxsLW11dGVkIFsmXy5yZWNoYXJ0cy1yZWZlcmVuY2UtbGluZV9bc3Ryb2tlPScjY2NjJ11dOnN0cm9rZS1ib3JkZXIgWyZfLnJlY2hhcnRzLXNlY3Rvcl06b3V0bGluZS1oaWRkZW4gWyZfLnJlY2hhcnRzLXNlY3RvcltzdHJva2U9JyNmZmYnXV06c3Ryb2tlLXRyYW5zcGFyZW50IFsmXy5yZWNoYXJ0cy1zdXJmYWNlXTpvdXRsaW5lLWhpZGRlblwiLFxuICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgKX1cbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgPlxuICAgICAgICA8Q2hhcnRTdHlsZSBpZD17Y2hhcnRJZH0gY29uZmlnPXtjb25maWd9IC8+XG4gICAgICAgIDxSZWNoYXJ0c1ByaW1pdGl2ZS5SZXNwb25zaXZlQ29udGFpbmVyXG4gICAgICAgICAgaW5pdGlhbERpbWVuc2lvbj17aW5pdGlhbERpbWVuc2lvbn1cbiAgICAgICAgPlxuICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgPC9SZWNoYXJ0c1ByaW1pdGl2ZS5SZXNwb25zaXZlQ29udGFpbmVyPlxuICAgICAgPC9kaXY+XG4gICAgPC9DaGFydENvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59XG5cbmNvbnN0IENoYXJ0U3R5bGUgPSAoeyBpZCwgY29uZmlnIH06IHsgaWQ6IHN0cmluZzsgY29uZmlnOiBDaGFydENvbmZpZyB9KSA9PiB7XG4gIGNvbnN0IGNvbG9yQ29uZmlnID0gT2JqZWN0LmVudHJpZXMoY29uZmlnKS5maWx0ZXIoXG4gICAgKFssIGNvbmZpZ10pID0+IGNvbmZpZy50aGVtZSA/PyBjb25maWcuY29sb3IsXG4gICk7XG5cbiAgaWYgKCFjb2xvckNvbmZpZy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPHN0eWxlXG4gICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e1xuICAgICAgICBfX2h0bWw6IE9iamVjdC5lbnRyaWVzKFRIRU1FUylcbiAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgKFt0aGVtZSwgcHJlZml4XSkgPT4gYFxuJHtwcmVmaXh9IFtkYXRhLWNoYXJ0PSR7aWR9XSB7XG4ke2NvbG9yQ29uZmlnXG4gIC5tYXAoKFtrZXksIGl0ZW1Db25maWddKSA9PiB7XG4gICAgY29uc3QgY29sb3IgPVxuICAgICAgaXRlbUNvbmZpZy50aGVtZT8uW3RoZW1lIGFzIGtleW9mIHR5cGVvZiBpdGVtQ29uZmlnLnRoZW1lXSA/P1xuICAgICAgaXRlbUNvbmZpZy5jb2xvcjtcbiAgICByZXR1cm4gY29sb3IgPyBgICAtLWNvbG9yLSR7a2V5fTogJHtjb2xvcn07YCA6IG51bGw7XG4gIH0pXG4gIC5qb2luKFwiXFxuXCIpfVxufVxuYCxcbiAgICAgICAgICApXG4gICAgICAgICAgLmpvaW4oXCJcXG5cIiksXG4gICAgICB9fVxuICAgIC8+XG4gICk7XG59O1xuXG5jb25zdCBDaGFydFRvb2x0aXAgPSBSZWNoYXJ0c1ByaW1pdGl2ZS5Ub29sdGlwO1xuXG5mdW5jdGlvbiBDaGFydFRvb2x0aXBDb250ZW50KHtcbiAgYWN0aXZlLFxuICBwYXlsb2FkLFxuICBjbGFzc05hbWUsXG4gIGluZGljYXRvciA9IFwiZG90XCIsXG4gIGhpZGVMYWJlbCA9IGZhbHNlLFxuICBoaWRlSW5kaWNhdG9yID0gZmFsc2UsXG4gIGxhYmVsLFxuICBsYWJlbEZvcm1hdHRlcixcbiAgbGFiZWxDbGFzc05hbWUsXG4gIGZvcm1hdHRlcixcbiAgY29sb3IsXG4gIG5hbWVLZXksXG4gIGxhYmVsS2V5LFxufTogUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIFJlY2hhcnRzUHJpbWl0aXZlLlRvb2x0aXA+ICZcbiAgUmVhY3QuQ29tcG9uZW50UHJvcHM8XCJkaXZcIj4gJiB7XG4gICAgaGlkZUxhYmVsPzogYm9vbGVhbjtcbiAgICBoaWRlSW5kaWNhdG9yPzogYm9vbGVhbjtcbiAgICBpbmRpY2F0b3I/OiBcImxpbmVcIiB8IFwiZG90XCIgfCBcImRhc2hlZFwiO1xuICAgIG5hbWVLZXk/OiBzdHJpbmc7XG4gICAgbGFiZWxLZXk/OiBzdHJpbmc7XG4gIH0gJiBPbWl0PFxuICAgIFJlY2hhcnRzUHJpbWl0aXZlLkRlZmF1bHRUb29sdGlwQ29udGVudFByb3BzPFxuICAgICAgVG9vbHRpcFZhbHVlVHlwZSxcbiAgICAgIFRvb2x0aXBOYW1lVHlwZVxuICAgID4sXG4gICAgXCJhY2Nlc3NpYmlsaXR5TGF5ZXJcIlxuICA+KSB7XG4gIGNvbnN0IHsgY29uZmlnIH0gPSB1c2VDaGFydCgpO1xuXG4gIGNvbnN0IHRvb2x0aXBMYWJlbCA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChoaWRlTGFiZWwgfHwgIXBheWxvYWQ/Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgW2l0ZW1dID0gcGF5bG9hZDtcbiAgICBjb25zdCBrZXkgPSBgJHtsYWJlbEtleSA/PyBpdGVtPy5kYXRhS2V5ID8/IGl0ZW0/Lm5hbWUgPz8gXCJ2YWx1ZVwifWA7XG4gICAgY29uc3QgaXRlbUNvbmZpZyA9IGdldFBheWxvYWRDb25maWdGcm9tUGF5bG9hZChjb25maWcsIGl0ZW0sIGtleSk7XG4gICAgY29uc3QgdmFsdWUgPVxuICAgICAgIWxhYmVsS2V5ICYmIHR5cGVvZiBsYWJlbCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICA/IChjb25maWdbbGFiZWxdPy5sYWJlbCA/PyBsYWJlbClcbiAgICAgICAgOiBpdGVtQ29uZmlnPy5sYWJlbDtcblxuICAgIGlmIChsYWJlbEZvcm1hdHRlcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKFwiZm9udC1tZWRpdW1cIiwgbGFiZWxDbGFzc05hbWUpfT5cbiAgICAgICAgICB7bGFiZWxGb3JtYXR0ZXIodmFsdWUsIHBheWxvYWQpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtjbihcImZvbnQtbWVkaXVtXCIsIGxhYmVsQ2xhc3NOYW1lKX0+e3ZhbHVlfTwvZGl2PjtcbiAgfSwgW1xuICAgIGxhYmVsLFxuICAgIGxhYmVsRm9ybWF0dGVyLFxuICAgIHBheWxvYWQsXG4gICAgaGlkZUxhYmVsLFxuICAgIGxhYmVsQ2xhc3NOYW1lLFxuICAgIGNvbmZpZyxcbiAgICBsYWJlbEtleSxcbiAgXSk7XG5cbiAgaWYgKCFhY3RpdmUgfHwgIXBheWxvYWQ/Lmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgbmVzdExhYmVsID0gcGF5bG9hZC5sZW5ndGggPT09IDEgJiYgaW5kaWNhdG9yICE9PSBcImRvdFwiO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgXCJncmlkIG1pbi13LTMyIGl0ZW1zLXN0YXJ0IGdhcC0xLjUgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWJvcmRlci81MCBiZy1iYWNrZ3JvdW5kIHB4LTIuNSBweS0xLjUgdGV4dC14cyBzaGFkb3cteGxcIixcbiAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgKX1cbiAgICA+XG4gICAgICB7IW5lc3RMYWJlbCA/IHRvb2x0aXBMYWJlbCA6IG51bGx9XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ2FwLTEuNVwiPlxuICAgICAgICB7cGF5bG9hZFxuICAgICAgICAgIC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0udHlwZSAhPT0gXCJub25lXCIpXG4gICAgICAgICAgLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke25hbWVLZXkgPz8gaXRlbS5uYW1lID8/IGl0ZW0uZGF0YUtleSA/PyBcInZhbHVlXCJ9YDtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1Db25maWcgPSBnZXRQYXlsb2FkQ29uZmlnRnJvbVBheWxvYWQoY29uZmlnLCBpdGVtLCBrZXkpO1xuICAgICAgICAgICAgY29uc3QgaW5kaWNhdG9yQ29sb3IgPSBjb2xvciA/PyBpdGVtLnBheWxvYWQ/LmZpbGwgPz8gaXRlbS5jb2xvcjtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAgICAgICAgIFwiZmxleCB3LWZ1bGwgZmxleC13cmFwIGl0ZW1zLXN0cmV0Y2ggZ2FwLTIgWyY+c3ZnXTpoLTIuNSBbJj5zdmddOnctMi41IFsmPnN2Z106dGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCIsXG4gICAgICAgICAgICAgICAgICBpbmRpY2F0b3IgPT09IFwiZG90XCIgJiYgXCJpdGVtcy1jZW50ZXJcIixcbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2Zvcm1hdHRlciAmJiBpdGVtPy52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGl0ZW0ubmFtZSA/IChcbiAgICAgICAgICAgICAgICAgIGZvcm1hdHRlcihpdGVtLnZhbHVlLCBpdGVtLm5hbWUsIGl0ZW0sIGluZGV4LCBpdGVtLnBheWxvYWQpXG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgIHtpdGVtQ29uZmlnPy5pY29uID8gKFxuICAgICAgICAgICAgICAgICAgICAgIDxpdGVtQ29uZmlnLmljb24gLz5cbiAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAhaGlkZUluZGljYXRvciAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaHJpbmstMCByb3VuZGVkLVsycHhdIGJvcmRlci0oLS1jb2xvci1ib3JkZXIpIGJnLSgtLWNvbG9yLWJnKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaC0yLjUgdy0yLjVcIjogaW5kaWNhdG9yID09PSBcImRvdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3LTFcIjogaW5kaWNhdG9yID09PSBcImxpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidy0wIGJvcmRlci1bMS41cHhdIGJvcmRlci1kYXNoZWQgYmctdHJhbnNwYXJlbnRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNhdG9yID09PSBcImRhc2hlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJteS0wLjVcIjogbmVzdExhYmVsICYmIGluZGljYXRvciA9PT0gXCJkYXNoZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCItLWNvbG9yLWJnXCI6IGluZGljYXRvckNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCItLWNvbG9yLWJvcmRlclwiOiBpbmRpY2F0b3JDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFJlYWN0LkNTU1Byb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmbGV4IGZsZXgtMSBqdXN0aWZ5LWJldHdlZW4gbGVhZGluZy1ub25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXN0TGFiZWwgPyBcIml0ZW1zLWVuZFwiIDogXCJpdGVtcy1jZW50ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtuZXN0TGFiZWwgPyB0b29sdGlwTGFiZWwgOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtQ29uZmlnPy5sYWJlbCA/PyBpdGVtLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAge2l0ZW0udmFsdWUgIT0gbnVsbCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gZm9udC1tZWRpdW0gdGV4dC1mb3JlZ3JvdW5kIHRhYnVsYXItbnVtc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIGl0ZW0udmFsdWUgPT09IFwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGl0ZW0udmFsdWUudG9Mb2NhbGVTdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogU3RyaW5nKGl0ZW0udmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmNvbnN0IENoYXJ0TGVnZW5kID0gUmVjaGFydHNQcmltaXRpdmUuTGVnZW5kO1xuXG5mdW5jdGlvbiBDaGFydExlZ2VuZENvbnRlbnQoe1xuICBjbGFzc05hbWUsXG4gIGhpZGVJY29uID0gZmFsc2UsXG4gIHBheWxvYWQsXG4gIHZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiLFxuICBuYW1lS2V5LFxufTogUmVhY3QuQ29tcG9uZW50UHJvcHM8XCJkaXZcIj4gJiB7XG4gIGhpZGVJY29uPzogYm9vbGVhbjtcbiAgbmFtZUtleT86IHN0cmluZztcbn0gJiBSZWNoYXJ0c1ByaW1pdGl2ZS5EZWZhdWx0TGVnZW5kQ29udGVudFByb3BzKSB7XG4gIGNvbnN0IHsgY29uZmlnIH0gPSB1c2VDaGFydCgpO1xuXG4gIGlmICghcGF5bG9hZD8ubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgIFwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTRcIixcbiAgICAgICAgdmVydGljYWxBbGlnbiA9PT0gXCJ0b3BcIiA/IFwicGItM1wiIDogXCJwdC0zXCIsXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICl9XG4gICAgPlxuICAgICAge3BheWxvYWRcbiAgICAgICAgLmZpbHRlcigoaXRlbSkgPT4gaXRlbS50eXBlICE9PSBcIm5vbmVcIilcbiAgICAgICAgLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBrZXkgPSBgJHtuYW1lS2V5ID8/IGl0ZW0uZGF0YUtleSA/PyBcInZhbHVlXCJ9YDtcbiAgICAgICAgICBjb25zdCBpdGVtQ29uZmlnID0gZ2V0UGF5bG9hZENvbmZpZ0Zyb21QYXlsb2FkKGNvbmZpZywgaXRlbSwga2V5KTtcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICAgICAgXCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IFsmPnN2Z106aC0zIFsmPnN2Z106dy0zIFsmPnN2Z106dGV4dC1tdXRlZC1mb3JlZ3JvdW5kXCIsXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpdGVtQ29uZmlnPy5pY29uICYmICFoaWRlSWNvbiA/IChcbiAgICAgICAgICAgICAgICA8aXRlbUNvbmZpZy5pY29uIC8+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC0yIHctMiBzaHJpbmstMCByb3VuZGVkLVsycHhdXCJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXRlbS5jb2xvcixcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAge2l0ZW1Db25maWc/LmxhYmVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldFBheWxvYWRDb25maWdGcm9tUGF5bG9hZChcbiAgY29uZmlnOiBDaGFydENvbmZpZyxcbiAgcGF5bG9hZDogdW5rbm93bixcbiAga2V5OiBzdHJpbmcsXG4pIHtcbiAgaWYgKHR5cGVvZiBwYXlsb2FkICE9PSBcIm9iamVjdFwiIHx8IHBheWxvYWQgPT09IG51bGwpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgcGF5bG9hZFBheWxvYWQgPVxuICAgIFwicGF5bG9hZFwiIGluIHBheWxvYWQgJiZcbiAgICB0eXBlb2YgcGF5bG9hZC5wYXlsb2FkID09PSBcIm9iamVjdFwiICYmXG4gICAgcGF5bG9hZC5wYXlsb2FkICE9PSBudWxsXG4gICAgICA/IHBheWxvYWQucGF5bG9hZFxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgbGV0IGNvbmZpZ0xhYmVsS2V5OiBzdHJpbmcgPSBrZXk7XG5cbiAgaWYgKFxuICAgIGtleSBpbiBwYXlsb2FkICYmXG4gICAgdHlwZW9mIHBheWxvYWRba2V5IGFzIGtleW9mIHR5cGVvZiBwYXlsb2FkXSA9PT0gXCJzdHJpbmdcIlxuICApIHtcbiAgICBjb25maWdMYWJlbEtleSA9IHBheWxvYWRba2V5IGFzIGtleW9mIHR5cGVvZiBwYXlsb2FkXSBhcyBzdHJpbmc7XG4gIH0gZWxzZSBpZiAoXG4gICAgcGF5bG9hZFBheWxvYWQgJiZcbiAgICBrZXkgaW4gcGF5bG9hZFBheWxvYWQgJiZcbiAgICB0eXBlb2YgcGF5bG9hZFBheWxvYWRba2V5IGFzIGtleW9mIHR5cGVvZiBwYXlsb2FkUGF5bG9hZF0gPT09IFwic3RyaW5nXCJcbiAgKSB7XG4gICAgY29uZmlnTGFiZWxLZXkgPSBwYXlsb2FkUGF5bG9hZFtcbiAgICAgIGtleSBhcyBrZXlvZiB0eXBlb2YgcGF5bG9hZFBheWxvYWRcbiAgICBdIGFzIHN0cmluZztcbiAgfVxuXG4gIHJldHVybiBjb25maWdMYWJlbEtleSBpbiBjb25maWcgPyBjb25maWdbY29uZmlnTGFiZWxLZXldIDogY29uZmlnW2tleV07XG59XG5cbmV4cG9ydCB7XG4gIENoYXJ0Q29udGFpbmVyLFxuICBDaGFydFRvb2x0aXAsXG4gIENoYXJ0VG9vbHRpcENvbnRlbnQsXG4gIENoYXJ0TGVnZW5kLFxuICBDaGFydExlZ2VuZENvbnRlbnQsXG4gIENoYXJ0U3R5bGUsXG59O1xuIl19