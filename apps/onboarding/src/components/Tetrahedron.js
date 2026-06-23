import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from './Tetrahedron.module.css';
function useLabels(labels) {
    return labels ?? ['YOU', 'BELIEF', 'ACTION', 'STRUCTURE'];
}
function useColors(colors) {
    return colors ?? ['#4f8fff', '#34d399', '#fbbf24', '#c084fc'];
}
export function Tetrahedron({ labels: labelsIn, colors: colorsIn, rotating = true, }) {
    const labels = useLabels(labelsIn);
    const colors = useColors(colorsIn);
    const [rotX, setRotX] = useState(-14);
    const [rotY, setRotY] = useState(0);
    useEffect(() => {
        if (!rotating)
            return;
        const id = setInterval(() => {
            setRotX((prev) => prev + 0.25);
            setRotY((prev) => prev + 0.4);
        }, 60);
        return () => clearInterval(id);
    }, [rotating]);
    const vertices = [
        { x: 0, y: 1.15, z: 0, label: labels[0], color: colors[0] },
        { x: 1.1, y: -0.35, z: 0.75, label: labels[1], color: colors[1] },
        { x: -1.1, y: -0.35, z: 0.75, label: labels[2], color: colors[2] },
        { x: 0, y: -0.35, z: -1.1, label: labels[3], color: colors[3] },
    ];
    const edges = [
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 2],
        [1, 3],
        [2, 3],
    ];
    function project(p) {
        const radX = (rotX * Math.PI) / 180;
        const radY = (rotY * Math.PI) / 180;
        const cosX = Math.cos(radX);
        const sinX = Math.sin(radX);
        const cosY = Math.cos(radY);
        const sinY = Math.sin(radY);
        const x1 = p.x;
        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.y * sinX + p.z * cosX;
        const x2 = x1 * cosY + z1 * sinY;
        const z2 = -x1 * sinY + z1 * cosY;
        const scale = 1.8 / (2.5 + z2);
        return { x: x2 * scale, y: y1 * scale };
    }
    const projected = vertices.map(project);
    return (_jsx("div", { className: styles.tetrahedron, style: { transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` }, "aria-hidden": "true", children: _jsxs("svg", { viewBox: "-1.6 -1.3 3.2 2.6", className: styles.svgCanvas, children: [_jsx("defs", { children: _jsx("filter", { id: "tetraBlur", x: "-50%", y: "-50%", width: "200%", height: "200%", children: _jsx("feGaussianBlur", { stdDeviation: "0.02", result: "blur" }) }) }), _jsxs("g", { filter: "url(#tetraBlur)", children: [edges.map(([a, b], idx) => {
                            const pa = projected[a];
                            const pb = projected[b];
                            if (!pa || !pb)
                                return null;
                            return (_jsx("line", { x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y, className: styles.edgeLine }, idx));
                        }), projected.map((p, i) => {
                            const v = vertices[i];
                            if (!p || !v)
                                return null;
                            return (_jsxs("g", { children: [_jsx("circle", { cx: p.x, cy: p.y, r: "0.12", fill: v.color, className: styles.vertexNode }), _jsx("text", { x: p.x + 0.18, y: p.y + 0.04, className: styles.labelText, children: v.label })] }, i));
                        })] })] }) }));
}
//# sourceMappingURL=Tetrahedron.js.map