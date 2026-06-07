// Minimal ambient declaration — d3-force-3d ships no bundled types.
// We only use a small slice of its (d3-force-compatible) API.
declare module 'd3-force-3d' {
  export function forceSimulation<N = unknown>(nodes?: N[], numDimensions?: number): any;
  export function forceManyBody(): any;
  export function forceLink<L = unknown>(links?: L[]): any;
  export function forceCenter(x?: number, y?: number, z?: number): any;
  export function forceCollide(radius?: number | ((node: any) => number)): any;
}
