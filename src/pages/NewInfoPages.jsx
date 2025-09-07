import React from 'react';

// A generic container to give all pages a consistent, professional look
const PageContainer = ({ title, children }) => (
    <main className="info-page-container">
        <header className="info-page-header">
            <h1>{title}</h1>
        </header>
        <div className="info-page-content">
            {children}
        </div>
    </main>
);

export const NewsroomPage = () => (
    <PageContainer title="Newsroom">
        <p>Welcome to the OnTrac Newsroom, your official source for the latest announcements, media resources, and stories about our mission to revolutionize the logistics industry.</p>
        
        <div className="info-section">
            <h2>Recent Press Releases</h2>
            <p><strong>September 4, 2025</strong> - OnTrac Announces Expansion of Transcontinental Service, Reducing Coast-to-Coast Shipping Times by 20%.</p>
            <p><strong>August 15, 2025</strong> - OnTrac Partners with Eco-Packaging Inc. to Achieve 95% Recyclable Materials in All Shipments.</p>
        </div>

        <div className="info-section">
            <h2>Media Contact</h2>
            <p>For all media inquiries, please contact our public relations team:</p>
            <p><strong>Email:</strong> <a href="mailto:press@ontracourier.us">press@ontracourier.us</a></p>
        </div>
    </PageContainer>
);

export const CareersPage = () => (
    <PageContainer title="Careers at OnTrac">
        <p>Join a team that's building the future of logistics. At OnTrac, we believe that our people are our greatest asset. We're looking for passionate, innovative, and driven individuals to help us connect the world, one package at a time.</p>
        
        <div className="info-section">
            <h2>Why Work With Us?</h2>
            <ul>
                <li><strong>Competitive Compensation:</strong> We offer competitive salaries and comprehensive benefits packages.</li>
                <li><strong>Growth Opportunities:</strong> We are committed to the professional development of our employees.</li>
                <li><strong>Innovative Culture:</strong> Be part of a tech-forward company that's solving real-world challenges.</li>
            </ul>
        </div>

         <div className="info-section">
            <h2>Open Positions</h2>
            <p>We are always looking for talented individuals. Please visit our <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn page</a> for a list of current openings.</p>
        </div>
    </PageContainer>
);

export const SustainabilityPage = () => (
    <PageContainer title="Our Commitment to Sustainability">
        <p>At OnTrac, we recognize that our responsibility extends beyond delivering packages. We are deeply committed to minimizing our environmental impact and creating a more sustainable future for the logistics industry.</p>
        
        <div className="info-section">
            <h2>Our Green Initiatives</h2>
            <ul>
                <li><strong>Eco-Friendly Packaging:</strong> We actively promote and utilize packaging solutions made from recycled and biodegradable materials.</li>
                <li><strong>Route Optimization:</strong> Our advanced logistics software ensures the most efficient delivery routes, reducing fuel consumption and carbon emissions.</li>
                <li><strong>Electric Fleet Investment:</strong> We are progressively transitioning our last-mile delivery vehicles to a fully electric fleet.</li>
            </ul>
        </div>
    </PageContainer>
);

export const InternationalShippingPage = () => (
    <PageContainer title="International Shipping Solutions">
        <p>Go global with confidence. OnTrac provides reliable, seamless international shipping services to connect your business to over 220 countries and territories worldwide.</p>

        <div className="info-section">
            <h2>Our Services</h2>
            <ul>
                <li><strong>Global Express:</strong> For your most urgent shipments, with delivery in 1-3 business days.</li>
                <li><strong>Standard International:</strong> A cost-effective solution for less urgent deliveries, with full tracking capabilities.</li>
                <li><strong>Freight & Cargo:</strong> Tailored solutions for large-scale and bulk international shipments.</li>
            </ul>
        </div>
    </PageContainer>
);

export const BusinessEnterprisePage = () => (
    <PageContainer title="Business & Enterprise Solutions">
         <p>Your business deserves a logistics partner that scales with you. OnTrac offers tailored shipping solutions for businesses of all sizes, from growing e-commerce stores to large multinational corporations.</p>

        <div className="info-section">
            <h2>Why Partner with OnTrac?</h2>
            <ul>
                <li><strong>Dedicated Account Management:</strong> A single point of contact to manage all your shipping needs.</li>
                <li><strong>Volume Discounts:</strong> Competitive pricing structures that reward your growth.</li>
                <li><strong>API Integration:</strong> Seamlessly integrate OnTrac's shipping capabilities into your existing e-commerce platform or ERP.</li>
            </ul>
        </div>
    </PageContainer>
);

export const D2CDeliveryPage = () => (
    <PageContainer title="Direct-to-Consumer (D2C) Delivery">
        <p>In the world of e-commerce, the delivery experience is part of your brand. OnTrac specializes in D2C shipping, ensuring your products reach your customers quickly, safely, and with the professionalism your brand deserves.</p>
        
        <div className="info-section">
            <h2>Features for E-Commerce</h2>
            <ul>
                <li><strong>Fast Last-Mile Delivery:</strong> Delight your customers with rapid delivery times.</li>
                <li><strong>Real-Time Tracking:</strong> Provide your customers with up-to-the-minute tracking information.</li>
                <li><strong>Easy Returns Management:</strong> A streamlined returns process to enhance customer satisfaction.</li>
            </ul>
        </div>
    </PageContainer>
);

export const CustomsInfoPage = () => (
    <PageContainer title="Customs & Duties Information">
        <p>Navigating international customs can be complex. This guide provides essential information to help ensure your shipments clear customs smoothly.</p>

        <div className="info-section">
            <h2>Frequently Asked Questions</h2>
            <p><strong>What are customs duties and taxes?</strong><br/>These are fees imposed by a country's government on imported goods. The amount is typically based on the value, type, and origin of the goods.</p>
            <p><strong>Who is responsible for payment?</strong><br/>The recipient of the shipment is typically responsible for paying any applicable duties and taxes.</p>
            <p><strong>How can I ensure my package clears customs quickly?</strong><br/>Provide a detailed and accurate description of the goods and their value on the commercial invoice. Incorrect information is the most common cause of delays.</p>
        </div>
    </PageContainer>
);


export const ContactPage = () => (
    <PageContainer title="Contact Us">
        <p>We're here to help. Whether you have a question about a shipment, need a quote, or want to discuss business solutions, our team is ready to assist you.</p>

        <div className="contact-grid">
            <div className="contact-details">
                <h3>Direct Contact</h3>
                <p><strong>General Support:</strong><br/><a href="mailto:support@ontracourier.us">support@ontracourier.us</a></p>
                <p><strong>Phone:</strong><br/><a href="tel:+17077875797">+1 (707) 787 5797</a></p>
                <p><strong>Corporate Office:</strong><br/>7400 W Buckeye Rd<br/>Phoenix, AZ 85043</p>
            </div>
            <form className="contact-form">
                <h3>Send Us a Message</h3>
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />

                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>

                <button type="submit">Submit Message</button>
            </form>
        </div>
    </PageContainer>
);
