import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/islands/ReflectionAnswerChart.tsx");const _jsxDEV = __vite__cjsImport3_react_jsxDevRuntime["jsxDEV"];import { Bar, BarChart, LabelList, XAxis, YAxis } from "/node_modules/.vite/deps/recharts.js?v=905cfd7a";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/src/components/ui/card.tsx";
import { ChartContainer } from "/src/components/ui/chart.tsx";
var _jsxFileName = "/Users/cosmin/Documents/SilviaMonorepo/website/src/components/islands/ReflectionAnswerChart.tsx";
import __vite__cjsImport3_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=5eb7c77c";
const distributionChartConfig = { count: {
	label: "Alegeri",
	color: "var(--chart-4)"
} };
export default function ReflectionAnswerChart({ distribution, totalQuestions }) {
	return /* @__PURE__ */ _jsxDEV("figure", {
		className: "mt-8 min-w-0",
		"data-reflection-chart": true,
		children: /* @__PURE__ */ _jsxDEV(Card, {
			className: "min-w-0",
			children: [/* @__PURE__ */ _jsxDEV(CardHeader, { children: /* @__PURE__ */ _jsxDEV("figcaption", { children: [/* @__PURE__ */ _jsxDEV(CardTitle, {
				asChild: true,
				className: "font-display text-2xl leading-tight",
				children: /* @__PURE__ */ _jsxDEV("h3", { children: "Cum s-au distribuit alegerile" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 43,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 42,
				columnNumber: 13
			}, this), /* @__PURE__ */ _jsxDEV(CardDescription, {
				className: "mt-2 max-w-2xl leading-6",
				children: "Barele arată de câte ori a fost aleasă fiecare direcție, nu intensitatea sau severitatea unei dificultăți."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 45,
				columnNumber: 13
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 41,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 40,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV(CardContent, {
				className: "flex min-w-0 flex-col gap-6",
				children: [/* @__PURE__ */ _jsxDEV(ChartContainer, {
					className: "h-64 min-w-0 w-full",
					config: distributionChartConfig,
					children: /* @__PURE__ */ _jsxDEV(BarChart, {
						accessibilityLayer: true,
						data: distribution,
						layout: "vertical",
						margin: {
							left: 0,
							right: 72
						},
						children: [
							/* @__PURE__ */ _jsxDEV(XAxis, {
								dataKey: "count",
								domain: [0, totalQuestions],
								hide: true,
								type: "number"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 63,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV(YAxis, {
								axisLine: false,
								dataKey: "shortLabel",
								tickLine: false,
								type: "category",
								width: 68
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 69,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV(Bar, {
								dataKey: "count",
								fill: "var(--color-count)",
								isAnimationActive: false,
								radius: 4,
								children: /* @__PURE__ */ _jsxDEV(LabelList, {
									className: "fill-foreground",
									dataKey: "displayCount",
									fontSize: 12,
									position: "right"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 82,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 76,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("dl", {
					className: "grid gap-4 sm:grid-cols-2",
					children: distribution.map((item) => /* @__PURE__ */ _jsxDEV("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1",
						"data-reflection-dimension": item.dimension,
						children: [
							/* @__PURE__ */ _jsxDEV("dt", {
								className: "font-medium",
								children: item.label
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 99,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ _jsxDEV("dd", {
								className: "shrink-0 text-sm [font-variant-numeric:tabular-nums]",
								"data-reflection-count": item.count,
								children: item.displayCount
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 100,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ _jsxDEV("dd", {
								className: "text-muted-foreground col-span-2 text-sm leading-6",
								children: item.description
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 106,
								columnNumber: 17
							}, this)
						]
					}, item.dimension, true, {
						fileName: _jsxFileName,
						lineNumber: 94,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 92,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 52,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 39,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 38,
		columnNumber: 5
	}, this);
}
_c = ReflectionAnswerChart;
var _c;
$RefreshReg$(_c, "ReflectionAnswerChart");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/components/islands/ReflectionAnswerChart.tsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/cosmin/Documents/SilviaMonorepo/website/src/components/islands/ReflectionAnswerChart.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/cosmin/Documents/SilviaMonorepo/website/src/components/islands/ReflectionAnswerChart.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "/Users/cosmin/Documents/SilviaMonorepo/website/src/components/islands/ReflectionAnswerChart.tsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsU0FBUyxLQUFLLFVBQVUsV0FBVyxPQUFPLGFBQWE7QUFFdkQsU0FDRSxNQUNBLGFBQ0EsaUJBQ0EsWUFDQSxpQkFDSztBQUNQLFNBQTJCLHNCQUFzQjs7O0FBZ0JqRCxNQUFNLDBCQUEwQixFQUM5QixPQUFPO0NBQ0wsT0FBTztDQUNQLE9BQU87QUFDVCxFQUNGO0FBRUEsZUFBZSxTQUFTLHNCQUFzQixFQUM1QyxjQUNBLGtCQUNRO0NBQ1IsT0FDRSx3QkFBQyxVQUFEO0VBQVEsV0FBVTtFQUFlO1lBQy9CLHdCQUFDLE1BQUQ7R0FBTSxXQUFVO2FBQWhCLENBQ0Usd0JBQUMsWUFBRCxZQUNFLHdCQUFDLGNBQUQsYUFDRSx3QkFBQyxXQUFEO0lBQVc7SUFBUSxXQUFVO2NBQzNCLHdCQUFDLE1BQUQsWUFBSSxnQ0FBaUM7Ozs7O0dBQzVCOzs7O2FBQ1gsd0JBQUMsaUJBQUQ7SUFBaUIsV0FBVTtjQUEyQjtHQUdyQzs7OztXQUNQOzs7O1lBQ0Y7Ozs7YUFFWix3QkFBQyxhQUFEO0lBQWEsV0FBVTtjQUF2QixDQUNFLHdCQUFDLGdCQUFEO0tBQ0UsV0FBVTtLQUNWLFFBQVE7ZUFFUix3QkFBQyxVQUFEO01BQ0U7TUFDQSxNQUFNO01BQ04sUUFBTztNQUNQLFFBQVE7T0FBRSxNQUFNO09BQUcsT0FBTztNQUFHO2dCQUovQjtPQU1FLHdCQUFDLE9BQUQ7UUFDRSxTQUFRO1FBQ1IsUUFBUSxDQUFDLEdBQUcsY0FBYztRQUMxQjtRQUNBLE1BQUs7T0FDTjs7Ozs7T0FDRCx3QkFBQyxPQUFEO1FBQ0UsVUFBVTtRQUNWLFNBQVE7UUFDUixVQUFVO1FBQ1YsTUFBSztRQUNMLE9BQU87T0FDUjs7Ozs7T0FDRCx3QkFBQyxLQUFEO1FBQ0UsU0FBUTtRQUNSLE1BQUs7UUFDTCxtQkFBbUI7UUFDbkIsUUFBUTtrQkFFUix3QkFBQyxXQUFEO1NBQ0UsV0FBVTtTQUNWLFNBQVE7U0FDUixVQUFVO1NBQ1YsVUFBUztRQUNWOzs7OztPQUNFOzs7OztNQUNHOzs7Ozs7SUFDSTs7OztjQUVoQix3QkFBQyxNQUFEO0tBQUksV0FBVTtlQUNYLGFBQWEsS0FBSyxTQUNqQix3QkFBQyxPQUFEO01BQ0UsV0FBVTtNQUNWLDZCQUEyQixLQUFLO2dCQUZsQztPQUtFLHdCQUFDLE1BQUQ7UUFBSSxXQUFVO2tCQUFlLEtBQUs7T0FBVTs7Ozs7T0FDNUMsd0JBQUMsTUFBRDtRQUNFLFdBQVU7UUFDVix5QkFBdUIsS0FBSztrQkFFM0IsS0FBSztPQUNKOzs7OztPQUNKLHdCQUFDLE1BQUQ7UUFBSSxXQUFVO2tCQUNYLEtBQUs7T0FDSjs7Ozs7TUFDRDtRQVpFLEtBQUs7Ozs7WUFZUCxDQUNOO0lBQ0M7Ozs7WUFDTzs7Ozs7V0FDVDs7Ozs7O0NBQ0E7Ozs7O0FBRVoiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiUmVmbGVjdGlvbkFuc3dlckNoYXJ0LnRzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXIsIEJhckNoYXJ0LCBMYWJlbExpc3QsIFhBeGlzLCBZQXhpcyB9IGZyb20gXCJyZWNoYXJ0c1wiO1xuXG5pbXBvcnQge1xuICBDYXJkLFxuICBDYXJkQ29udGVudCxcbiAgQ2FyZERlc2NyaXB0aW9uLFxuICBDYXJkSGVhZGVyLFxuICBDYXJkVGl0bGUsXG59IGZyb20gXCJAL2NvbXBvbmVudHMvdWkvY2FyZFwiO1xuaW1wb3J0IHsgdHlwZSBDaGFydENvbmZpZywgQ2hhcnRDb250YWluZXIgfSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL2NoYXJ0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5zd2VyRGlzdHJpYnV0aW9uRGF0dW0ge1xuICBjb3VudDogbnVtYmVyO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBkaW1lbnNpb246IHN0cmluZztcbiAgZGlzcGxheUNvdW50OiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHNob3J0TGFiZWw6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgZGlzdHJpYnV0aW9uOiByZWFkb25seSBBbnN3ZXJEaXN0cmlidXRpb25EYXR1bVtdO1xuICB0b3RhbFF1ZXN0aW9uczogbnVtYmVyO1xufVxuXG5jb25zdCBkaXN0cmlidXRpb25DaGFydENvbmZpZyA9IHtcbiAgY291bnQ6IHtcbiAgICBsYWJlbDogXCJBbGVnZXJpXCIsXG4gICAgY29sb3I6IFwidmFyKC0tY2hhcnQtNClcIixcbiAgfSxcbn0gc2F0aXNmaWVzIENoYXJ0Q29uZmlnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZWZsZWN0aW9uQW5zd2VyQ2hhcnQoe1xuICBkaXN0cmlidXRpb24sXG4gIHRvdGFsUXVlc3Rpb25zLFxufTogUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8ZmlndXJlIGNsYXNzTmFtZT1cIm10LTggbWluLXctMFwiIGRhdGEtcmVmbGVjdGlvbi1jaGFydD5cbiAgICAgIDxDYXJkIGNsYXNzTmFtZT1cIm1pbi13LTBcIj5cbiAgICAgICAgPENhcmRIZWFkZXI+XG4gICAgICAgICAgPGZpZ2NhcHRpb24+XG4gICAgICAgICAgICA8Q2FyZFRpdGxlIGFzQ2hpbGQgY2xhc3NOYW1lPVwiZm9udC1kaXNwbGF5IHRleHQtMnhsIGxlYWRpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAgPGgzPkN1bSBzLWF1IGRpc3RyaWJ1aXQgYWxlZ2VyaWxlPC9oMz5cbiAgICAgICAgICAgIDwvQ2FyZFRpdGxlPlxuICAgICAgICAgICAgPENhcmREZXNjcmlwdGlvbiBjbGFzc05hbWU9XCJtdC0yIG1heC13LTJ4bCBsZWFkaW5nLTZcIj5cbiAgICAgICAgICAgICAgQmFyZWxlIGFyYXTEgyBkZSBjw6J0ZSBvcmkgYSBmb3N0IGFsZWFzxIMgZmllY2FyZSBkaXJlY8ibaWUsIG51XG4gICAgICAgICAgICAgIGludGVuc2l0YXRlYSBzYXUgc2V2ZXJpdGF0ZWEgdW5laSBkaWZpY3VsdMSDyJtpLlxuICAgICAgICAgICAgPC9DYXJkRGVzY3JpcHRpb24+XG4gICAgICAgICAgPC9maWdjYXB0aW9uPlxuICAgICAgICA8L0NhcmRIZWFkZXI+XG5cbiAgICAgICAgPENhcmRDb250ZW50IGNsYXNzTmFtZT1cImZsZXggbWluLXctMCBmbGV4LWNvbCBnYXAtNlwiPlxuICAgICAgICAgIDxDaGFydENvbnRhaW5lclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC02NCBtaW4tdy0wIHctZnVsbFwiXG4gICAgICAgICAgICBjb25maWc9e2Rpc3RyaWJ1dGlvbkNoYXJ0Q29uZmlnfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxCYXJDaGFydFxuICAgICAgICAgICAgICBhY2Nlc3NpYmlsaXR5TGF5ZXJcbiAgICAgICAgICAgICAgZGF0YT17ZGlzdHJpYnV0aW9ufVxuICAgICAgICAgICAgICBsYXlvdXQ9XCJ2ZXJ0aWNhbFwiXG4gICAgICAgICAgICAgIG1hcmdpbj17eyBsZWZ0OiAwLCByaWdodDogNzIgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFhBeGlzXG4gICAgICAgICAgICAgICAgZGF0YUtleT1cImNvdW50XCJcbiAgICAgICAgICAgICAgICBkb21haW49e1swLCB0b3RhbFF1ZXN0aW9uc119XG4gICAgICAgICAgICAgICAgaGlkZVxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8WUF4aXNcbiAgICAgICAgICAgICAgICBheGlzTGluZT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgZGF0YUtleT1cInNob3J0TGFiZWxcIlxuICAgICAgICAgICAgICAgIHRpY2tMaW5lPXtmYWxzZX1cbiAgICAgICAgICAgICAgICB0eXBlPVwiY2F0ZWdvcnlcIlxuICAgICAgICAgICAgICAgIHdpZHRoPXs2OH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPEJhclxuICAgICAgICAgICAgICAgIGRhdGFLZXk9XCJjb3VudFwiXG4gICAgICAgICAgICAgICAgZmlsbD1cInZhcigtLWNvbG9yLWNvdW50KVwiXG4gICAgICAgICAgICAgICAgaXNBbmltYXRpb25BY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgICAgICAgIHJhZGl1cz17NH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxMYWJlbExpc3RcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZpbGwtZm9yZWdyb3VuZFwiXG4gICAgICAgICAgICAgICAgICBkYXRhS2V5PVwiZGlzcGxheUNvdW50XCJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplPXsxMn1cbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uPVwicmlnaHRcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvQmFyPlxuICAgICAgICAgICAgPC9CYXJDaGFydD5cbiAgICAgICAgICA8L0NoYXJ0Q29udGFpbmVyPlxuXG4gICAgICAgICAgPGRsIGNsYXNzTmFtZT1cImdyaWQgZ2FwLTQgc206Z3JpZC1jb2xzLTJcIj5cbiAgICAgICAgICAgIHtkaXN0cmlidXRpb24ubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy1bbWlubWF4KDAsMWZyKV9hdXRvXSBnYXAteC00IGdhcC15LTFcIlxuICAgICAgICAgICAgICAgIGRhdGEtcmVmbGVjdGlvbi1kaW1lbnNpb249e2l0ZW0uZGltZW5zaW9ufVxuICAgICAgICAgICAgICAgIGtleT17aXRlbS5kaW1lbnNpb259XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZHQgY2xhc3NOYW1lPVwiZm9udC1tZWRpdW1cIj57aXRlbS5sYWJlbH08L2R0PlxuICAgICAgICAgICAgICAgIDxkZFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2hyaW5rLTAgdGV4dC1zbSBbZm9udC12YXJpYW50LW51bWVyaWM6dGFidWxhci1udW1zXVwiXG4gICAgICAgICAgICAgICAgICBkYXRhLXJlZmxlY3Rpb24tY291bnQ9e2l0ZW0uY291bnR9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2l0ZW0uZGlzcGxheUNvdW50fVxuICAgICAgICAgICAgICAgIDwvZGQ+XG4gICAgICAgICAgICAgICAgPGRkIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQtZm9yZWdyb3VuZCBjb2wtc3Bhbi0yIHRleHQtc20gbGVhZGluZy02XCI+XG4gICAgICAgICAgICAgICAgICB7aXRlbS5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICA8L2RkPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGw+XG4gICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICA8L0NhcmQ+XG4gICAgPC9maWd1cmU+XG4gICk7XG59XG4iXX0=