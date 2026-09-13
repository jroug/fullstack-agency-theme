import { useDemoData, recaptchaSiteKey as reCAPTCHA_site_key } from '../services/config';
import React, {  useRef, useLayoutEffect, useEffect } from "react";
import { Link } from "react-router-dom";
import WidgetSimpleTitle from "./Widget_SimpleTitle";
import gsap from "gsap";
import { Helmet } from "react-helmet-async";
import {  gql, useApolloClient  } from "@apollo/client";
import { logginF } from './__Utils';
import __GraphQL_Queries from "./__GraphQL_Queries";
// import ScrollTrigger from "gsap/ScrollTrigger";



const Page_Contact = (props) => {

    const nodeData = props.nodeData;

    // use later in button action
    const client = useApolloClient();

    const [submitting, setSubmitting] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    useEffect(() => {
        document.body.classList.add('contact-us');
        if (useDemoData || !reCAPTCHA_site_key) {
            return () => document.body.classList.remove('contact-us');
        }
        const script = document.createElement('script');
        script.src = "https://www.google.com/recaptcha/api.js?render=" + reCAPTCHA_site_key;
        script.id = "g-rec";
        document.body.appendChild(script);
        return () => {
            document.body.classList.remove('contact-us');
            script.remove();
        };
    }, []);

    const refBox = useRef();

    useLayoutEffect(() => {
        document.getElementById('footer').classList.remove('hidden');
        const ctx = gsap.context(() => {
            gsap.from(refBox.current, {
                transform: "translateY(50px)",
                duration:0.3
            });
        }, refBox);
        return () => {
            document.getElementById('footer').classList.add('hidden');
            ctx.revert();
        }
    }, []);





    const handleContactSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        const form = e.currentTarget;
        const form_name = form.elements.name.value.trim();
        form.elements.name.classList.toggle('input-error', !validateName(form_name));
        setMessage('');
        setErrorMessage('');
        if (!validateName(form_name)) {
            setErrorMessage('Please enter a valid name.');
            return;
        }
        setSubmitting(true);
        try {
            let token = '';
            if (!useDemoData) {
                if (!window.grecaptcha || !reCAPTCHA_site_key) throw new Error('reCAPTCHA is unavailable');
                await new Promise(resolve => window.grecaptcha.ready(resolve));
                token = await window.grecaptcha.execute(reCAPTCHA_site_key, { action: 'submitContact' });
            }
            const resultData = await client.query({
                fetchPolicy: 'no-cache',
                query: gql`query SEND_EMAIL($form_name: String, $form_email: String, $form_message: String, $form_google_token: String){
                    ${__GraphQL_Queries.queries.emailSent}
                }`,
                variables: {
                    form_name,
                    form_email: form.elements.email.value,
                    form_message: form.elements.message.value,
                    form_google_token: token,
                },
            });
            const result = JSON.parse(resultData.data.emailSent);
            if (Number(result.status) === 200) {
                form.reset();
                setMessage(result.message);
            } else {
                setErrorMessage(result.message || 'There was an error. Please try again.');
            }
        } catch (error) {
            setErrorMessage('There was an error. Please try again.');
            logginF(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
              <title>Contact | FORM & FIELD</title>
            </Helmet>
            <WidgetSimpleTitle widgetTitle={nodeData.title} />
            <section ref={refBox} >
                <div className="container-xxl col-lg-6 px-md-5 pb-5">
                    <div className="contact-form-wrap py-5">
                        <h3 style={{'fontWeight': '400'}}>Get in touch with us</h3>
                        {useDemoData && <p>Try the demo form. Messages are not sent or stored.</p>}
                        <form aria-label="Contact form" action="#" method="post" onSubmit={handleContactSubmit} >
                            <input type="text" id="form_name" name="name" placeholder="Name" required maxLength="100" />
                            <input type="email" id="form_email" name="email" placeholder="Email"  required />
                            <textarea id="form_message" name="message" placeholder="Message" style={{'height':"200px"}}  required maxLength="2000"  ></textarea>
                            <input id="contact_submit" disabled={submitting} style={{'backgroundColor': "#FDDD31", 'color': "#1D1D1D", 'fontWeight':"600"}} type="submit" value="Send"  />
                            <div id="contact-msg" className="contact-msg" role="status">{message}</div>
                            <div id="contact-msg-error" className="contact-msg-error" role="alert">{errorMessage}</div>
                        </form>
                    </div>
                    <hr />
                    <div className="contact-info-wrap py-5">
                        <p style={{'color':"#757575"}} >FORM &amp; FIELD — Independent creative studio<br />
                            Athens · Working everywhere<br />
                            Portfolio concept<br />
                            email: <Link to="mailto:hello@example.com">hello@example.com</Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

const validateName = (val) => {
    var reg =  /^[αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩςάέύίόώήϊϋa-zA-Z ]+$/;
    return reg.test(val);
}




export default Page_Contact;
