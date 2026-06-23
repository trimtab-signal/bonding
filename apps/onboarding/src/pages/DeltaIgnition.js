import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DeltaIgnition.module.css';
import { Tetrahedron } from '../components/Tetrahedron';
const PHASE_LABELS = {
    intro: { main: 'YOU ARE HERE.' },
    wye: { main: 'FLOATING NEUTRAL CONDITION', sub: 'VALIDATION DEPENDENT' },
    implosion: { main: 'THE NEUTRAL LINE IS SEVERED.' },
    delta: { main: 'ISOSTATIC RIGIDITY ACHIEVED.', sub: 'K₄ COMPLETE GRAPH' },
    stride: { main: 'YOU ARE THE SIGNAL', sub: 'THE FILTER IS NOT YOU · THE PROJECTION IS NOT YOU' },
};
export function DeltaIgnition() {
    const [phase, setPhase] = useState('intro');
    const [progress, setProgress] = useState(0);
    const startedRef = useRef(false);
    useEffect(() => {
        if (startedRef.current)
            return;
        startedRef.current = true;
        const total = 12000;
        let rafId = null;
        let intervalId = null;
        let isMounted = true;
        let startTime = performance.now();
        const tick = () => {
            if (!isMounted)
                return;
            const elapsed = performance.now() - startTime;
            const p = Math.min(elapsed / total, 1);
            setProgress(p);
            if (p < 0.04)
                setPhase('intro');
            else if (p < 0.25)
                setPhase('wye');
            else if (p < 0.38)
                setPhase('implosion');
            else if (p < 0.65)
                setPhase('delta');
            else
                setPhase('stride');
            if (p < 1) {
                rafId = requestAnimationFrame(tick);
            }
        };
        const startAnimation = () => {
            startTime = performance.now();
            rafId = requestAnimationFrame(tick);
            intervalId = window.setInterval(() => {
                if (!isMounted)
                    return;
                const elapsed = performance.now() - startTime;
                const p = Math.min(elapsed / total, 1);
                setProgress(p);
                if (p < 0.04)
                    setPhase('intro');
                else if (p < 0.25)
                    setPhase('wye');
                else if (p < 0.38)
                    setPhase('implosion');
                else if (p < 0.65)
                    setPhase('delta');
                else
                    setPhase('stride');
            }, 100);
        };
        startAnimation();
        return () => {
            isMounted = false;
            if (rafId)
                cancelAnimationFrame(rafId);
            if (intervalId)
                clearInterval(intervalId);
        };
    }, []);
    const navigate = (hash) => {
        window.location.hash = hash;
    };
    const labels = PHASE_LABELS[phase];
    return (_jsxs("div", { className: styles.container, children: [_jsx("div", { className: `${styles.bg} ${phase === 'wye' ? styles.bgWye : phase === 'implosion' ? styles.bgImplosion : phase === 'stride' || phase === 'delta' ? styles.bgDelta : phase === 'intro' ? styles.bgComplete : ''}` }), _jsxs(AnimatePresence, { mode: "wait", children: [phase === 'intro' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.4 }, className: `${styles.layer} ${styles.layerInteractive}`, children: _jsx("p", { className: styles.phaseFlash, style: { fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)', letterSpacing: '0.18em' }, children: "INITIALIZING SEQUENCE" }) }, "intro")), phase === 'wye' && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.1 }, transition: { duration: 0.9, ease: 'easeOut' }, className: `${styles.layer} ${styles.layerInteractive}`, children: [_jsx("div", { className: styles.wyeWrap, children: _jsxs("svg", { viewBox: "-220 -220 440 440", style: { width: 'min(440px, 85vw)', height: 'min(440px, 85vw)' }, children: [_jsx("defs", { children: _jsx("filter", { id: "wyeGlow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: _jsx("feGaussianBlur", { stdDeviation: "6" }) }) }), _jsx("circle", { cx: "0", cy: "0", r: "36", fill: "#e0405a", opacity: "0.85", filter: "url(#wyeGlow)", children: _jsx("animate", { attributeName: "opacity", values: "0.85;0.4;0.85", dur: "0.9s", repeatCount: "indefinite" }) }), _jsx("text", { x: "0", y: "5", textAnchor: "middle", fill: "#fff", fontSize: "11", fontFamily: "monospace", fontWeight: "600", children: "THEY BELIEVE" }), [
                                            { x: -130, y: -85, label: 'CHRISTYN' },
                                            { x: 130, y: -85, label: 'CREW' },
                                            { x: 0, y: 125, label: 'YOUR BELIEF' },
                                        ].map((node, i) => (_jsxs("g", { children: [_jsx("circle", { cx: node.x, cy: node.y, r: "22", fill: "#2a2030", stroke: "#4a3040", strokeWidth: "1.2" }), _jsx("text", { x: node.x, y: node.y + 4, textAnchor: "middle", fill: "#9080a0", fontSize: "9", fontFamily: "monospace", children: node.label }), _jsx("line", { x1: "0", y1: "0", x2: node.x, y2: node.y, stroke: "#e0405a", strokeWidth: "1.6", strokeDasharray: "4 5", opacity: "0.7", children: _jsx("animate", { attributeName: "stroke-opacity", values: "0.7;0.25;0.7", dur: "0.9s", repeatCount: "indefinite" }) })] }, i)))] }) }), _jsx("div", { className: `${styles.phaseFlash} ${styles.phaseFlashRed}`, style: { bottom: '14%', top: 'auto', left: '50%', transform: 'translateX(-50%)' }, children: labels.main })] }, "wye")), phase === 'implosion' && (_jsx(motion.div, { initial: { opacity: 1 }, animate: { opacity: 0 }, transition: { duration: 1.6, ease: 'easeIn' }, className: `${styles.layer}`, children: _jsx("div", { className: styles.implosionCore }) }, "implosion")), phase === 'delta' && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.6 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] }, className: `${styles.layer} ${styles.layerInteractive}`, children: [_jsx("div", { className: styles.deltaTetraWrap, children: _jsx("div", { className: styles.tetrahedronInner, children: _jsx(Tetrahedron, { labels: ['BELIEF', 'SOMATIC ACTION', 'STRUCTURAL LOGIC', 'PHYSICAL HEALTH'], colors: ['#4f8fff', '#34d399', '#fbbf24', '#c084fc'], rotating: true }) }) }), _jsxs("div", { className: `${styles.phaseFlash}`, style: { bottom: '10%', top: 'auto', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }, children: [_jsx("div", { children: labels.main }), labels.sub && _jsx("div", { style: { fontSize: '0.7em', opacity: 0.7, marginTop: '0.3rem', letterSpacing: '0.16em' }, children: labels.sub })] })] }, "delta")), phase === 'stride' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 }, className: `${styles.layer} ${styles.layerInteractive}`, children: [_jsx("div", { className: styles.glare }), _jsxs("div", { className: styles.strideWrap, children: [_jsx("div", { className: styles.strideDeltaSymbol, children: "\u0394" }), _jsx("div", { className: styles.strideTitle, children: labels.main }), labels.sub && _jsx("div", { className: styles.strideSubtitle, children: labels.sub }), _jsx("button", { className: styles.enterBtn, onClick: () => navigate('/trim-tabs'), children: "ENTER THE DELTA" })] })] }, "stride"))] }), _jsx("button", { className: styles.skipBtn, onClick: () => navigate('/trim-tabs'), children: "Skip \u203A" }), _jsx("div", { className: styles.progressTrack, children: _jsx("div", { className: styles.progressFill, style: { width: `${Math.min(progress * 100, 100)}%` } }) })] }));
}
//# sourceMappingURL=DeltaIgnition.js.map