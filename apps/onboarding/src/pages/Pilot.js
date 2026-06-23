import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useId } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import styles from './Pilot.module.css';
export const Pilot = () => {
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [area, setArea] = useState('');
    const [heard, setHeard] = useState('');
    const nameId = useId();
    const emailId = useId();
    const areaId = useId();
    const heardId = useId();
    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent('BONDING Pilot Sign-Up');
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nArea: ${area}\nHeard from: ${heard}`);
        window.open(`mailto:pilot@bonding.p31ca.org?subject=${subject}&body=${body}`);
        setSubmitted(true);
    };
    return (_jsx(Layout, { children: _jsx("section", { className: styles.section, children: _jsxs("div", { className: styles.inner, children: [_jsx("span", { className: styles.label, children: "Get Involved" }), _jsx("h2", { className: styles.title, children: "Join the Pilot" }), _jsxs("p", { className: styles.desc, children: ["We're running hyperlocal pilots in ", _jsx("strong", { children: "Kingsland/St. Marys, GA" }), ". Sign up below and we'll send you everything you need to get started."] }), submitted ? (_jsxs(Card, { variant: "elevated", className: styles.success, children: [_jsx("span", { className: styles.successIcon, children: "\uD83D\uDCEC" }), _jsx("h3", { children: "You're on the list!" }), _jsxs("p", { children: ["We'll reach out at ", _jsx("strong", { children: email }), " with next steps. In the meantime, try the demo:"] }), _jsx("a", { href: "#/demo", className: styles.demoLink, children: "\uD83E\uDDEA Try the Living Molecule Demo \u2192" })] })) : (_jsx(Card, { variant: "elevated", className: styles.form, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: nameId, children: "Name" }), _jsx("input", { id: nameId, value: name, onChange: e => setName(e.target.value), required: true, placeholder: "Your name" })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: emailId, children: "Email" }), _jsx("input", { id: emailId, type: "email", value: email, onChange: e => setEmail(e.target.value), required: true, placeholder: "you@example.com" })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: areaId, children: "City / Area" }), _jsx("input", { id: areaId, value: area, onChange: e => setArea(e.target.value), required: true, placeholder: "Kingsland, GA" })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: heardId, children: "How did you hear about us?" }), _jsx("input", { id: heardId, value: heard, onChange: e => setHeard(e.target.value), placeholder: "Twitter, friend, etc." })] }), _jsx(Button, { variant: "primary", size: "lg", fullWidth: true, children: "Sign Up \u2192" }), _jsx("p", { className: styles.privacy, children: "No spam. We'll only use this to contact you about the pilot." })] }) })), _jsxs("div", { className: styles.info, children: [_jsx("h3", { children: "What happens next?" }), _jsxs("ol", { className: styles.steps, children: [_jsx("li", { children: "We review your sign-up and confirm your area" }), _jsx("li", { children: "You receive a welcome email with setup instructions" }), _jsx("li", { children: "Open the app, check in, and start bonding" }), _jsx("li", { children: "Share feedback at week 2 and week 4" })] })] })] }) }) }));
};
//# sourceMappingURL=Pilot.js.map